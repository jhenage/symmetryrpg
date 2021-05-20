import { Character, ModifiableStat, ModifiedValue } from '../character'
export interface WoundData {
  bleed: {
    time: number;
    bloodLoss: number; // 0-49 only fatigue, 50-99 penalties, at 100 organs shut down 
    bleedRate: number; // bloodLoss per second
  }[];
  wounds: {
    [propName: string]: WoundSingle[] // Location (e.g. leftArm,head,torso)
  }
}

export interface WoundSingle {
  initial: { // the initial wound object
    time: number;
    impact: {
      energy: number;
      diameter: number;
      length: number;
    }
    cutting: number;
    elemental: number;
  };
  end?: number; // time of last affliction healed
  afflictions: {
      description: string;
      penalty: ModifiableStat;
      global: number; // global * penalty = the global penalty
      recoverywait: number; // days before each set of recovery tests (which heals 1 penalty)
      recoveryinterval: number; // hours between recovery test in a set
  }[]
  fatigue: {[propName: string]: number}; // fatigue types applied
  tap: number;
  bleed: number;
  bleedHealed: number;
}

export class Wounds {

  protected _data: WoundData;
  character: Character;
 
  constructor(character: Character,data?: WoundData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): WoundData {
    this._data = {bleed:[],wounds:{}};
    return this._data;
  }

  penalty(location: string, time: number): number {
    if(!this._data.wounds[location]) return 0;
    let penalty = 0;
    this._data.wounds[location].forEach(element => {
      if(element.end && element.end < time) return;
      if(element.afflictions.length == 0) {
        element.end = element.initial.time;
        return;
      }
      if ( time < element.initial.time ) return;
      
      let newpenalty = 0;
      element.afflictions.forEach(afflict => {
        newpenalty += ModifiedValue(time,afflict.penalty);
      });
      penalty += newpenalty;

      if(newpenalty==0) {
      element.end = element.initial.time;
        element.afflictions.forEach(afflict => {
          let endtime = afflict.penalty.modified[afflict.penalty.modified.length-1].time;
          if(element.end<endtime) element.end = endtime;
        });  
      }
    });

    for(let otherlocation in this._data.wounds) {
      if(otherlocation==location) continue;

      this._data.wounds[otherlocation].forEach(element => {
        if(element.end && element.end < time) return;
        if(element.afflictions.length == 0) {
          element.end = element.initial.time;
          return;
        }
        if ( time < element.initial.time ) return;
        
        element.afflictions.forEach(afflict => {
          penalty += ModifiedValue(time,afflict.penalty) * afflict.global;
        });
      });
    }

    return penalty;
  }

  receiveImpactDamage(time:number, energy: number, length: number, diameter: number, location: string): WoundSingle {
    var wound: WoundSingle = {
      initial: {
        time: time,
        impact: {
          energy: energy,
          diameter: diameter,
          length: length,
        },
        cutting: 0,
        elemental: 0
      },
      afflictions: [],
      fatigue: {},
      tap: 0,
      bleed: 0,
      bleedHealed: 0
    }

    var {give, tissues} = this.character.tissueSizes(time,location);
    var width = give > diameter/2 ? diameter : 2*Math.sqrt(diameter*give - give*give); // contact width of weapon

    var targetLength = this.character.targetLength(time,location);
    var targetWidth = 0;
    tissues.forEach(element => {
      targetWidth += element.thickness;
    });
    targetWidth *= 2;

    // Will want to strike at different orientations, right now just doing perpendicular:
    width = Math.min(width, targetLength);
    length = Math.min(length, targetWidth);
    var surfaceArea = length * width;

    tissues.forEach(element => {
      if(energy<=0) return;
      let tissueProps = this.character.creatureType.tissues[element.tissue].impact;
      let volume = surfaceArea * element.thickness;

      let absorbed = 0; // total amount of energy being applied to this tissue;
      let maxBreak = volume * tissueProps.break;
      let maxEnergyPerStep = maxBreak / 4; // Max Absorption available for each quarter of break threshold reached
      for(let i = 4; i > 0; i--) { // each quarter of break threshold reached
        let percent = tissueProps.absorb * element.thickness * (2**i) / 16; // DR based on thickness, cut in half each step
        if(percent > 25*i) percent = 25*i; // Max DR allowed per step: 100%, 75%, 50%, 25%
        let canabsorb = percent * energy / 100;
        if(canabsorb > maxEnergyPerStep) {
          absorbed += maxEnergyPerStep;
          energy -= maxEnergyPerStep;
        } else {
          absorbed += canabsorb;
          energy -= canabsorb;
          break;
        }
      }
      console.log(element,energy,absorbed,absorbed/maxBreak);

      // TISSUE SPECIFIC AFFLICTIONS:
      if(element.tissue == 'skin') {
        
        // welt
        if(absorbed >= maxBreak/2) {
          let penalty = absorbed/volume/tissueProps.break/2;
          wound.afflictions.push({
            description: 'Welt',
            penalty: {amount:penalty},
            global: location=='torso' ? 0.5 : 0,
            recoverywait: 2,
            recoveryinterval: 1
          });
          wound.tap += penalty;
        }

        // split skin
        if(absorbed >= maxBreak) {
          wound.bleed = .00001 * Math.sqrt(surfaceArea) * energy / absorbed;
        }
      }

      if(element.tissue == 'muscle') {

        // fatigue
        if(location=='torso') {
          wound.fatigue = {'aerobic': absorbed/volume};
        }
        else if(location=='head') {
          wound.fatigue = {'mental': absorbed/volume};
        }
        else {
          wound.fatigue = {'muscle': absorbed/volume};
        }
        wound.tap += absorbed/volume/50;
        
        // injured muscle
        let penalty = (absorbed*2/maxBreak)**2 - 1;
        if(absorbed >= maxBreak/2) {
          wound.tap += penalty*2;
          wound.afflictions.push({
            description: 'Pulled Muscle/Sprain',
            penalty: {amount:penalty},
            global: 0.5,
            recoverywait: 6,
            recoveryinterval: 3
          });
        }

      }

      if(element.tissue == 'bone') {
        if(absorbed >= maxBreak/2) {
          let description = 'Hairline Fracture';
          if(absorbed >= maxBreak*3/4) {
            description = 'Compound Fracture';
            if(absorbed >= maxBreak) {
              description = 'Shattered Bone';
            }
          }
          let penalty = (absorbed*2/maxBreak)**2;
          wound.afflictions.push({
            description: description,
            penalty: {amount:penalty},
            global: 0.5,
            recoverywait: 10,
            recoveryinterval: 10
          });
        }
      }

    });

    if(wound.afflictions.length || wound.tap) {
      console.log(this._data)
      if(!this._data.wounds[location]) this._data.wounds[location] = [];
      this._data.wounds[location].push(wound);
    }
    return wound;
  }

  


}