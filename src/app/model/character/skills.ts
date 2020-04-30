import { Character } from '../character'

export interface SkillsData {
  actor: number;
  artist: number;
  athlete: number;
  crafter: number;
  diplomat: number;
  engineer: number;
  fighter: number;
  investigator: number;
  linguist: number;
  mage: number;
  medic: number;
  musician: number;
  pilot: number;
  scholar: number;
  sharpshooter: number;
  sneak: number;
  stylist: number;
  survivalist: number;
}

export class Skills {

  protected _data: SkillsData;
  character: Character;

  constructor(character: Character,data?: SkillsData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): SkillsData {
    this._data = {
      actor: 0,
      artist: 0,
      athlete: 0,
      crafter: 0,
      diplomat: 0,
      engineer: 0,
      fighter: 0,
      investigator: 0,
      linguist: 0,
      mage: 0,
      medic: 0,
      musician: 0,
      pilot: 0,
      scholar: 0,
      sharpshooter: 0,
      sneak: 0,
      stylist: 0,
      survivalist: 0
    };
    return this._data;
  }

  get skillsList(): string[] {
    return Object.keys(this._data);
  }

  getSkillRank(skillName: string): number {
    return this._data[skillName];
  }

  setSkillRank(skillName: string, rank: number) { // force rank to be within bounds and the right resolution avoiding rounding errors
    if(this._data.hasOwnProperty(skillName)) {
      this._data[skillName] = rank;
    }
  }

  getSkillProbabilityDescription(skillName: string): string {
    return this.character.getProbabilityDescription(this.getSkillRank(skillName));
  }

  getBaseResult(aspectRank: number, skillName: string, missingSpecializationRanks?: number): number {
    missingSpecializationRanks = missingSpecializationRanks || 0;
    let skillRank = this.getSkillRank(skillName) - 2*missingSpecializationRanks;
    if(missingSpecializationRanks > 3) skillRank -= missingSpecializationRanks-3;
    let low = Math.min(aspectRank, skillRank);
    let delta = Math.max(aspectRank, skillRank) - low;
    delta = Math.min(delta,0.8*delta+0.3,0.5*delta+1.2,0.2*delta+2.7);
    return 2 * low + delta;
  }

  getTestModifiers(aspectRank: number, skillName: string): number[] {
    let baseResults = [];
    for(let i=0; i<7; i++) {
      baseResults.push(this.getBaseResult(aspectRank, skillName,i));
    }
    return baseResults;
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.skillsList.forEach( (skillName) => {
      result += this.getSpentIP(this._data[skillName]);
    });
    return result;
  }

  getSpentIP(rank: number): number { // returns the IP cost of a single skill of the specified rank
    if(rank > 0) {
      let base = Math.floor(2*rank)
      return Math.round(2.5 * (base * base + base) + 5 * (2 * rank - base) * (1 + base) );
    } else if(rank > -1) {
      return 10 * rank;
    } else if(rank > -3) {
      return Math.ceil(5 * (rank - 1));
    } else return -20;
  }

}