import { Character } from '../character'
export interface TraitsData {
  [propName: string]: boolean;
}

export class Traits {

  protected _data: TraitsData;
  character: Character;
 
  constructor(character: Character,data?: TraitsData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): TraitsData {
    this._data = {};
    return this._data;
  }

}