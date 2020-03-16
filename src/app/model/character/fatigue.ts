import { Character } from '../character'
export interface FatigueData {
  //aerobic: {
  //  time: number;
  //  rate: number;
  //  current: {
  //    regular: {
//
  //    }
  //    malfatigue: {
//
  //    }
  //  }
  //}[];
  [propName: string]: { // Location (e.g. leftArm, mental)
    time: number;
    amount: number;
  }[];
}

export class Fatigue {

  protected _data: FatigueData;
  character: Character;
 
  constructor(character: Character,data?: FatigueData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): FatigueData {
    this._data = {};
    return this._data;
  }

  Penalty(location: string): number {
    return 0;
  }



}