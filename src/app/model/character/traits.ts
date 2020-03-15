interface TraitsData {
  [propName: string]: boolean;
}

export class Traits {

  protected _data: TraitsData;
 
  constructor(data?: TraitsData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): TraitsData {
    this._data = {};
    return this._data;
  }

}