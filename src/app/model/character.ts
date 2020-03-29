import { About, AboutData } from './character/about';
import { Actions, ActionData } from './character/actions'
import { Aspects, AspectsData } from './character/aspects';
import { Equipment, EquipmentData } from './character/equipment';
import { Fatigue, FatigueData } from './character/fatigue';
import { Skills, SkillsData } from './character/skills';
import { Specialties, SpecialtiesData } from './character/specialties';
import { Spells, SpellsData } from './character/spells';
import { Tap, TapData } from './character/tap';
import { Traits, TraitsData } from './character/traits';
import { Wounds, WoundData } from './character/wounds';
import { CreatureType } from './creaturetype';

export interface ModifiableStat {
  amount: number;
  modified?: {
    time: number;
    amount: number;
  }[];
}

export function ModifiedValue(time:number,data:ModifiableStat): number {
  if ( !data.modified ) {
    data.modified = [];
  }

  for(let i = data.modified.length; i > 0; i--) {
    if ( data.modified[i-1].time <= time ) {
      return data.modified[i-1].amount;
    }
  }

  return data.amount;

}

export function ChangeModifiedValue(time:number,data:ModifiableStat,amount:number): void {
  
  if ( amount == ModifiedValue(time,data) ) {
    return;
  }

  let i = data.modified.length;
  if ( i == 0 || data.modified[i-1].time < time ) {
    data.modified.push({time:time,amount:amount});
    return;
  }

  if ( data.modified[i-1].time == time ) {
    data.modified[i-1].amount = amount;
  }

  if ( data.modified[i-1].time == time ) {
    throw new Error('Invalid time '+time);
  }
  
}

interface LocationData {
  time: number;
  x: number;
  y: number;
  velx?: number;
  vely?: number;
}

export class Character {

  protected _data: {
    createdAt: number;  // tick count of creation
    creatureType: number;
    about: AboutData;
    actions: ActionData[];
    aspects: AspectsData;
    equipment: EquipmentData;
    fatigue: FatigueData;
    skills: SkillsData;
    specialties: SpecialtiesData;
    spells: SpellsData;
    tap: TapData;
    traits: TraitsData;
    wounds: WoundData;
    location: LocationData[];
    qi: ModifiableStat;
    token: string; // url to image
  }
  readonly id: number;

  about: About;
  actions: Actions;
  aspects: Aspects;
  equipment: Equipment;
  fatigue: Fatigue;
  skills: Skills;
  specialties: Specialties;
  spells: Spells;
  tap: Tap;
  traits: Traits;
  wounds: Wounds;
  creatureType: CreatureType;

  constructor(id: number,creatureType: CreatureType,data: any) {
    this.id = id;
    this.creatureType = creatureType;

    if ( typeof data === "number" ) {
      this.about = new About(this);
      this.actions = new Actions(this);
      this.aspects = new Aspects(this);
      this.skills = new Skills(this);
      this.specialties = new Specialties(this);
      this.spells = new Spells(this);
      this.traits = new Traits(this);
      this.wounds = new Wounds(this);
      this.equipment = new Equipment(this);
      this.tap = new Tap(this);
      this.fatigue = new Fatigue(this);

      this._data = {createdAt:data,location:[],token:'',creatureType:0,
                    qi:{amount:0},
                    about:this.about.initialize(),
                    actions: this.actions.initialize(),
                    aspects: this.aspects.initialize(),
                    skills: this.skills.initialize(),
                    specialties: this.specialties.initialize(),
                    spells: this.spells.initialize(),
                    traits: this.traits.initialize(),
                    wounds: this.wounds.initialize(),
                    equipment: this.equipment.initialize(),
                    tap: this.tap.initialize(),
                    fatigue: this.fatigue.initialize()
      };

    }
    
    else {
      this._data = data;
      this.about = new About(this,this._data.about);
      this.actions = new Actions(this,this._data.actions);
      this.aspects = new Aspects(this,this._data.aspects);
      this.skills = new Skills(this,this._data.skills);
      this.specialties = new Specialties(this,this._data.specialties);
      this.spells = new Spells(this,this._data.spells);
      this.traits = new Traits(this,this._data.traits);
      this.wounds = new Wounds(this,this._data.wounds);
      this.equipment = new Equipment(this,this._data.equipment);
      this.tap = new Tap(this,this._data.tap);
      this.fatigue = new Fatigue(this,this._data.fatigue);
    }

  }

  serialize(): string { return JSON.stringify(this._data); }
  get createdAt(): number { return this._data.createdAt; }

