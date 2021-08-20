import { Character } from '../character'

export interface SkillsData {
  actor: number;
  artist: number;
  athlete: number;
  diplomat: number;
  engineer: number;
  fighter: number;
  linguist: number;
  mage: number;
  medic: number;
  musician: number;
  pilot: number;
  scholar: number;
  sharpshooter: number;
  sneak: number;
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
      diplomat: 0,
      engineer: 0,
      fighter: 0,
      linguist: 0,
      mage: 0,
      medic: 0,
      musician: 0,
      pilot: 0,
      scholar: 0,
      sharpshooter: 0,
      sneak: 0,
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

  getShortDescription(skillName: string): string {
    switch(skillName) {
      case "actor":
        return "Acting, Bluffing, Deception";
      case "artist":
        return "Visual Arts";
      case "athlete":
        return "Movement, Sports";
      case "crafter":
        return "Constructing, Repairing";
      case "diplomat":
        return "Persuasion, Reading People, Etiquette";
      case "engineer":
        return "Inventing, Reverse Engineering";
      case "fighter":
        return "Melee Combat";
      case "investigator":
        return "Finding & Analyzing Clues";
      case "linguist":
        return "Verbal & Written Languages";
      case "mage":
        return "Qi, Magic, The Supernatural";
      case "medic":
        return "Medicine, Physical & Mental Health";
      case "musician":
        return "Composing & Performing Music";
      case "pilot":
        return "Driving, Sailing, Piloting, Riding";
      case "scholar":
        return "Knowledge, Academic Research";
      case "sharpshooter":
        return "Throwing, Shooting, Targeting";
      case "sneak":
        return "Concealment, Stealth, Disguise";
      case "stylist":
        return "Fashions, Trends, Style, Presentation";
      case "survivalist":
        return "Tracking, Food, Shelter, Hazards";
      default:
        return "ERROR - UNRECOGNIZED SKILL";
    }
  }

  getSkillProbabilityDescription(skillName: string): string {
    return this.character.getFullProbabilityDescription(this.getSkillRank(skillName));
  }

  getBaseResult(aspectRank: number, skillName: string, missingSpecializationRanks?: number): number {
    missingSpecializationRanks = missingSpecializationRanks || 0;
    let skillRank = this.getSkillRank(skillName) - 2*missingSpecializationRanks;
    if(missingSpecializationRanks > 0) {
      if(skillName == "linguist") skillRank += this.character.traits.getAttributeMod("linguistMissingSpecializationPenaltyOffset");
      else skillRank += this.character.traits.getAttributeMod("standardMissingSpecializationPenaltyOffset");
    }
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