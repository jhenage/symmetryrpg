export interface WeightData {
  frameSizeFactor: { // mass is proportional to height ** (1 + frameSizeFactor)
    average: number; // human = 1, ie. mass proportional to height squared
    stddev: number; // human = 0.05
  };
  boneFrameFactor: { // mass of bones proportionality constant for portion from frame size symmetric
    minimum: number; // human = 1.5
    average: number; // human = 2.5
    stddev: number; // human = 0.5
  };
  boneToughnessFactor: { // mass of bones proportionality constant for portion from toughness
    minimum: number; // human = 0
    average: number; // human = 0.6
    stddev: number; // human = 0.2
  };
  organWeightFactor: number; // mass of organs proportionality constant, human = 5.6
  muscleBrawnFactor: { // mass of muscle proportionality constant dependent on brawn
    minimum: number; // human = NaN (indicates to use a normal instead of log-normal distribution)
    average: number; // human = 9
    stddev: number; // human = 1
  };
  muscleBulkFactor: { // mass of muscle scaling factor for muscle bulk symmetric
    minimum: number; // human = 0.6
    average: number; // human = 1
    stddev: number; // human = 0.09
  };
  fatMassFactor: { // mass of fat porportionality constant dependent on body fat symmetric
    minimum: number; // human 0.05
    average: number; // human 0.25
    stddev: number; // human 0.80
  };
}

export interface CreatureTypeData {
  name: string;
  limbs: {
    [propName: string]: {
      dexterity: number; // how well it can use an item
      locomotion: number; // *effective* step size as a fraction of its reach, human legs = 0.85, human arms = 0.05 
      muscleSize: number; // strength modifier and aerobic fatigue impact
      reach: number; // as a fraction of the creature's height, human legs = 0.5, human arms = 0.375
    }
  };
  height: {
    average: number;
    stddev: number;
  };
  weight: WeightData;
  targets: {
    torso: TargetData;
    [propName: string]: TargetData;
  };
  tissues: {  // damage properties of each tissue layer
    [propName: string]: {
      impact: {
        absorb: number; // amount of damage absorbed per cubic mm
        give: number; // percent[0-1] of the layer that can compress under pressure
        break: number; // amount of damage per cubic mm before tissue is punctured
      };
      cutting: {
        break: number; // amount of damage before penetration
      };
    };
  };
}

interface TargetData {
  length: number; // typical length in mm of body part (as a cylinder)
  layers?: { // Tissue layers. Must have layers or targets.
    tissue: string; // tissue ID
    thickness: number; // average thickness in mm
  }[]; 
  targets?: { // Sub targets if this is a group
    [propName: string]: TargetData;
  }
}


export class CreatureType {

  protected _data: CreatureTypeData;

  constructor(data?: CreatureTypeData) {
    if (data) {
      this._data = data;
    }
  }
  
  get name() {
    return this._data.name;
  }

  get limbs() {
    return this._data.limbs;
  }

  get limbList() {
    return Object.keys(this._data.limbs);
  }

  get height(): {average: number, stddev: number} {
    return this._data.height;
  }

  get weight(): WeightData {
    return this._data.weight;
  }

  get targets() {
    return this._data.targets;
  }

  get tissues() {
    return this._data.tissues;
  }

}