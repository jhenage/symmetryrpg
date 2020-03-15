interface AspectsData {
  brawn: number;
  toughness: number;
  agility: number;
  reflex: number;
  cleverness: number;
  serenity: number;
  impression: number;
  awareness: number;
}

export class Aspects {

  protected _data: AspectsData;
 
  constructor(data?: AspectsData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): AspectsData {
    this._data = {
      brawn: 5,
      toughness: 5,
      agility: 5,
      reflex: 5,
      cleverness: 5,
      serenity: 5,
      impression: 5,
      awareness: 5
    };
    return this._data;
  }

  get brawn(): number {
    return this._data.brawn;
  }

  set brawn(newValue) {
     this._data.brawn = Number(newValue || 5);
  }

  get toughness(): number {
    return this._data.toughness;
  }

  set toughness(newValue) {
     this._data.toughness = Number(newValue || 5);
  }

  get agility(): number {
    return this._data.agility;
  }

  set agility(newValue) {
     this._data.agility = Number(newValue || 5);
  }

  get reflex(): number {
    return this._data.reflex;
  }

  set reflex(newValue) {
     this._data.reflex = Number(newValue || 5);
  }

  get cleverness(): number {
    return this._data.cleverness;
  }

  set cleverness(newValue) {
     this._data.cleverness = Number(newValue || 5);
  }

  get serenity(): number {
    return this._data.serenity;
  }

  set serenity(newValue) {
     this._data.serenity = Number(newValue || 5);
  }

  get impression(): number {
    return this._data.impression;
  }

  set impression(newValue) {
     this._data.impression = Number(newValue || 5);
  }

  get awareness(): number {
    return this._data.awareness;
  }

  set awareness(newValue) {
     this._data.awareness = Number(newValue || 5);
  }


}