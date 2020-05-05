import { Character } from '../character'
export interface SpecialtiesData {
  [propName: string]: number; // rank of specialty
}

export interface SpecialtyCategories {
  [propName: string]: string[];
}

export class Specialties {

  protected _data: SpecialtiesData;
  character: Character;
  readonly IP_COSTS = [0,18,72,162]; // these do not stack
  readonly IP_PENALTY = [12,36,60]; // these stack
 
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
    if(this._data[specialtyName]) {
      return this._data[specialtyName]; 
    }
    return 0;
  }

  setSpecialtyRank(specialtyName: string, newRank: number) {
    if(newRank <= 0 && this._data[specialtyName]) {
      delete this._data[specialtyName];
    } else {
      this._data[specialtyName] = newRank;   
    }
  }

  getDisplayName(specialtyKey: string): string {
    return specialtyKey.replace(/(?<=[^-])[A-Z]/g, function (x) {
      return " "+x;
    });
  }

  // returns a list of all the specialty keys in alphabetical order
  getSpecialtiesList(): string[] {
    return Object.keys(this.character.campaign.commonSpecialties).sort();
  }

  getSpentIPTotal(): number {
    let specialtyCategories = this.character.campaign.commonSpecialties;
    let maxPenaltyByCategory = {}; // First, find penalties/discounts for each category & rank
    Object.keys(specialtyCategories).forEach((specialty) => {
      let category = "";
      for(let i=0; i<specialtyCategories[specialty].length; i++) {
        category = specialtyCategories[specialty][i];
        if(!maxPenaltyByCategory[category]) maxPenaltyByCategory[category] = [0,0,0];
        for(let i=0; i<this.getSpecialtyRank(specialty); i++) {
          let penalty = this.IP_PENALTY[i]/specialtyCategories[specialty].length;
          maxPenaltyByCategory[category][i] = Math.max(penalty,maxPenaltyByCategory[category][i]);
        }
      }
    });
    let result = 0; // Now, add up the IP Costs
    Object.keys(this._data).forEach((specialty) => {
      result += this.IP_COSTS[this.getSpecialtyRank(specialty)];
    });
    Object.keys(maxPenaltyByCategory).forEach((category) => {
      for(let i=0; i<3; i++) {
        result += maxPenaltyByCategory[category][i];
      }
    });
    return result;
  }

}