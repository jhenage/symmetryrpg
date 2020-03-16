import { Character } from '../character'
export interface SpellsData {
}

export class Spells {

  protected _data: SpellsData;
  character: Character;
 
  constructor(character: Character,data?: SpellsData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): SpellsData {
    this._data = {};
    return this._data;
  }

}