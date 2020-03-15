import { About } from './character/about';
import { Aspects } from './character/aspects';
import { Skills } from './character/skills';
import { Specialties } from './character/specialties';
import { Spells } from './character/spells';
import { Traits } from './character/traits';
import { Wounds } from './character/wounds';
import { Equipment } from './character/equipment';
import { Tap } from './character/tap';
import { Fatigue } from './character/fatigue';
import { CreatureType } from './creaturetype';


export class Character {

  protected _data: {
    createdAt: number;  // tick count of creation
    creatureType: number;
    about: { };
    aspects: { };
    skills: { };
    specialties: { };
    spells: { };
    traits: { };
    equipment: { };
    wounds: { };
    tap: { };
    fatigue: {};
    location: {
      time: number;
      x: number;
      y: number;
      velx: number;
      vely: number;
    }[];
    qi: {
      time: number;
      amount: number;
    }[];
    token: string; // url to image
  }
  readonly id: number;

  about: About;
  aspects: Aspects;
  skills: Skills;
  specialties: Specialties;
  spells: Spells;
  traits: Traits;
  wounds: Wounds;
  equipment: Equipment;
  tap: Tap;
  fatigue: Fatigue;
  creatureType: CreatureType;

  constructor(id: number,creatureType: CreatureType,data) {
    this.id = id;
    this.creatureType = creatureType;
    
    if(data) {
      this._data = data;
      this.about = new About(this._data.about);
      this.aspects = new Aspects(this._data.aspects);
      this.skills = new Skills(this._data.skills);
      this.specialties = new Specialties(this._data.specialties);
      this.spells = new Spells(this._data.spells);
      this.traits = new Traits(this._data.traits);
      this.wounds = new Wounds(this._data.wounds);
      this.equipment = new Equipment(this._data.equipment);
      this.tap = new Tap(this,this._data.tap);
      this.fatigue = new Fatigue(this._data.fatigue);
    }
    else {
      this.about = new About();
      this.aspects = new Aspects();
      this.skills = new Skills();
      this.specialties = new Specialties();
      this.spells = new Spells();
      this.traits = new Traits();
      this.wounds = new Wounds();
      this.equipment = new Equipment();
      this.tap = new Tap(this);
      this.fatigue = new Fatigue();

      this._data = {createdAt:0,location:[],qi:[],token:'',creatureType:0,
                    about:this.about.initialize(),
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
  }

  serialize(): string { return JSON.stringify(this._data); }
  get createdAt(): number { return this._data.createdAt; }

  get weight(): number {
    return this.WeightKg() * 2.2;
  }

  // This is based off of BMI. Human BMI is 11 + 10*bodyType + bodyType*toughness
  // . This is set so that at the thinnest bodyType anything below toughness 5 is underweight
  // . At average bodyType and toughness, you are barely overweight
  WeightKg(): number {
    let bmi = this.creatureType.weight.bmiOffset;
    bmi += this.creatureType.weight.btFactor * this.about.bodyType;
    bmi += this.about.bodyType * this.aspects.toughness;
    let height = this.about.HeightMeter();
    return height * height * bmi * this.creatureType.weight.multiplier;
  }

  Endurance(): number { 
    let endurance = this.aspects.toughness / this.about.bodyType;
    if ( this.traits.endurance ) {
      if ( this.traits.greatEndurance ) {
        if ( this.traits.epicEndurance ) {
          if ( this.traits.ultEndurance ) {
            return endurance + 15;
          }
          return endurance + 9;
        }
        return endurance + 5;
      }
      return endurance + 2;
    }
    return endurance;
  }

  Qi(time: number): number {
    if(this._data.qi.length == 0) {
      this._data.qi.push({time:this._data.createdAt,amount:this.MaxQi()});
    }
    for(let i = this._data.qi.length; i > 0; i--) {
      if ( this._data.qi[i-1].time <= time ) {
        return this._data.qi[i-1].amount;
      }
    }
    throw new Error("invalid time " + time);
  }

  MaxQi(): number { return 10; }

  AddQi(time: number, amount: number): void {
    let qi = this.Qi(time) + amount;
    for(let i = this._data.qi.length; i > 0; i--) {
      if ( this._data.qi[i-1].time == time ) {
        this._data.qi[i-1].amount = qi;
        return;
      }
      if ( this._data.qi[i-1].time < time ) {
        this._data.qi.splice(i,0,{time:time,amount:qi});

        i++;
        while(i < this._data.qi.length) {
          this._data.qi[i].amount += amount;
          i++;
        }
        return;
      }
    }
    throw new Error("invalid time " + time)
  }

}