import { Character } from '../character'

export interface CurrencyInterval {
  ipMax: number;
  computation: string;
  parameters: number[];
}

export interface EquipmentData {
  incomeIP: number;
  lifestyleIP: number;
  notes: string;
  currency: {
    cashOnHand: number;
    liquidFunds: number;
  };
  equipLocations: {
    [propName: string]: {  // Location (e.g. leftArm,rightLeg,body)
      start: number; // when moved to this location
      end: number;   // when removed from this location. 0 or undefined means indefinitely
      item: number;  // item id
      status: string; // held (ready to use, limit 1), worn (gain armor), or carried (no bonuses but larger limit)
    }[];
  };
}

export class Equipment {

  protected _data: EquipmentData;
  character: Character;
 
  constructor(character: Character,data?: EquipmentData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): EquipmentData {
    this._data = {incomeIP:0,lifestyleIP:0,notes:"",currency:{cashOnHand:0,liquidFunds:0},equipLocations:{}};
    return this._data;
  }

  getSpentIPTotal(): number {
    return this._data.incomeIP + this._data.lifestyleIP;
  }

  get incomeIP(): number {
    return this._data.incomeIP;
  }

  set incomeIP(incomeIP:number) {
    this._data.incomeIP = incomeIP;
  }

  get lifestyleIP(): number {
    return this._data.lifestyleIP;
  }

  set lifestyleIP(lifestyleIP:number) {
    this._data.lifestyleIP = lifestyleIP;
  }

  get incomeValue(): number {
    return this.ipToCurrency(this.incomeIP);
  }

  get lifestyleValue(): number {
    return this.ipToCurrency(this.lifestyleIP);
  }

  get notes(): string {
    return this._data.notes;
  }

  set notes(notes:string) {
    this._data.notes = notes;
  }

  ipToCurrency(ip:number): number {
    let result = 0;
    let computation = "";
    let parameters = [];
    let currencyIntervals = this.character.campaign.currencyIntervals;
    for(let i=0; i<currencyIntervals.length; i++) {
      if(currencyIntervals[i].ipMax > ip) {
        computation = currencyIntervals[i].computation;
        parameters = currencyIntervals[i].parameters;
        break;
      }
    }
    switch(computation) {
      case "linear":
        result = parameters[0] + parameters[1]*ip;
        break;
      case "quadratic":
        result = parameters[0] + parameters[1]*ip + parameters[2]*ip*ip;
        break;
      case "exponential":
        result = parameters[0]*Math.pow(2,parameters[1]*ip) + parameters[2];
        break;
      default:
        console.log("ERROR: Unrecognized computation in equipment.ts > interpretEconomicSymmetric");
    }
    return result;   
  }

  Weight(location: string): number {
    return 0;
  }

  AddItem(time: number, location: string, item: number): void {}
  RemoveItem(time: number, location: string, item: number): void {}
  MoveItem(time: number, location: string, item: number): void {}
}