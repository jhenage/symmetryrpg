import { Character } from '../character'
export interface TapData {
  [propName: string]: { // Location (e.g. leftArm,mental,general)
    time: number;
    amount: number;
  }[]
}

export class Tap {

  protected _data: TapData;
  character: Character;
 
  constructor(character: Character,data?: TapData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): TapData {
    this._data = {};
    return this._data;
  }

  penalty(time: number, location?: string): number {
    if(!location) {
      location = 'general';
    }

    if(!this._data.hasOwnProperty(location)) {
      console.log('location not found',location,this._data);
      return 0;
    }
    for(let i = this._data[location].length; i > 0; i--) {
      if ( this._data[location][i-1].time <= time ) {
        let duration = time - this._data[location][i-1].time;
        if(duration/1000 >= this._data[location][i-1].amount) {
          return 0;
        }
        return this._data[location][i-1].amount - duration/1000;
      }
    }
    return 0;
  }

  addTap(time: number, amount: number, location?: string): void {
    if ( amount == 0 ) return;

    // Verify the Location
    if(!location) {
      location = 'general';
    }
    if(!this._data.hasOwnProperty(location)) {

      if(location != 'general' && location != 'mental') {
        if(!this.character.specie.limbs.hasOwnProperty(location)) {
          throw new Error('Invalid location '+location);
        }
      }

      if(amount>0) {
        this._data[location] = [{time: time, amount: amount}];
      }
    }
    else {
      let i = this._data[location].length - 1;
      if ( this._data[location][i].time > time ) {
        throw new Error('Invalid time '+time);
      }
      else if ( this._data[location][i].time == time ) {
        this._data[location][i].amount += amount;
        if ( this._data[location][i].amount < 0 ) {
          this._data[location][i].amount = 0;
        }
      }
      else {
        let duration = time - this._data[location][i].time;
        let oldtap = this._data[location][i].amount - duration/1000;
        
        if ( oldtap < 0 ) {
          oldtap = 0;
        }

        let newtap = oldtap + amount;
        if ( newtap < 0 ) {
          newtap = 0;
        }

        this._data[location].push({time:time,amount:newtap});
      }
    }
  }

 
}