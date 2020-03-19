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

export interface BasicTestResult {
  standardResult: number;
  lowluckResult: number;
}

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
    location: {
      time: number;
      x: number;
      y: number;
      velx: number;
      vely: number;
    }[];
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

  WeightLbs(time:number): number {
    return this.WeightKg(time) * 2.2;
  }

  // This is based off of BMI. Human BMI is 11 + 10*bodyType + bodyType*toughness
  // . This is set so that at the thinnest bodyType anything below toughness 5 is underweight
  // . At average bodyType and toughness, you are barely overweight
  WeightKg(time:number): number {
    let bmi = this.creatureType.weight.bmiOffset;
    bmi += this.creatureType.weight.btFactor * this.about.CurrentBodyType(time);
    bmi += this.about.CurrentBodyType(time) * this.aspects.Current(time,'toughness');
    let height = this.about.HeightMeter(time);
    return height * height * bmi * this.creatureType.weight.multiplier;
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

  getDieRoll(sides: number): number {
    return 1 + Math.floor(Math.random()*sides);
  }

  getTestResults(): BasicTestResult {
    var standardResult = 0;
    var lowluckResult = 0;
    for(var i=0; i<2; i++) {
      var die = this.getDieRoll(8);
      if(die==1) die = 5;
      standardResult += die;
      if(die < 4) {
        lowluckResult += 4;
      } else if(die >6) {
        lowluckResult += 6;
      } else {
        lowluckResult += 5;
      }
    }
    return {
      standardResult: standardResult,
      lowluckResult: lowluckResult
    }
  }

  makeAspectTest(time:number, aspectName:string) {
    console.log(this.aspects.getTestResult(time,aspectName));
  }

  makeSkillTest(time:number, aspectName:string, skillName:string) {
    console.log(this.skills.getTestResult(this.aspects.Current(time,aspectName),skillName));
  }

}