import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
export interface AspectsData {
  brawn: ModifiableStat;
  toughness: ModifiableStat;
  agility: ModifiableStat;
  reflex: ModifiableStat;
  impression: ModifiableStat;
  serenity: ModifiableStat;
  cleverness: ModifiableStat;
  perception: ModifiableStat;
}
export interface ActionPenalty {
  targetedPenalty: number;
  genericPenalty: number;
  incidentalPenalty: number;
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
      brawn: {amount:0},
      toughness: {amount:0},
      agility: {amount:0},
      reflex: {amount:0},
      impression: {amount:0},
      serenity: {amount:0},
      cleverness: {amount:0},
      perception: {amount:0}
    };
    return this._data;
  }

  getAspectRank(aspectName: string): number {
    return this._data[aspectName].amount;
  }

  setAspectRank(aspectName: string, rank: number) {
    if(this._data.hasOwnProperty(aspectName)) {
      this._data[aspectName].amount = rank;
    }
  }

  permanent(aspect:string): number {
    return this.getAspectRank(aspect) + 
           this.character.specie.getAttributeMod(aspect) +
           this.character.traits.getAttributeMod(aspect);
  }

  current(time:number,aspect:string): number {
    let myList = [];
    let result = 0;
    if(this.flatAxisList.includes(aspect)) {
      this.aspectsList.forEach(aspectName => {
        if(this.getAspectDescriptors(aspectName).includes(aspect)) myList.push(aspectName);
      });
    } else myList.push(aspect);
    myList.forEach(aspectName => {
      result += ModifiedValue(time,this._data[aspectName]);
    });
    return result;
  }

  tempChange(time:number,aspect:string,amount:number): void {
    ChangeModifiedValue(time,this._data[aspect],amount);
  }

  get aspectsList(): string[] {
    return Object.keys(this._data);
  }

  get axisList(): string[][] {
    return [["body","mind"],["strength","finesse"],["action","balance"]];
  }

  get flatAxisList(): string[] {
    let result = [];
    this.axisList.forEach(axis => {
      result = result.concat(axis);
    });
    return result;
  }

  getAspectDescriptors(aspectName:string): string[] {
    switch(aspectName) {
      case "brawn":
        return ["body","strength","action"];
      case "toughness":
        return ["body","strength","balance"];
      case "agility":
        return ["body","finesse","action"];
      case "reflex":
        return ["body","finesse","balance"];
      case "impression":
        return ["mind","strength","action"];
      case "serenity":
        return ["mind","strength","balance"];
      case "cleverness":
        return ["mind","finesse","action"];
      case "perception":
        return ["mind","finesse","balance"];
    }
    return [];
  }

  getAspectDescription(aspectName:string): string {
    switch(aspectName) {
      case "brawn":
        return "Strong Physical Action";
      case "toughness":
        return "Strong Physical Balance";
      case "agility":
        return "Deft Physical Action";
      case "reflex":
        return "Deft Physical Balance";
      case "impression":
        return "Strong Mental Action";
      case "serenity":
        return "Strong Mental Balance";
      case "cleverness":
        return "Deft Mental Action";
      case "perception":
        return "Deft Mental Balance";
    }
  }

  getAspectProbabilityDescription(aspectName: string): string {
    return this.character.getFullProbabilityDescription(this.permanent(aspectName));
  }

  getBaseResult(time:number, aspectName:string): number {
    return 2*this.current(time,aspectName);
  }

  protected getBaseReactionTime(rank:number): number {
    if(rank < -1) return 26 + 16 * rank * rank;
    if(rank < 4) return 38 - 4 * rank;
    if(rank < 7) return 30 - 2 * rank;
    return Math.max(1,26.5 - 1.5 * rank);
  }

  protected getReactionTimeRange(rank:number): number {
    if(rank < -1) return 18 + 8 * rank * rank;
    if(rank < 4) return 24 - 2 * rank;
    if(rank < 15) return 20 - rank;
    return Math.max(1, 12.5 - 0.5 * rank);
  }

  getSurpriseMultiplier(rank: number): number {
    if(rank < 0) return 10 - rank;
    return Math.max(2, 10 - 0.4 * rank);
  }

  protected getHalfReactionTime(rank: number, penalty: number, diceTotal: number, isSurprised: boolean): number {
    let result = 0.001 * this.character.specie.quickness.reaction;
    result *= this.getBaseReactionTime(rank) + diceTotal * 0.01 * this.getReactionTimeRange(rank);
    if(penalty) result *= 1.1 ** penalty;
    if(isSurprised) result *= this.getSurpriseMultiplier(rank);
    return result;
  }

  getMentalReactionTime(time:number, penalty: number, diceResult: number[], isSurprised: boolean): number { //time is in seconds
    let perception = this.current(time,'perception');
    let result = this.getHalfReactionTime(perception,penalty,diceResult[0]+diceResult[1],isSurprised) +
                 this.getHalfReactionTime(perception,penalty,diceResult[2]+diceResult[3],isSurprised);
    return result * this.character.specie.quickness.mental;
  }

  getPhysicalReactionTime(time:number, penalty: number, diceResult: number[], isSurprised: boolean): number { //time is in seconds
    let result = this.getHalfReactionTime(this.current(time,'perception'),penalty,diceResult[0]+diceResult[1],isSurprised) *
                 this.character.specie.quickness.mental;
    result += this.getHalfReactionTime(this.current(time,'reflex'),penalty,diceResult[2]+diceResult[3],false) *
              this.character.specie.quickness.physical;
    return result;
  }

  protected getActionTime(actionTime: number, rank: number, actionPenalty: ActionPenalty): number { //time is in seconds
    let result = rank < 0 ? 0.8 : 0.9;
    result **= 2 * rank;
    result *= actionTime;
    result *= 2 ** actionPenalty.targetedPenalty;
    result *= 1.2 ** actionPenalty.genericPenalty;
    result *= 1.05 ** actionPenalty.incidentalPenalty;
    return result * this.character.specie.quickness.action;
  }

  getMentalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.current(time,'cleverness'),actionPenalty) * this.character.specie.quickness.mental;
  }

  getPhysicalActionTime(time:number, actionTime: number, actionPenalty: ActionPenalty) {
    return this.getActionTime(actionTime,this.current(time,'agility'),actionPenalty) * this.character.specie.quickness.physical;
  }

  getSpentIPTotal(): number {
    let result = 0;
    this.aspectsList.forEach( (aspectName) => {
      result += this.getSpentIP(this._data[aspectName].amount);
    });
    return result;
  }

  getSpentIP(rank: number): number { // returns the IP cost of a single aspect of the specified rank
    if(rank > 0) {
      let base = Math.floor(2*rank)
      return Math.round(5 * (base * base + base) + 10 * (2 * rank - base) * (1 + base) );
    } else if(rank > -1) {
      return rank * 20;
    } else if(rank > -3) {
      return 10 * (rank  - 1); 
    } else if(rank > -5) {
      return Math.ceil(5 * (rank - 5));
    } else return -50;
  }

}