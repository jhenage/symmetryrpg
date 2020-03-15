interface TapData {
  [propName: string]: { // Location (e.g. leftArm,mental,general)
    time: number;
    amount: number;
  }[]
}

export class Tap {

  protected _data: TapData;
 
  constructor(data?: TapData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): TapData {
    this._data = {};
    return this._data;
  }

  Penalty(location: string): number {
    return 0;
  }

}