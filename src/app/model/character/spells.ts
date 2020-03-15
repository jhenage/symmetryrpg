interface SpellsData {
}

export class Spells {

  protected _data: SpellsData;
 
  constructor(data?: SpellsData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): SpellsData {
    this._data = {};
    return this._data;
  }

}