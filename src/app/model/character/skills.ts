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
  readonly SKILL_IP_COSTS = [0,1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,231,253,276,300,325];
 
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

  setSkillRank(skillName: string, rank: number) {
    if(this._data.hasOwnProperty(skillName)) {
      this._data[skillName] = rank;
    }
  }

  getBaseResult(aspectRank: number, skillName: string, missingSpecializationRanks?: number): number {
    missingSpecializationRanks = missingSpecializationRanks || 0;
    let skillRank = this.getSkillRank(skillName) - 4*missingSpecializationRanks;
    if(missingSpecializationRanks > 3) skillRank -= 2*(missingSpecializationRanks-3);
    let high = Math.max(aspectRank, skillRank);
    let low = Math.min(aspectRank, skillRank);
    high = Math.max(0,Math.min(high,low*2,low+5));
    return (high + low + aspectRank + skillRank)/2;
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
      result += this.SKILL_IP_COSTS[this._data[skillName]];
    });
    return result;
  }

}