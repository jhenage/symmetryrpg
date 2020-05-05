export interface WeightData {
  frameSizeFactor: { // total weight proportionality constant for frame size symmetric
    average: number; // human = 1.0
    stddev: number; // human = 0.05
  };
  organMassFactor: number; // mass of organs proportionality constant, human = 6.2
  fatMassFactor: { // mass of fat porportionality constant for body fat symmetric
    minimum: number; // human 0.0
    average: number; // human 6.2
    stddev: number; // human 10.0
  };
  boneMassFactor: number; // mass of bones proportionality constant, human = 3.5
  muscleMassFactor: number; // mass of muscles proportionality constant, human = 10.5
  brawnFactor: { // brawn proportionality constant affects for bone and muscle
    minimum: number; // human = 0.75 
    average: number; // human = 1.0
    stddev: number; // human = 0.05
  };
  toughnessFactor: { // toughness proportionality constant for bone and muscle
    minimum: number; // human = 0.9
    average: number; // human = 1.0
    stddev: number; // human = 0.01
  };
  muscleBulkFactor: { // mass of bone and muscle scaling factor for muscle bulk symmetric
    minimum: number; // human = 0.75
    average: number; // human = 1.0
    stddev: number; // human = 0.1
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

}