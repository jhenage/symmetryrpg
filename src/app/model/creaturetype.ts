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
  bodyTypes: {
    label: string;
    amount: number; // between 0 and 10, human average = 1, reflecting more variation on heavier side (1-10) than on thin side (0-1)
  }[];
  weight: { // = bmi * height^2 (using SI units); bmi calculated from the factors in this object
    bmiOffset: number; // min 0, increases minimum bmi (humans = 6)
    bodyTypeFactor: number; // min 0, increases base effect of body type (humans = 12)
    aspectFactor: number; // min 0, increases base effect of aspect scores (humans = 0.4)
    combinedFactor: number; // min 0, increases effect of body type and aspect scores on each other (humans = 0.4)
    brawnFactor: number; // between 0 and 1, fraction of brawn vs toughness (humans = 0.7)
  };
}


export class CreatureType {

  protected _data: CreatureTypeData;

  constructor(data?: CreatureTypeData) {
    if (data) {
      this._data = data;
    }
  }
  
  get weight() {
    return this._data.weight;
  }

  get bodyTypes() {
    return this._data.bodyTypes;
  }

  get name() {
    return this._data.name;
  }

  get limbs() {
    return this._data.limbs;
  }

}