  generalPenalty(time:number): number {
    return 0;
  }

  WeightLbs(time:number): number {
    return this.WeightKg(time) * 2.2;
  }

  // This is based off of BMI. Human BMI is 6 + 12*bodyType + (0.4+0.4*bodyType)*(0.7*brawn+0.3*toughness)
  // extreme body Types require minimum aspect scores for normal functioning and can even be lethal
  WeightKg(time:number): number {
    let bmi = this.creatureType.weight.bmiOffset;
    bmi += this.creatureType.weight.bodyTypeFactor * this.about.CurrentBodyType(time);
    let aspectValue = this.creatureType.weight.brawnFactor*this.aspects.Current(time,'brawn') + 
                      (1 - this.creatureType.weight.brawnFactor)*this.aspects.Current(time,'toughness');
    let aspectMultiplier = this.creatureType.weight.aspectFactor + 
                           this.about.CurrentBodyType(time)*this.creatureType.weight.combinedFactor;
    bmi += aspectValue*aspectMultiplier;
    let height = this.about.HeightMeter(time);
    return height * height * bmi;
  }

  Endurance(time:number): number { 
    let endurance = this.aspects.Current(time,'toughness') / this.about.CurrentBodyType(time);
    //if ( this.traits.endurance ) {
    //  if ( this.traits.greatEndurance ) {
    //    if ( this.traits.epicEndurance ) {
    //      if ( this.traits.ultEndurance ) {
    //        return endurance + 15;
    //      }
    //      return endurance + 9;
    //    }
    //    return endurance + 5;
    //  }
    //  return endurance + 2;
    //}
    return endurance;
  }

  Qi(time: number): number {
    return ModifiedValue(time,this._data.qi);
  }

  MaxQi(): number { return 10; }

  AddQi(time: number, amount: number): void {
    return ChangeModifiedValue(time,this._data.qi,ModifiedValue(time,this._data.qi)+amount);
  }

  location(time:number): LocationData {
    let result = {time:time,x:0,y:0,velx:0,vely:0};
    if(this._data.location.length==0) {
      return result;
    }
    for(let i = this._data.location.length; i > 0; i--) {
      if ( this._data.location[i-1].time <= time ) {
        let duration = time - this._data.location[i-1].time;

        result.velx = this._data.location[i-1].velx;
        result.vely = this._data.location[i-1].vely;
        result.x = this._data.location[i-1].x + duration * this._data.location[i-1].velx;
        result.y = this._data.location[i-1].y + duration * this._data.location[i-1].vely;

        return result;
      }
    }
 
  }

  setLocation(data: LocationData) {
    let i = this._data.location.length;
    if(i && this._data.location[i-1].time == data.time) {
      for ( let name in data ) {
        this._data.location[i-1][name] = data[name];
      }
    } else {
      if ( typeof data.velx == 'undefined' ) {
        let location = this.location(data.time);
        data.velx = location.velx;
        data.vely = location.vely;
      }
      this._data.location.push(data);
    }
  }

  protected LimbsMovementFactor(time: number, limbList: string[]): number { // weighted avg of all participating limbs and penalties
    if(!limbList || limbList.length == 0) return 0;
    var result = 1;
    limbList.forEach((limb) => { // build up product for geometric mean
      result *= this.creatureType.limbs[limb].locomotion;
      result *= this.creatureType.limbs[limb].reach;
      result *= 0.7 ** this.fatigue.Penalty(limb,time);
      result *= 0.7 ** this.wounds.Penalty(limb,time);
    });
    result **= 1 / limbList.length; // finish taking geometric mean
    result *= 0.7 ** this.fatigue.Penalty('aerobic',time);
    return result;
  }

  MaxSpeed(time: number, limbList: string[], carriedWeight: number): number { // spd in m/s
    var result = this.skills.getBaseResult(this.aspects.Current(time,'brawn'),'athlete',0) - 1;
    if(result <=0) return 0;
    result *= 0.5 * this.LimbsMovementFactor(time,limbList) * this.about.HeightMeter(time);
    result *= (100/(this.WeightKg(time)+carriedWeight))**0.25;
    return result;
  }

  MaxAcceleration(time: number, limbList: string[], carriedWeight: number): number { // accel in m/s/s
    var result = (this.aspects.Current(time,'brawn') / 5) ** 1.5;
    result *= 100 * this.LimbsMovementFactor(time,limbList) / (this.WeightKg(time)+carriedWeight);
    return result;
  }

}