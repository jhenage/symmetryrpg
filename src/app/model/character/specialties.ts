import { Character } from '../character'
export interface SpecialtiesData {
  [propName: string]: {
    rank: number;
    categories: string[];
  }
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

  getSpecialtyRank(specialtyName: string): number {
    if(this._data[specialtyName] && this._data[specialtyName].rank) {
      return this._data[specialtyName].rank; 
    }
    return 0;
  }

  getDisplayName(specialtyKey: string): string {
    return specialtyKey.replace(/(?<=[^-])[A-Z]/g, function (x) {
      return " "+x;
    });
  }

  getKnownSpecialtiesList(): string[] {
    let result = [];
    Object.keys(this._data).forEach((key) => {
      result.push(this.getDisplayName(key));
    });
    return result;
  }

}