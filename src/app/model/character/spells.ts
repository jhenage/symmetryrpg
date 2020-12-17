import { Character } from '../character'
export interface SpellsData {
  [propName: string]: boolean;
}

export interface SpellsDetails {
  difficulty: number;
  description: string;
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

  hasSpell(spellName: string): boolean {
    return this._data[spellName] ? true : false;
  }

  addSpell(spellName: string): void {
    this._data[spellName] = true;
  }

  removeSpell(spellName: string): void {
    if(this._data[spellName]) this._data[spellName] = false;
  }

  setSpell(spellName: string,newState: boolean): void {
    let startState = this.hasSpell(spellName);
    if(newState) this.addSpell(spellName);
    else this.removeSpell(spellName);
  }

  isUnlocked(spellName: string): boolean {
    let difficulty = this.character.campaign.getSpellDetails(spellName).difficulty;
    if(this.character.traits.hasTrait("spellShaping")) {
      if(difficulty <= 5) return true;
      if(this.character.traits.hasTrait("greaterSpellShaping")) {
        if(difficulty <= 15 || this.character.traits.hasTrait("epicSpellShaping")) return true;
      }
    }
    return false;
  }

  isAvailable(spellName: string): boolean {
    if(this.isUnlocked(spellName)) {
      let difficulty = this.character.campaign.getSpellDetails(spellName).difficulty;
      let baseResult = this.character.skills.getBaseResult(this.character.aspects.Permanent("cleverness"),"mage",0);
      return baseResult +1 >= difficulty;
    }
    return false;
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.character.campaign.getSpellList().forEach(spellName => {
      if(this.hasSpell(spellName)) result += 5 * (this.character.campaign.getSpellDetails(spellName).difficulty - 1);  
    });
    return result;
  }

}