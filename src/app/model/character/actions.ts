import { Character } from '../character'
export interface ActionsData {
 }

export class Actions {
  protected _data: ActionsData;
  character: Character;

  constructor(character: Character,data?: ActionsData) {
    this.character = character;
    if (data) {
      this._data = data;
    }
  }

  initialize(): ActionsData {
    this._data = {
     };
    return this._data;
  }

  nextActions(time:number): [] {
    return [];
  }

 }
