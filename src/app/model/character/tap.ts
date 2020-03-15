import { Character } from '../character'
interface TapData {
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

  AddQi(time: number, amount: number): void {
    let qi = this.Qi(time) + amount;
    for(let i = this._data.qi.length; i > 0; i--) {
      if ( this._data.qi[i-1].time == time ) {
        this._data.qi[i-1].amount = qi;
        return;
      }
      if ( this._data.qi[i-1].time < time ) {
        this._data.qi.splice(i,0,{time:time,amount:qi});
        return;
      }
    }
    throw new Error("invalid time " + time)
  }

  Penalty(time: number, location?: string): number {
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

  AddTap(time: number, amount: number, location?: string): void {
    if ( amount == 0 ) return;
console.log('mark')
    // Verify the Location
    if(!location) {
      location = 'general';
    }
    if(!this._data.hasOwnProperty(location)) {

      if(location != 'general' && location != 'mental') {
        if(!this.character.creatureType.limbs.hasOwnProperty(location)) {
          throw new Error('Invalid location '+location);
        }
      }

      if(amount>0) {
        this._data[location] = [{time: time, amount: amount}];
      }
      return;
    }
console.log('test')
    for(let i = this._data[location].length; i > 0; i--) {
      // Find the relevant tap entry
      if ( this._data[location][i-1].time <= time ) {
        let duration = time - this._data[location][i-1].time;
        let oldtap = this._data[location][i-1].amount - duration/1000;

        if ( oldtap <= 0 ) {
          if ( amount < 0 ) {
            return;
          }
          oldtap = 0;
        }

        if ( this._data[location][i-1].time == time ) {
          if ( this._data[location][i-1].amount + amount < 0 ) {
            amount = 0 - this._data[location][i-1].amount;
          }
          this._data[location][i-1].amount += amount;
        }
        else {
          let newamount = oldtap + amount;
          if ( newamount < 0 ) {
            newamount = 0;
            amount = 0-oldtap;
          }
          console.log(this._data,location);
          this._data[location].splice(i,0,{time:time,amount:newamount});
          i++;
        }

        // adjust any affected future tap entries
        while( i<this._data[location].length ) {
          
          duration = this._data[location][i].time - this._data[location][i-1].time;
          let carriedtap = oldtap - duration/1000;

          if ( amount < 0 ) {
            if ( carriedtap <= 0 || this._data[location][i].amount == 0 ) {
              return;
            }
            if ( carriedtap + amount < 0 ) {
              amount = 0 - carriedtap;
            }
            if ( this._data[location][i].amount + amount < 0 ) {
              amount = 0 - this._data[location][i].amount;
            }
          }
          else {
            if ( carriedtap < 0 ) {
              amount += carriedtap;
              if ( amount <= 0 ) {
                return;
              }
            }
            // if the next entry has been zeroed out, don't know what to do
            if ( this._data[location][i].amount == 0 ) {
              return;
            }
          }

          oldtap = this._data[location][i].amount;
          this._data[location][i].amount += amount;
          i++;
        }
      }
    }
  }

 
}