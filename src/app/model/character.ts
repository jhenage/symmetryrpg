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
  
  amount = Number(amount);
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

  if ( data.modified[i-1].time > time ) {
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

  // clear all temporary data. For after cloning character
  resetAll() {
    this._data.fatigue.aerobic = [];
    this._data.fatigue.muscles = {};
    this._data.location = [];
    this._data.qi.modified = [];
    this._data.about.height.modified = [];
    this.aspects.aspectsList.forEach((aspect) => {
      this._data.aspects[aspect].modified = [];
    });
    this._data.actions.splice(0,this._data.actions.length);
  }

  // truncate all logs to one entry. For after archiving character
  resetHistory(time: number) {
    this._data.createdAt = time;
    this.fatigue.AddAerobicRate(time,0);
    this._data.fatigue.aerobic.splice(0,this._data.fatigue.aerobic.length-1);
    for( let muscle in this._data.fatigue.muscles ) {
      this.fatigue.AddMuscleRate(time,0,muscle);
      this._data.fatigue.muscles[muscle].splice(0,this._data.fatigue.muscles[muscle].length-1);
    }
    this._data.location = [this.location(time)];
    this._data.qi = {amount:this.MaxQi(),modified:[{time:time,amount:this.Qi(time)}]};
    this._data.about.height.modified = [{time:time,amount:this.about.HeightMeter(time)}];
    this.aspects.aspectsList.forEach((aspect) => {
      this._data.aspects[aspect].modified = [{time:time,amount:this.aspects.Current(time,aspect)}];
    });
    this._data.actions.splice(0,this._data.actions.findIndex((value)=> value.time > time));
  }

  generalPenalty(time:number): number {
    return 0;
  }

  WeightLbs(time:number): number {
    return this.WeightKg(time) * 2.2;
  }

  // 
  WeightKg(time:number): number {
    let weight = this.creatureType.weight;
    let frameSizeFactor = this.interpretSymmetric(this.about.frameSize, weight.frameSizeFactor);
    let fatMassFactor = this.interpretSymmetric(this.about.bodyFat, weight.fatMassFactor);
    let boneFrameFactor = this.interpretSymmetric(this.about.frameSize, weight.boneFrameFactor);
    let boneToughnessFactor = this.interpretSymmetric(this.aspects.Current(time,"toughness"), weight.boneToughnessFactor);
    let muscleBulkFactor = this.interpretSymmetric(this.about.muscleBulk, weight.muscleBulkFactor);
    let muscleBrawnFactor = this.interpretSymmetric(this.aspects.Current(time,"brawn"), weight.muscleBrawnFactor);
    let result = weight.organWeightFactor + fatMassFactor + boneFrameFactor + boneToughnessFactor;
    result += muscleBrawnFactor * muscleBulkFactor;
    return result * ( this.about.HeightMeter(time) ** (1 + frameSizeFactor) );
  }

  // for normal or log-normal distributions; data.minimum signals the use of log-normal distributions
  interpretSymmetric(symmetric: number, data: {minimum?: number, average: number, stddev: number}) {
    if(symmetric >= 0 || isNaN(data.minimum) ) {
      return data.average + data.stddev * symmetric;
    } else {
      return data.minimum + (data.average - data.minimum) * Math.exp(symmetric);
    }
  }

  Endurance(time:number): number { 
    let endurance = (7.5 + 0.5*this.aspects.Current(time,'toughness')) * ((8 - this.about.muscleBulk) ** 2) / 64;
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

  MaxQi(time?: number): number { return 10; }

  AddQi(time: number, amount: number): void {
    return ChangeModifiedValue(time,this._data.qi,ModifiedValue(time,this._data.qi)+amount);
  }

  SetQi(time: number, amount: number): void {
    return ChangeModifiedValue(time,this._data.qi,amount);
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
        result.x = this._data.location[i-1].x + duration * this._data.location[i-1].velx / 1000;
        result.y = this._data.location[i-1].y + duration * this._data.location[i-1].vely / 1000;

        return result;
      }
    }
    return result;
 
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
    result *= 0.8 ** this.fatigue.Penalty('aerobic',time);
    return result;
  }

  MaxSpeed(time: number, limbList: string[], carriedWeight: number): number { // spd in m/s
    var result = this.skills.getBaseResult(this.aspects.Current(time,'brawn'),'athlete',0);
    result < 0 ? result = result * 0.6 : result = result / 0.6;
    result += 9;
    result *= 0.5 * this.LimbsMovementFactor(time,limbList) * this.about.HeightMeter(time);
    result *= (100/(this.WeightKg(time)+carriedWeight))**0.25;
    return result;
  }

  MaxAcceleration(time: number, limbList: string[], carriedWeight: number): number { // accel in m/s/s
    var result = (this.aspects.Current(time,'brawn'));
    result < 0 ? result = result * 0.12 : result = result / 3;
    result++;
    result **= 1.5;
    result *= 100 * this.LimbsMovementFactor(time,limbList) / (this.WeightKg(time)+carriedWeight);
    return result;
  }

  getSpentIPTotal(): number {
    return this.aspects.getSpentIPTotal() + this.skills.getSpentIPTotal();
  }

  get isOverBudget(): boolean {
    return this.about.improvementPoints < 0;
  }

}