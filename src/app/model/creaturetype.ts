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
    amount: number; // human average = 1
  }[];
  weight: { // = multiplier * height^2 * (bmiOffset + btFactor * bodyType + (1+bodyType)*(0.35*brawn+0.15*toughness) )
    bmiOffset: number; // humans = 11
    btFactor: number; // humans = 10
    multiplier: number; // humans = 1
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