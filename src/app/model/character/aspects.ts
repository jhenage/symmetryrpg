import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
import { DiceRoll } from '../diceroll'
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
  readonly BASE_REACTION_TIMES = [160,100,65,45,36,34,32,30,28,26,24,22,20,18,16,14,12,10,8,6,4,3,2,1,0];
  readonly REACTION_FLUX_TIMES = [100,60,40,30,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5];
  readonly SURPRISE_MULTIPLIERS = [15,13,12,11,10,9.75,9.5,9.25,9,8.75,8.5,8.25,8,7.75,7.5,7.25,7,6.75,6.5,6.25,6,5.75,5.5,5.25,5];
  readonly BASE_ACTION_DURATIONS = [5000,2750,1750,1250,1000,900,810,729,656,591,531,478,431,387,349,307,270,238,209,184,162,143,125,110,97];
  readonly ASPECT_IP_COSTS = [0,4,10,18,28,40,54,70,88,108,130,154,180,208,238,270,304,340,378,418,460,504,550,598,648];

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

  CurrentRank(time:number,aspect:string): number { // when you need an integer between 1 and 25
    return Math.max(1,Math.min(25,Math.round(this.Current(time,aspect))));
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

  protected getBaseReactionTime(rank: number, penalty: number, isSurprised: boolean): number {
    let result = this.BASE_REACTION_TIMES[rank-1];
    let roller = new DiceRoll([]);
    for(let i=0; i<2; i++) result += roller.getDieRoll(this.REACTION_FLUX_TIMES[rank-1]);
    if(penalty) result *= 1.1 ** penalty;
    if(isSurprised) result *= this.SURPRISE_MULTIPLIERS[rank-1];
    return Math.round(result);
  }

  getMentalReactionTime(time:number, penalty: number, isSurprised: boolean): number { //time is in milliseconds
    let awareRank = this.CurrentRank(time,'awareness');
    return this.getBaseReactionTime(awareRank,penalty,isSurprised) +
           this.getBaseReactionTime(awareRank,penalty,isSurprised);
  }

  getPhysicalReactionTime(time:number, penalty: number, isSurprised: boolean): number { //time is in milliseconds
    let awareRank = this.CurrentRank(time,'awareness');
    let reflexRank = this.CurrentRank(time,'reflex');
    return this.getBaseReactionTime(awareRank,penalty,isSurprised) +
           this.getBaseReactionTime(reflexRank,penalty,false);
  }

  protected getActionTime(actionTime: number, rank: number, actionPenalty: ActionPenalty): number {
    let result = actionTime * this.BASE_ACTION_DURATIONS[rank-1];
    result *= 2 ** actionPenalty.targetedPenalty;
    result *= 1.2 ** actionPenalty.genericPenalty;
    result *= 1.05 ** actionPenalty.incidentalPenalty;
    return Math.max(1,Math.round(result));
  }

  getMentalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.CurrentRank(time,'cleverness'),actionPenalty);
  }

  getPhysicalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.CurrentRank(time,'agility'),actionPenalty);
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.aspectsList.forEach( (aspectName) => {
      result += this.ASPECT_IP_COSTS[Math.max(0,this._data[aspectName].amount - 1)];
    });
    return result;
  }

}