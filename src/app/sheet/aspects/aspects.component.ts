import { Component, Input } from '@angular/core';
import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../../model/character'
import { DiceRoll } from '../../model/diceroll'

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

@Component({
  selector: 'app-aspects',
  templateUrl: './aspects.component.html',
  styleUrls: ['./aspects.component.less','../sheet.component.less']
})
export class AspectsComponent {
  protected _data: AspectsData;
  @Input() character: Character;
  inputsOutOfRange = {};
  readonly MIN_RANK = 0;
  readonly MAX_RANK = 25;

  constructor() { }

  initialize(data?: AspectsData): AspectsData {
    if(data) {
      this._data = data;
    } else {
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
    }
    Object.keys(this._data).forEach((aspect) => {
      this.inputsOutOfRange[aspect] = false;
    })
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
      if(rank < this.MIN_RANK) {
        rank = this.MIN_RANK;
        this.inputsOutOfRange[aspectName] = true;
      } else if(rank > this.MAX_RANK) {
        rank = this.MAX_RANK;
        this.inputsOutOfRange[aspectName] = true;
      } else {
        this.inputsOutOfRange[aspectName] = false;
      }
      this._data[aspectName].amount = rank;
    }
  }

  getRangeClass(aspectName: string): string {
    return this.inputsOutOfRange[aspectName] ? "out-of-range" : "";
  }

  getBaseResult(time:number, aspectName:string): number {
    return 2*this.Current(time,aspectName);
  }

  getTestResult(time:number, aspectName:string): DiceRoll {
    let roll = new DiceRoll();
    roll.modifier = this.getBaseResult(time,aspectName);
    return roll;
  }

}
