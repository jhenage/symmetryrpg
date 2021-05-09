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
import { CreatureType } from './creaturetype';
import { Campaign } from './campaign';
import { Scene } from './scene';
import { RollData, Rolls } from './character/rolls';

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

export class Character {

  protected _data: {
    creatureType: number;
    about: AboutData;
    actions: ActionData[];
    aspects: AspectsData;
    equipment: EquipmentData;
    fatigue: FatigueData;
    rolls: RollData[];
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
  rolls: Rolls;
  skills: Skills;
  specialties: Specialties;
  spells: Spells;
  tap: Tap;
  traits: Traits;
  wounds: Wounds;
  scene: Scene;
  creatureTypeIndex: number;

  constructor(id: number,creatureTypeIndex: number,data: any,scene: Scene) {
    this.id = id;
    this.creatureTypeIndex = creatureTypeIndex;
    this.scene = scene;

    if ( ! data ) {
      this.about = new About(this);
      this.actions = new Actions(this);
      this.aspects = new Aspects(this);
      this.rolls = new Rolls(this);
      this.skills = new Skills(this);
      this.specialties = new Specialties(this);
      this.spells = new Spells(this);
      this.traits = new Traits(this);
      this.wounds = new Wounds(this);
      this.equipment = new Equipment(this);
      this.tap = new Tap(this);
      this.fatigue = new Fatigue(this);

      this._data = {location:[],token:'',creatureType:creatureTypeIndex,
                    qi:{amount:0},
                    about:this.about.initialize(),
                    actions: this.actions.initialize(),
                    aspects: this.aspects.initialize(),
                    rolls: this.rolls.initialize(),
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
      this.rolls = new Rolls(this,this._data.rolls);
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
  get creatureType(): CreatureType { return this.campaign.creatureTypes[this.creatureTypeIndex]; }
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
    this._data.rolls = [];
  }

  // truncate all logs to one entry. For after archiving character
  resetHistory(time: number) {
    //this._data.createdAt = time;
    this.fatigue.AddAerobicRate(time,0);
    this._data.fatigue.aerobic.splice(0,this._data.fatigue.aerobic.length-1);
    for( let muscle in this._data.fatigue.muscles ) {
      this.fatigue.AddMuscleRate(time,0,muscle);
      this._data.fatigue.muscles[muscle].splice(0,this._data.fatigue.muscles[muscle].length-1);
    }
    this._data.location = [this.location(time)];
    this._data.qi = {amount:this.MaxQi(time),modified:[{time:time,amount:this.Qi(time)}]};
    this._data.about.height.modified = [{time:time,amount:this.about.HeightMeter(time)}];
    this.aspects.aspectsList.forEach((aspect) => {
      this._data.aspects[aspect].modified = [{time:time,amount:this.aspects.Current(time,aspect)}];
    });
    this._data.actions.splice(0,this._data.actions.findIndex((value)=> value.time > time));
    this._data.rolls.splice(0,this._data.rolls.findIndex((value)=> value.time > time));
    // still need wounds
  }

  generalPenalty(time:number): number {
    return 0;
  }

  limbPenalty(time:number, location:string): number {
    return 0;
  }

  WeightLbs(time:number): number {
    return this.WeightKg(time) * 2.2;
  }

  WeightKg(time:number): number {
    let breakdown = this.WeightKgBreakdown(time);
    return breakdown.boneMass + breakdown.fatMass + breakdown.muscleMass + breakdown.organMass;
  }

  WeightKgBreakdown(time:number): MassBreakdown {
    let weight = this.creatureType.weight;
    let frameSizeFactor = this.interpretSymmetric(this.about.frameSize, weight.frameSizeFactor);
    let fatMassFactor = this.interpretSymmetric(this.about.bodyFat, weight.fatMassFactor);
    let brawnFactor = this.interpretSymmetric(this.aspects.Current(time,"brawn"), weight.brawnFactor);
    let toughnessFactor = this.interpretSymmetric(this.aspects.Current(time,"toughness"), weight.toughnessFactor);
    let muscleBulkFactor = this.interpretSymmetric(this.about.muscleBulk, weight.muscleBulkFactor);
    let scale = (this.about.HeightMeter(time) ** 2) * frameSizeFactor;
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
  
  TissueSizes(time:number, location:string): { give:number, tissues: {tissue:string,thickness:number}[] } {
    var target = this.creatureType.targets.torso;
    target = undefined;
    location.split('.').forEach(element => {
      target = target ? target.targets[element] : this.creatureType.targets[element];
    });

    let brawnFactor = this.creatureType.weight.brawnFactor;
    let toughnessFactor = this.creatureType.weight.toughnessFactor;
    let brawn = this.interpretSymmetric(this.aspects.Current(time,"brawn"), {
      minimum: brawnFactor.minimum/brawnFactor.average,
      average: 1,
      stddev: brawnFactor.stddev/brawnFactor.average
    });
    let toughness = this.interpretSymmetric(this.aspects.Current(time,"toughness"), {
      minimum: toughnessFactor.minimum/toughnessFactor.average,
      average: 1,
      stddev: toughnessFactor.stddev/toughnessFactor.average
    });
    
    var give = 0;
    var tissues = [];
    target.layers.forEach(element => {
      give += this.creatureType.tissues[element.tissue].impact.give * element.thickness;
      let thickness = element.thickness;
      if(element.tissue == 'fat') {
        let fmf = this.creatureType.weight.fatMassFactor;
        thickness = this.interpretSymmetric(this.about.bodyFat, {
          minimum: fmf.minimum*thickness/fmf.average,
          average: thickness,
          stddev: fmf.stddev*thickness/fmf.average
        });
      }
      if(element.tissue == 'muscle') {
        let bulkFactor = this.creatureType.weight.muscleBulkFactor;
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

  TargetLength(time:number, location:string): number {
    var target = this.creatureType.targets.torso;
    target = undefined;
    location.split('.').forEach(element => {
      target = target ? target.targets[element] : this.creatureType.targets[element];
    });
    return target.length * this.about.HeightMeter(time) / this.creatureType.height.average;
  }

  Endurance(time:number): number { 
    let endurance = this.getBaseEndurance(this.aspects.Current(time,"toughness"));
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

  Qi(time: number): number {
    return Math.min(ModifiedValue(time,this._data.qi),this.MaxQi(time));
  }

  MaxQi(time: number): number { 
    let result = this.creatureType.qi.average + this.creatureType.qi.stddev * this.aspects.Current(time,"serenity");
    return Math.max(this.creatureType.qi.minimum,Math.round(result)) * this.qiMultiplier;
  }

  get qiMultiplier(): number {
    let multiplier = 1;
    if(this.traits.hasTrait("qiAwareness")) {
      multiplier++;
      ["Action","Body","Finesse","Mind","Reaction","Strength"].forEach(aspectGroup => {
        ["philosophyOf","focused","dedicatedTo"].forEach(philosophyLevel => {
          if(this.traits.hasTrait(philosophyLevel + aspectGroup)) multiplier++;
        });
      });
      if(this.traits.hasTrait("qiReserves")) multiplier += 2;
      if(this.traits.hasTrait("greaterQiReserves")) multiplier += 3;
      if(multiplier > 10) multiplier = 10;
    }
    return multiplier;
  }

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
    if(this.traits.hasTrait("swift")) result++;
    if(this.traits.hasTrait("epicSwiftness")) result += 2;
    result < 0 ? result = result * 0.6 : result = result / 0.6;
    result += 9;
    if(result <= 0) return 0;
    result *= 0.5 * this.LimbsMovementFactor(time,limbList) * this.about.HeightMeter(time);
    result *= (100/(this.WeightKg(time)+carriedWeight))**0.5;
    return result;
  }

  MaxAcceleration(time: number, limbList: string[], carriedWeight: number): number { // accel in m/s/s
    var result = (this.aspects.Current(time,'brawn'));
    if(this.traits.hasTrait("swift")) result++;
    if(this.traits.hasTrait("epicSwiftness")) result += 2;
    result < 0 ? result = result * 0.12 : result = result / 3;
    result++;
    if(result <=0) return 0;
    result **= 1.5;
    result *= 100 * this.LimbsMovementFactor(time,limbList) / (this.WeightKg(time)+carriedWeight);
    return result;
  }

  PhysicalDefense(time: number): number {
    let result = this.skills.getBaseResult(this.aspects.Current(time,"reflex"),"fighter") - 3;
    let unarmed = this.specialties.getSpecialtyRank("unarmedCombat")
    if(unarmed > 0) result += 1.5;
    if(unarmed > 1) result += 0.5;
    return result;
  }

  MagicalDefense(time: number): number {
    let result = this.skills.getBaseResult(this.aspects.Current(time,"awareness"),"mage") - 3;
    if(this.traits.hasTrait("qiAwareness")) result += 2;
    return result;
  }

  getSpentIPTotal(): number {
    return this.aspects.getSpentIPTotal() + this.skills.getSpentIPTotal() + 
           this.specialties.getSpentIPTotal() + this.traits.getSpentIPTotal() +
           this.equipment.getSpentIPTotal();
  }

  get isOverBudget(): boolean {
    return this.about.improvementPoints < 0;
  }

  // returns a descriptive string representing the status/probability of a symmetric with this value
  // rounds symmetric to the nearest 0.1, 
  getProbabilityDescription(symmetric: number): string {
    if(symmetric < -7) return "subnatural";
    if(symmetric > 7) return "supernatural";
    if(symmetric == 0) return "average";
    let prefix = symmetric < 0 ? "<" : ">";
    let index = Math.round(Math.abs(symmetric)*10);
    let result = this.attributeProbabilities[index];
    if(result.slice(-1) != "%") prefix = "1 in ";
    return prefix + result;
  }

}