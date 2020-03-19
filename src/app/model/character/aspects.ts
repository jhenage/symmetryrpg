import { Character, BasicTestResult, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
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
      impression: {amount:5},
      serenity: {amount:5},
      cleverness: {amount:5},
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

  get aspectsList(): string[] {
    return Object.keys(this._data);
  }

  getAspectRank(aspectName: string): number {
    return this._data[aspectName].amount;
  }

  setAspectRank(aspectName: string, rank: number) {
    if(this._data.hasOwnProperty(aspectName)) {
      this._data[aspectName].amount = Math.max(0,Math.min(25,rank));
    }
  }

  getBaseResult(time:number, aspectName:string): number {
    return 2*this.Current(time,aspectName);
  }

  getTestResult(time:number, aspectName:string): BasicTestResult {
    var result = this.character.getTestResults();
    var baseResult = this.getBaseResult(time,aspectName);
    result.standardResult += baseResult;
    result.lowluckResult += baseResult;
    return result;
  }

}