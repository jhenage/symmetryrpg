import { Character } from '../character'
export interface SpecialtiesData {
  [propName: string]: number;
}

export class Specialties {

  protected _data: SpecialtiesData;
  character: Character;
 
  constructor(character: Character,data?: SpecialtiesData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): SpecialtiesData {
    this._data = {};
    return this._data;
  }

}