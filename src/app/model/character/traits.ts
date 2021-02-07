import { Character } from '../character'

export interface TraitsData {
  [propName: string]: boolean;
}

export interface TraitDetails {
  ipCost: number;
  prerequisites: {
    aspects: {[aspectName: string]: number;};
    skills: {[skillName: string]: number;};
    specialties: {[specialtyName: string]: number;};
    traits: string[];
    other: {[propName: string]: number;};
  };
  description: string;
  attributeMods: {[attributeName: string]: number;};
  enabledActions: string[];
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

  hasTrait(traitName: string): boolean {
    return this._data[traitName] ? true : false;
  }

  addTrait(traitName: string): void {
    this._data[traitName] = true;
  }

  removeTrait(traitName: string): void {
    if(this._data[traitName]) this._data[traitName] = false;
  }

  setTrait(traitName: string,newState: boolean): void {
    let startState = this.hasTrait(traitName);
    if(newState) this.addTrait(traitName);
    else this.removeTrait(traitName);
  }

  checkRequirements(traitName: string): {passed:string[],failed:string[]} {
    //NOTE: REQUIREMENTS USE BASE RANKS NOT CURRENT VALUES
    let result = {passed:[],failed:[]};
    let prereqs = this.character.campaign.getTraitDetails(traitName).prerequisites;
    let rank = 0;
    let reqString = "";
    Object.keys(prereqs.aspects).forEach(aspect => {
      rank = prereqs.aspects[aspect];
      reqString = aspect + " " + rank;
      if(this.character.aspects.getAspectRank(aspect) < rank) result.failed.push(reqString);
      else result.passed.push(reqString);
    });
    Object.keys(prereqs.skills).forEach(skillPrereq => {
      rank = prereqs.skills[skillPrereq];
      reqString = skillPrereq + " " + rank;
      let thisPrereqResult = false;
      if(skillPrereq.includes("_OR_")) {
        skillPrereq.split("_OR_").forEach(skill => {
          if(this.character.skills.getSkillRank(skill) >= rank) thisPrereqResult = true;
        });
      } else if(skillPrereq == "ALL_BUT_LINGUIST") {
        thisPrereqResult = true;
        this.character.skills.skillsList.forEach(skill => {
          if(skill != "linguist" && this.character.skills.getSkillRank(skill) < rank) thisPrereqResult = false;
        });
      } else {
        if(this.character.skills.getSkillRank(skillPrereq) >= rank) thisPrereqResult = true;
      }
      if(thisPrereqResult) result.passed.push(reqString);
      else result.failed.push(reqString);
    });
    Object.keys(prereqs.specialties).forEach(specialtyPrereq => {
      rank = prereqs.specialties[specialtyPrereq];
      reqString = specialtyPrereq + " " + rank;
      let thisPrereqResult = false;
      if(specialtyPrereq.includes("_OR_")) {
        specialtyPrereq.split("_OR_").forEach(specialty => {
          if(this.character.specialties.getSpecialtyRank(specialty) >= rank) thisPrereqResult = true;
        });
      } else if(specialtyPrereq == "ALL_CATEGORIES") {
        thisPrereqResult = true;
        this.character.specialties.getCategoriesList().forEach(category => {
          if(this.character.specialties.isUnknownCategory(category)) thisPrereqResult = false;
        });
      } else if(specialtyPrereq == "TOTAL_IP") {
        if(this.character.specialties.getSpentIPTotal() >= rank) thisPrereqResult = true;
      } else if(specialtyPrereq == "FIVE_LANGUAGES") {
        let languageCount = 0;
        this.character.specialties.getSpecialtiesByCategory("languages").forEach(language => {
          if(this.character.specialties.getSpecialtyRank(language) >= rank) languageCount++;
        });
        if(languageCount >= 5) thisPrereqResult = true;
      } else {
        if(this.character.specialties.getSpecialtyRank(specialtyPrereq) >= rank) thisPrereqResult = true;
      }
      if(thisPrereqResult) result.passed.push(reqString);
      else result.failed.push(reqString);
    });
    prereqs.traits.forEach(traitPrereq => {
      let thisPrereqResult = false;
      if(traitPrereq.includes("_OR_")) {
        traitPrereq.split("_OR_").forEach(trait => {
          if(this.hasTrait(trait)) thisPrereqResult = true;
        });
      } else if(traitPrereq == "ANY_2_PHILOSOPHY") {
        let philosophyCount = 0;
        ["Action","Body","Finesse","Mind","Reaction","Strength"].forEach(phil => {
          if(this.hasTrait("philosophyOf"+phil)) philosophyCount++;
          if(this.hasTrait("focused"+phil)) philosophyCount++;
          if(this.hasTrait("dedicatedTo"+phil)) philosophyCount++;
        });
        if(philosophyCount >= 2) thisPrereqResult = true;
      } else if(traitPrereq.startsWith("NOT_")) {
        if(!this.hasTrait(traitPrereq.substring(4))) thisPrereqResult = true;
      } else {
        if(this.hasTrait(traitPrereq)) thisPrereqResult = true;
      }
      if(thisPrereqResult) result.passed.push(traitPrereq);
      else result.failed.push(traitPrereq);
    });
    Object.keys(prereqs.other).forEach(otherPrereq => {
      rank = prereqs.other[otherPrereq];
      reqString = otherPrereq + " " + rank;
      if(otherPrereq == "baseEndurance") {
        if(this.character.getBaseEndurance(this.character.aspects.getAspectRank("toughness")) < rank) {
          result.failed.push(reqString);
        } else {
          result.passed.push(reqString);
        }
      }
    });
    return result;
  }

  isAvailable(traitName: string): boolean {
    return this.checkRequirements(traitName).failed.length == 0;
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.character.campaign.traitTypes.forEach(traitType => {
      this.character.campaign.getTraitList(traitType).forEach(traitName => {
        if(this.hasTrait(traitName)) result += this.character.campaign.getTraitDetails(traitName).ipCost;
      });  
    });
    return result;
  }

  getAttributeMod(attributeName:string):number {
    let result = 0;
    Object.keys(this._data).forEach(traitName => {
      if(this.hasTrait(traitName)) result += this.character.campaign.getTraitDetails(traitName).attributeMods[attributeName] || 0;
    });
    return result;
  }

}