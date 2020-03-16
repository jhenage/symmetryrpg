import { Character } from '../character'
import { MaxLengthValidator } from '@angular/forms';
export interface FatigueData {
  aerobic: {
    time: number;
    rate: number;  // rate of spending, not recovery
    amount: number;  // size of regular fatigue
    malfatigue: number;  // increases penalty but not HR
  }[];
  [propName: string]: { // Location (e.g. leftArm, mental)
    time: number;
    amount: number;
  }[];
}

export class Fatigue {

  protected _data: FatigueData;
  character: Character;
 
  constructor(character: Character,data?: FatigueData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): FatigueData {
    this._data = {aerobic: []};
    return this._data;
  }

  Penalty(location: string, time: number): number {
    if ( location == 'aerobic' || location == 'general' ) {
      // find the correct entry:
      for(let i = this._data.aerobic.length; i > 0; i--) {
        if ( this._data.aerobic[i-1].time <= time ) {
          let result = this.AerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
          let buckets = this.AerobicBuckets(time,result.amount+result.malfatigue);

          if ( buckets > 4 ) {
            return buckets - 4;
          }

          let penalty = [0,-0.5,-1,-0.5,0];
          return penalty[buckets];          
        }
      }
      return 0;
    }
    if ( !this._data.hasOwnProperty(location) ) {
      return 0;
    }
    return 0;
  }

  AerobicBucketSize(time:number): number {
    return this.character.Endurance(time) * 30;
  }

  AerobicBuckets(time:number,fatigue: number): number {
    return Math.floor(fatigue / this.AerobicBucketSize(time));
  }

  // return fatigue per milisecond
  AerobicRecoverySpeed(time:number,buckets: number): number {
    if ( buckets > 6 ) {
      return this.character.Endurance(time) * .0016;
    }
    return this.character.Endurance(time) * 0.0002 * (buckets+1);
  }

  AerobicOverTime(amount:number,malfatigue:number,rate:number,start:number,end:number): {amount:number,malfatigue:number} {
    let recovery = this.AerobicRecoverySpeed(start,this.AerobicBuckets(start,amount));
    let bucketsize = this.AerobicBucketSize(start);
    let bucketremaining = bucketsize - amount % bucketsize;
    let duration = end - start;

    // first must reduce malfatigue
    if ( malfatigue > 0 ) {
      let timeuntilempty = malfatigue / recovery;
      let timeuntilfull = rate > 0 ? bucketremaining / rate : duration;

      if ( timeuntilempty < duration && timeuntilempty < timeuntilfull ) {
        return this.AerobicOverTime(amount+rate*timeuntilempty, 0, rate, start+timeuntilempty, end);
      }
      if ( timeuntilfull < duration ) {
        return this.AerobicOverTime(amount+rate*timeuntilfull, malfatigue-recovery*timeuntilfull, rate, start+timeuntilfull, end);
      }
      return {amount: amount+rate*duration, malfatigue: malfatigue-recovery*duration};
    }
    
    if ( recovery == rate ) {
      return {amount: amount, malfatigue: 0}
    }
    if ( recovery < rate ) {
      let timeuntilfull = bucketremaining / (rate - recovery);
      if ( timeuntilfull < duration ) {
        return this.AerobicOverTime(amount+bucketremaining,0,rate,start+timeuntilfull,end);
      }
      return {amount: amount+(rate-recovery)*duration, malfatigue: 0};
    }
    if ( amount == 0 ) {
      return {amount: 0, malfatigue: 0};
    }
    bucketremaining = bucketsize - bucketremaining; // change to amount in bucket rather than amount left to fill
    if ( bucketremaining == 0 ) {
      recovery = this.AerobicRecoverySpeed(start,this.AerobicBuckets(start,amount)-1);
      if ( recovery <= rate ) {
        return {amount: amount, malfatigue: 0};
      }

      bucketremaining = bucketsize;
            
    }

    let timeuntilempty = bucketremaining / (recovery - rate);
    if (timeuntilempty < duration) {
      return this.AerobicOverTime(amount - bucketremaining,0,rate,start+timeuntilempty,end);
    }
    return {amount:amount - duration * (recovery - rate),malfatigue:0};

  }

}