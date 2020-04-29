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
  readonly MIN_RANK = 0;
  readonly MAX_RANK = 3;
 
  constructor(character: Character,data?: SpecialtiesData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(commonSpecialties: any): SpecialtiesData {
    this._data = {};
    Object.keys(commonSpecialties).forEach(specialty => {
      this._data[specialty] = {rank: 0, categories: commonSpecialties[specialty]};
    });
    return this._data;
  }

  getSpecialtyRank(specialtyName: string): number {
    if(this._data[specialtyName] && this._data[specialtyName].rank) {
      return this._data[specialtyName].rank; 
    }
    return 0;
  }

  setSpecialtyRank(specialtyName: string, newRank: number) {
    this._data[specialtyName].rank = Math.min(this.MAX_RANK,Math.max(this.MIN_RANK,newRank));   
  }

  getDisplayName(specialtyKey: string): string {
    return specialtyKey.replace(/(?<=[^-])[A-Z]/g, function (x) {
      return " "+x;
    });
  }

  // returns a list of all the specialty keys in alphabetical order
  getSpecialtiesList(): string[] {
    return Object.keys(this._data).sort();
  }

}