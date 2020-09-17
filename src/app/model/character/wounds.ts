import { Character, ModifiableStat, ModifiedValue } from '../character'
export interface WoundData {
  bleed: {
    time: number;
    bloodLoss: number; // 0-49 only fatigue, 50-99 penalties, at 100 organs shut down 
    bleedRate: number; // bloodLoss per second
  }[];
  wounds: {
    [propName: string]: { // Location (e.g. leftArm,head,torso)
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
    }[]    
  }

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

  Penalty(location: string, time: number): number {
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

  ReceiveImpactDamage(time:number, energy: number, length: number, diameter: number, location: string) {
    var wound = {
      initial: { // the initial wound object
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

    var {give, tissues} = this.character.TissueSizes(time,location);
    var width = give > diameter/2 ? diameter : 2*Math.sqrt(diameter*give - give*give); // contact width of weapon

    var targetLength = this.character.TargetLength(time,location);
    var targetWidth = 0;
    tissues.forEach(element => {
      targetWidth += element.thickness;
    });
    targetWidth *= 2;

    // Will want to strike at different orientations, right now just doing perpendicular:
    width = width < targetLength ? width : targetLength;
    length = length < targetWidth ? length : width;
    var surfaceArea = length * width;

    tissues.forEach(element => {
      if(energy<=0) return;
      let tissueProps = this.character.creatureType.tissues[element.tissue].impact;
      let volume = surfaceArea * element.thickness;

      // TISSUE SPECIFIC AFFLICTIONS:
      if(element.tissue == 'skin') {
        
        // welt
        if(energy/volume >= tissueProps.break/2) {
          let penalty = energy/volume/tissueProps.break/2;
          if(penalty>0.5) penalty = 0.5;
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
        if(energy/volume >= tissueProps.break) {
          wound.bleed = .001 * energy / tissueProps.break;
        }
      }

      if(element.tissue == 'muscle') {

        // fatigue
        if(location=='torso') {
          wound.fatigue = {'aerobic': energy/volume};
        }
        else if(location=='head') {
          wound.fatigue = {'mental': energy/volume};
        }
        else {
          wound.fatigue = {'muscle': energy/volume};
        }
        
        // injured muscle
        let penalty = energy*2/volume/tissueProps.break;
        wound.tap += penalty*2;
        if(energy/volume >= tissueProps.break/4) {
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
        if(energy/volume >= tissueProps.break/4) {
          let description = 'Hairline Fracture';
          if(energy/volume >= tissueProps.break/2) {
            description = 'Compound Fracture';
            if(energy/volume >= tissueProps.break) {
              description = 'Shattered Bone';
            }
          }
          let penalty = energy*4/volume/tissueProps.break;
          wound.afflictions.push({
            description: description,
            penalty: {amount:penalty},
            global: 0.5,
            recoverywait: 12,
            recoveryinterval: 6
          });
        }
      }

      // transfer to the next layer
      energy -= tissueProps.absorb * volume;
    });

    if(wound.afflictions.length || wound.tap) {
      this._data.wounds[location].push(wound);
    }
    return wound;
  }


}