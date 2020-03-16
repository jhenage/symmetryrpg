import { Character } from '../character'
export interface WoundData {
  [propName: string]: { // Location (e.g. leftArm,head,torso)
    initial: {}; // the initial wound object
    recovery: {}; // actions taken toward recover, and results
  }[]
}

export class Wounds {

  protected _data: WoundData;
  character: Character;
 
  constructor(character: Character,data?: WoundData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): WoundData {
    this._data = {};
    return this._data;
  }

  Penalty(location: string, time: number): number {
    return 0;
  }

}