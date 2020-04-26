import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
import { ActionPenalty } from 'src/app/log/action/aspecttest/action';
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
  readonly MINIMUM_VALUE = -7;
  readonly MAXIMUM_VALUE = 15;
  readonly RESOLUTION = 10; // number of steps per standard deviation
  
  constructor(character: Character,data?: AspectsData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): AspectsData {
    this._data = {
      brawn: {amount:0},
      toughness: {amount:0},
      agility: {amount:0},
      reflex: {amount:0},
      impression: {amount:0},
      serenity: {amount:0},
      cleverness: {amount:0},
      awareness: {amount:0}
    };
    return this._data;
  }

  Current(time:number,aspect:string): number {
    return Math.min(this.MAXIMUM_VALUE,Math.max(this.MINIMUM_VALUE,ModifiedValue(time,this._data[aspect])));
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

  setAspectRank(aspectName: string, rank: number) { // force rank to be within bounds and the right resolution avoiding rounding errors
    if(this._data.hasOwnProperty(aspectName)) {
      let sign = Math.sign(rank)
      rank = Math.abs(rank);
      let base = Math.floor(rank)
      let newRank = base + Math.round((rank-base)*this.RESOLUTION)/this.RESOLUTION;
      this._data[aspectName].amount = Math.min(this.MAXIMUM_VALUE,Math.max(this.MINIMUM_VALUE,newRank*sign));
    }
  }

  getBaseResult(time:number, aspectName:string): number {
    return 2*this.Current(time,aspectName);
  }

  protected getBaseReactionTime(rank: number, penalty: number, diceTotal: number, isSurprised: boolean): number {
    let result = 0.001;
    if(rank < 0) {
      result *= 38 + 4 * rank * rank;
      result += diceTotal * 0.01 * (24 + 8 * rank * rank);
    } else if (rank > 8) {
      result *= 30 - 2 * rank;
      result += diceTotal * 0.01 * (20 - rank);
    } else {
      result *= 38 - 4 * rank;
      result += diceTotal * 0.01 * (24 - 2 * rank);
    }
    if(penalty) result *= 1.1 ** penalty;
    if(isSurprised) {
      if(rank < 0) result *= 10 - rank;
      else result *= 10 - 0.4 * rank;
    }
    return result;
  }

  getMentalReactionTime(time:number, penalty: number, diceResult: number[], isSurprised: boolean): number { //time is in seconds
    let awareness = this.Current(time,'awareness');
    return this.getBaseReactionTime(awareness,penalty,diceResult[0]+diceResult[1],isSurprised) +
           this.getBaseReactionTime(awareness,penalty,diceResult[2]+diceResult[3],isSurprised);
  }

  getPhysicalReactionTime(time:number, penalty: number, diceResult: number[], isSurprised: boolean): number { //time is in seconds
    return this.getBaseReactionTime(this.Current(time,'awareness'),penalty,diceResult[0]+diceResult[1],isSurprised) +
           this.getBaseReactionTime(this.Current(time,'reflex'),penalty,diceResult[2]+diceResult[3],false);
  }

  protected getActionTime(actionTime: number, rank: number, actionPenalty: ActionPenalty): number { //time is in seconds
    let result = rank < 0 ? 0.8 : 0.9;
    result **= 2 * rank;
    result *= actionTime;
    result *= 2 ** actionPenalty.targetedPenalty;
    result *= 1.2 ** actionPenalty.genericPenalty;
    result *= 1.05 ** actionPenalty.incidentalPenalty;
    return result;
  }

  getMentalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.Current(time,'cleverness'),actionPenalty);
  }

  getPhysicalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.Current(time,'agility'),actionPenalty);
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.aspectsList.forEach( (aspectName) => {
      result += this.getSpentIP(this._data[aspectName].amount);
    });
    return result;
  }

  getSpentIP(rank: number): number { // returns the IP cost of a single aspect of the specified rank
    let sign = Math.sign(rank);
    rank = sign * rank;
    let base = Math.floor(2*rank)
    return sign * Math.round(5 * (base * base + base) + 10 * (2 * rank - base) * (1 + base) );
  }

}