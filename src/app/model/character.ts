import { About, AboutData } from './character/about';
import { Actions, ActionData } from './character/actions'
import { Aspects, AspectsData } from './character/aspects';
import { Equipment, EquipmentData } from './character/equipment';
import { Fatigue, FatigueData } from './character/fatigue';
import { Skills, SkillsData } from './character/skills';
import { Specialties, SpecialtiesData, SpecialtyCategories } from './character/specialties';
import { Spells, SpellsData } from './character/spells';
import { Tap, TapData } from './character/tap';
import { Traits, TraitsData } from './character/traits';
import { Wounds, WoundData } from './character/wounds';
import { Specie } from './specie';
import { Campaign } from './campaign';
import { Scene } from './scene';

export interface ModifiableStat {
  amount: number;
  modified?: {
    time: number;
    amount: number;
  }[];
}

export interface MassBreakdown {
  boneMass: number;
  fatMass: number;
  muscleMass: number;
  organMass: number;
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

export interface Strike {
  location: string[];  // could be two handed.
  diameter: number; // mm
  length: number; // mm
  reach: number; // m
  name: string;
}

export class Character {

  protected _data: {
    specie: number;
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
  readonly attributeProbabilities = ["50%","54%","58%","62%","66%","69%","73%","76%","79%","82%","84%","86%","88%",
    "10","12","15","18","22","28","35","44","56","72","93","120","160","220","300","400","500","700","1000","1500",
    "2000","3000","4000","6000","9000","14K","21K","32K","48K","75K","120K","180K","300K","500K","800K","1.3M","2M",
    "3.5M","6M","10M","17M","30M","53M","93M","170M","300M","550M","1B","1.9B","3.5B","6.7B","13B","25B","49B","96B",
    "190B","380B","780B"];

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
  scene: Scene;
  specieIndex: number;

  constructor(id: number,specieIndex: number,data: any,scene: Scene) {
    this.id = id;
    this.specieIndex = specieIndex;
    this.scene = scene;

    if ( ! data ) {
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

      this._data = {location:[],token:'',specie:specieIndex,
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
  //get createdAt(): number { return this._data.createdAt; }
  get specie(): Specie { return this.campaign.species[this.specieIndex]; }
  get campaign(): Campaign { return this.scene.campaign; }

  // clear all temporary data. For after cloning character
  resetAll() {
    this._data.fatigue.aerobic = [];
    this._data.fatigue.muscles = {};
    this._data.wounds.bleed = [];
    this._data.wounds.wounds = {};
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
    //this._data.createdAt = time;
    this.fatigue.addAerobicRate(time,0);
    this._data.fatigue.aerobic.splice(0,this._data.fatigue.aerobic.length-1);
    for( let muscle in this._data.fatigue.muscles ) {
      this.fatigue.addMuscleRate(time,0,muscle);
      this._data.fatigue.muscles[muscle].splice(0,this._data.fatigue.muscles[muscle].length-1);
    }
    this._data.location = [this.location(time)];
    this._data.qi = {amount:this.maxQi(time),modified:[{time:time,amount:this.qi(time)}]};
    this._data.about.height.modified = [{time:time,amount:this.about.heightMeter(time)}];
    this.aspects.aspectsList.forEach((aspect) => {
      this._data.aspects[aspect].modified = [{time:time,amount:this.aspects.current(time,aspect)}];
    });
    this._data.actions.splice(0,this._data.actions.findIndex((value)=> value.time > time));
    // still need wounds
  }

  generalPenalty(time:number): number {
    return 0;
  }

  limbPenalty(time:number, location:string): number {
    return 0;
  }

  weightLbs(time:number): number {
    return this.weightKg(time) * 2.2;
  }

  weightKg(time:number): number {
    let breakdown = this.weightKgBreakdown(time);
    return breakdown.boneMass + breakdown.fatMass + breakdown.muscleMass + breakdown.organMass;
  }

  weightKgBreakdown(time:number): MassBreakdown {
    let weight = this.specie.weight;
    let frameSizeFactor = this.interpretSymmetric(this.about.frameSize, weight.frameSizeFactor);
    let fatMassFactor = this.interpretSymmetric(this.about.bodyFat, weight.fatMassFactor);
    let brawnFactor = this.interpretSymmetric(this.aspects.current(time,"brawn"), weight.brawnFactor);
    let toughnessFactor = this.interpretSymmetric(this.aspects.current(time,"toughness"), weight.toughnessFactor);
    let muscleBulkFactor = this.interpretSymmetric(this.about.muscleBulk, weight.muscleBulkFactor);
    let scale = (this.about.heightMeter(time) ** 2) * frameSizeFactor;
    let organMass = weight.organMassFactor * scale;
    let fatMass = fatMassFactor * scale;
    scale *= brawnFactor * toughnessFactor * muscleBulkFactor;
    return {
      boneMass: weight.boneMassFactor * scale,
      fatMass: fatMass,
      muscleMass: weight.muscleMassFactor * scale,
      organMass: organMass
    };
  }

  weightKgTarget(time:number, location:string): number {
    return this.weightKg(time) / 6;
//    let breakdown = this.weightKgTargetBreakdown(time, location);
//    return breakdown.boneMass + breakdown.fatMass + breakdown.muscleMass + breakdown.organMass;
  }

//  weightKgTargetBreakdown(time:number, location:string): MassBreakdown {
//    let weight = this.specie.weight;
//    let frameSizeFactor = this.interpretSymmetric(this.about.frameSize, weight.frameSizeFactor);
//    let fatMassFactor = this.interpretSymmetric(this.about.bodyFat, weight.fatMassFactor);
//    let brawnFactor = this.interpretSymmetric(this.aspects.current(time,"brawn"), weight.brawnFactor);
//    let toughnessFactor = this.interpretSymmetric(this.aspects.current(time,"toughness"), weight.toughnessFactor);
//    let muscleBulkFactor = this.interpretSymmetric(this.about.muscleBulk, weight.muscleBulkFactor);
//    let scale = (this.about.heightMeter(time) ** 2) * frameSizeFactor;
//    let organMass = weight.organMassFactor * scale;
//    let fatMass = fatMassFactor * scale;
//    scale *= brawnFactor * toughnessFactor * muscleBulkFactor;
//    return {
//      boneMass: weight.boneMassFactor * scale,
//      fatMass: fatMass,
//      muscleMass: weight.muscleMassFactor * scale,
//      organMass: organMass
//    };
//  }

  // for normal or log-normal distributions; data.minimum signals the use of log-normal distributions
  interpretSymmetric(symmetric: number, data: {minimum?: number, average: number, stddev: number}) {
    if(symmetric >= 0 || isNaN(data.minimum) ) {
      return data.average + data.stddev * symmetric;
    } else {
      return data.minimum + (data.average - data.minimum) * Math.exp(symmetric*0.6931472); // each full point below zero gets half way to the minimum value
    }
  }

  getBaseEndurance(toughness: number): number {
    return Math.max(0.5,(8 + toughness) * ((1 - this.about.muscleBulk/14) ** 2));
  }
  
  tissueSizes(time:number, location:string): { give:number, tissues: {tissue:string,thickness:number}[] } {
    var target = this.specie.targets.torso;
    target = undefined;
    location.split('.').forEach(element => {
      target = target ? target.targets[element] : this.specie.targets[element];
    });

    let brawnFactor = this.specie.weight.brawnFactor;
    let toughnessFactor = this.specie.weight.toughnessFactor;
    let brawn = this.interpretSymmetric(this.aspects.current(time,"brawn"), {
      minimum: brawnFactor.minimum/brawnFactor.average,
      average: 1,
      stddev: brawnFactor.stddev/brawnFactor.average
    });
    let toughness = this.interpretSymmetric(this.aspects.current(time,"toughness"), {
      minimum: toughnessFactor.minimum/toughnessFactor.average,
      average: 1,
      stddev: toughnessFactor.stddev/toughnessFactor.average
    });
    
    var give = 0;
    var tissues = [];
    target.layers.forEach(element => {
      give += this.specie.tissues[element.tissue].impact.give * element.thickness;
      let thickness = element.thickness;
      if(element.tissue == 'fat') {
        let fmf = this.specie.weight.fatMassFactor;
        thickness = this.interpretSymmetric(this.about.bodyFat, {
          minimum: fmf.minimum*thickness/fmf.average,
          average: thickness,
          stddev: fmf.stddev*thickness/fmf.average
        });
      }
      if(element.tissue == 'muscle') {
        let bulkFactor = this.specie.weight.muscleBulkFactor;
        let bulk = this.interpretSymmetric(this.about.muscleBulk, {
          minimum: bulkFactor.minimum/bulkFactor.average,
          average: 1,
          stddev: bulkFactor.stddev/bulkFactor.average
        });
        thickness *= bulk * brawn * toughness;
      }
      if(element.tissue == 'bone') {
        thickness *= brawn * toughness;
      }
      tissues.push({tissue:element.tissue,thickness:thickness});
    });
    return {give:give,tissues:tissues};
  }

  targetLength(time:number, location:string): number {
    var target = this.specie.targets.torso;
    target = undefined;
    location.split('.').forEach(element => {
      target = target ? target.targets[element] : this.specie.targets[element];
    });
    return target.length * this.about.heightMeter(time) / this.specie.height.average;
  }

  endurance(time:number): number { 
    let endurance = this.getBaseEndurance(this.aspects.current(time,"toughness"));
    if ( this.traits.hasTrait("endurance") ) {
      if ( this.traits.hasTrait("greatEndurance") ) {
        if ( this.traits.hasTrait("epicEndurance") ) {
          if ( this.traits.hasTrait("supremeEndurance") ) {
            endurance += 6;
          }
          endurance += 4;
        }
        endurance += 3;
      }
      endurance += 2;
    } else if ( this.traits.hasTrait("anemia") ) {
      if ( this.traits.hasTrait("severeAnemia") ) {
        endurance --;
      }
      endurance--;
    }
    return endurance;
  }

  qi(time: number): number {
    return Math.min(ModifiedValue(time,this._data.qi),this.maxQi(time));
  }

  maxQi(time: number): number { 
    let result = this.specie.qi.average + this.specie.qi.stddev * (this.aspects.permanent("serenity") + this.traits.getAttributeMod("serenityForQiCapacity"));
    return Math.max(this.specie.qi.minimum,Math.round(result)) * this.qiMultiplier;
  }

  get qiMultiplier(): number {
    return Math.min(10, 1 + this.traits.getAttributeMod("qiMultiplier"));
  }

  addQi(time: number, amount: number): void {
    return ChangeModifiedValue(time,this._data.qi,ModifiedValue(time,this._data.qi)+amount);
  }

  setQi(time: number, amount: number): void {
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

  protected limbsMovementFactor(time: number, limbList: string[]): number { // weighted avg of all participating limbs and penalties
    if(!limbList || limbList.length == 0) return 0;
    var result = 1;
    limbList.forEach((limb) => { // build up product for geometric mean
      result *= this.specie.limbs[limb].locomotion;
      result *= this.specie.limbs[limb].reach;
      result *= 0.7 ** this.fatigue.penalty(limb,time);
      result *= 0.7 ** this.wounds.penalty(limb,time);
    });
    result **= 1 / limbList.length; // finish taking geometric mean
    result *= 0.8 ** this.fatigue.penalty('aerobic',time);
    return result;
  }

  maxSpeed(time: number, limbList: string[], carriedWeight: number): number { // spd in m/s
    var result = this.skills.getBaseResult(this.aspects.current(time,'brawn')+this.traits.getAttributeMod("brawnForSpeed"),'athlete',0);
    result < 0 ? result = result * 0.6 : result = result / 0.6;
    result += 9;
    if(result <= 0) return 0;
    result *= 0.5 * this.limbsMovementFactor(time,limbList) * this.about.heightMeter(time);
    result *= (100/(this.weightKg(time)+carriedWeight))**0.5;
    return result;
  }

  maxAcceleration(time: number, limbList: string[], carriedWeight: number): number { // accel in m/s/s
    var result = (this.aspects.current(time,'brawn')+this.traits.getAttributeMod("brawnForAcceleration"));
    result < 0 ? result = result * 0.12 : result = result / 3;
    result++;
    if(result <=0) return 0;
    result **= 1.5;
    result *= 100 * this.limbsMovementFactor(time,limbList) / (this.weightKg(time)+carriedWeight);
    return result;
  }

  physicalDefense(time: number): number {
    let result = this.skills.getBaseResult(this.aspects.current(time,"reflex"),"fighter") - 3;
    let unarmed = this.specialties.getSpecialtyRank("unarmedCombat")
    if(unarmed > 0) result += 1.5;
    if(unarmed > 1) result += 0.5;
    return result;
  }

  magicalDefense(time: number): number {
    let result = this.skills.getBaseResult(this.aspects.current(time,"perception"),"mage") - 3;
    return result + this.traits.getAttributeMod("magicalDefense");
  }

  getSpentIPTotal(): number {
    return this.aspects.getSpentIPTotal() + this.skills.getSpentIPTotal() + 
           this.specialties.getSpentIPTotal() + this.traits.getSpentIPTotal() +
           this.equipment.getSpentIPTotal() + this.spells.getSpentIPTotal();
  }

  get isOverBudget(): boolean {
    return this.about.improvementPoints < 0;
  }

  // returns a descriptive string representing the status/probability of a symmetric with this value
  // rounds symmetric to the nearest 0.1, 
  getBasicProbabilityDescription(symmetric: number): string {
    if(symmetric < -7 || symmetric > 7) return "";
    if(symmetric == 0) return "50%";
    let prefix = symmetric < 0 ? "<" : ">";
    let index = Math.round(Math.abs(symmetric)*10);
    let result = this.attributeProbabilities[index];
    if(result.slice(-1) != "%") prefix = "1 in ";
    return prefix + result;
  }

  getProbabilityDescriptionPrefix(symmetric: number): string {
    if(symmetric < -7) return "Subhuman";
    if(symmetric <= -5.5) return "Appaling";
    if(symmetric <= -4) return "Abysmal";
    if(symmetric <= -2.5) return "Terrible";
    if(symmetric <= -1.5) return "Lousy";
    if(symmetric <= -0.5) return "Poor";
    if(symmetric < 0) return "Below average"; 
    if(symmetric == 0) return "Average";
    if(symmetric < 0.5) return "Above average";
    if(symmetric < 1.5) return "Good";
    if(symmetric < 2.5) return "Excellent";
    if(symmetric < 4) return "Outstanding";
    if(symmetric < 5.5) return "Amazing";
    if(symmetric <= 7) return "Incredible";
    return "Superhuman";
  }

  getFullProbabilityDescription(symmetric: number): string {
    let result = this.getBasicProbabilityDescription(symmetric);
    if(result.length > 0) result = " (" + result + ")";
    return this.getProbabilityDescriptionPrefix(symmetric) + result;
  }

  get strikes(): Strike[] {
    return [{
      name: "Punch",
      location: ["rightArm"],
      diameter: 8,
      length: 8,
      reach: 1
    }]
  }

}