import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
export interface AspectsData {
  brawn: ModifiableStat;
  toughness: ModifiableStat;
  agility: ModifiableStat;
  reflex: ModifiableStat;
  impression: ModifiableStat;
  serenity: ModifiableStat;
  cleverness: ModifiableStat;
  awareness: ModifiableStat;
}

export class Aspects {

  protected _data: AspectsData;
  character: Character;
 
  constructor(character: Character,data?: AspectsData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): AspectsData {
    this._data = {
      brawn: {amount:5},
      toughness: {amount:5},
      agility: {amount:5},
      reflex: {amount:5},
      cleverness: {amount:5},
      serenity: {amount:5},
      impression: {amount:5},
      awareness: {amount:5}
    };
    return this._data;
  }

  Current(time:number,aspect:string): number {
    return ModifiedValue(time,this._data[aspect]);
  }

  TempChange(time:number,aspect:string,amount:number): void {
    ChangeModifiedValue(time,this._data[aspect],amount);
  }

  get brawn(): number {
    return this._data.brawn.amount;
  }

  set brawn(newValue) {
     this._data.brawn.amount = Number(newValue) || 5;
  }

  get toughness(): number {
    return this._data.toughness.amount;
  }

  set toughness(newValue) {
     this._data.toughness.amount = Number(newValue) || 5;
  }

  get agility(): number {
    return this._data.agility.amount;
  }

  set agility(newValue) {
     this._data.agility.amount = Number(newValue) || 5;
  }

  get reflex(): number {
    return this._data.reflex.amount;
  }

  set reflex(newValue) {
     this._data.reflex.amount = Number(newValue) || 5;
  }

  get cleverness(): number {
    return this._data.cleverness.amount;
  }

  set cleverness(newValue) {
     this._data.cleverness.amount = Number(newValue) || 5;
  }

  get serenity(): number {
    return this._data.serenity.amount;
  }

  set serenity(newValue) {
     this._data.serenity.amount = Number(newValue) || 5;
  }

  get impression(): number {
    return this._data.impression.amount;
  }

  set impression(newValue) {
     this._data.impression.amount = Number(newValue) || 5;
  }

  get awareness(): number {
    return this._data.awareness.amount;
  }

  set awareness(newValue) {
     this._data.awareness.amount = Number(newValue) || 5;
  }


}