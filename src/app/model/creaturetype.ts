interface CreatureTypeData {
  name: string;
  limbs: {
    [propName: string]: {
      dexterity: number; // how well it can use an item
      locomotion: number; // how well it can move the creature
      muscleSize: number; // strength modifier and aerobic fatigue impact
      reach: number; // in meters
    }
  };
  height: {
    average: number;
    stddev: number;
  };
  bodyTypes: {
    label: string;
    amount: number;
  }[];
  weight: { // = multiplier * height^2 * (bmiOffset + btFactor * bodyType + bodyType * toughness)
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

}