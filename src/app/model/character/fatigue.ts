import { Character } from '../character'
export interface FatigueData {
  aerobic: {
    time: number;
    rate: number;  // rate of spending, not recovery
    amount: number;  // size of regular fatigue
    malfatigue: number;  // increases penalty but not HR
  }[];
  muscles: {
    [propName: string]: { // Location (e.g. leftArm, mental)
      time: number;
      rate: number;
      amount: number[];
    }[];
  }
}

// As of 3/17, these functions are not quite ready for consumption
//  Aerobic fatigue uses Endurance, and currently only needs adjustment per muscle group size
//  Muscle fatigue needs the values entered to be divided by Endurance still
//  Both need a scale to convert actions into fatigue values.
//   Note that Aerobic buckets are 30*End, Muscle Buckets are 60,000

const muscleCarryover = 0.3; // Percent that gets added to subsequent bucket

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
    this._data = {aerobic: [],muscles: {}};
    return this._data;
  }

  Penalty(location: string, time: number): number {
    if ( location == 'aerobic' || location == 'general' ) {
      // find the correct entry:
      for(let i = this._data.aerobic.length; i > 0; i--) {
        if ( this._data.aerobic[i-1].time <= time ) {
          let result = this.AerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
          let buckets = this.AerobicBuckets(time,result.amount+result.malfatigue);

          if ( buckets > 7 ) {
            return 2 * (buckets - 7) + 3;
          }

          let penalty = [0,-0.5,-1,-0.5,0,1,2,3];
          return penalty[buckets];          
        }
      }
      return 0;
    }
    if ( !this._data.muscles.hasOwnProperty(location) ) {
      return 0;
    }

    for(let i = this._data.muscles[location].length; i > 0; i--) {
      if ( this._data.muscles[location][i-1].time <= time ) {
        let result = this.MuscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
        let total = result.reduce((a,b) => a+b);
        return total / 60000;
      }
    }
  }

  AddAerobicRate(time:number,rate:number): void {
    let i = this._data.aerobic.length;
    if ( i == 0 ) {
      this._data.aerobic.push({time:time,rate:rate,amount:0,malfatigue:0});
      return;
    }

    if ( this._data.aerobic[i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }
    if ( this._data.aerobic[i-1].time == time ) {
      this._data.aerobic[i-1].rate += rate;
      return;
    }
    let result = this.AerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
    this._data.aerobic.push({time:time,rate:this._data.aerobic[i-1].rate+rate,amount:result.amount,malfatigue:result.malfatigue});
  }

  AddAerobicMalfatigue(time:number,malfatigue:number): void {
    let i = this._data.aerobic.length;
    if ( i == 0 ) {
      this._data.aerobic.push({time:time,rate:0,amount:0,malfatigue:malfatigue});
      return;
    }

    if ( this._data.aerobic[i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }
    if ( this._data.aerobic[i-1].time == time ) {
      this._data.aerobic[i-1].malfatigue += malfatigue;
      return;
    }
    let result = this.AerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
    this._data.aerobic.push({time:time,rate:this._data.aerobic[i-1].rate,amount:result.amount,malfatigue:result.malfatigue+malfatigue});
  }

  protected AerobicBucketSize(time:number): number {
    return this.character.Endurance(time) * 30;
  }

  protected AerobicBuckets(time:number,fatigue: number): number {
    return Math.floor(fatigue / this.AerobicBucketSize(time));
  }

  // return fatigue per milisecond
  protected AerobicRecoverySpeed(time:number,buckets: number): number {
    if ( buckets > 6 ) {
      return this.character.Endurance(time) * .0016;
    }
    return this.character.Endurance(time) * 0.0002 * (buckets+1);
  }

  protected AerobicOverTime(amount:number,malfatigue:number,rate:number,start:number,end:number): {amount:number,malfatigue:number} {
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

  ValidateMuscleLocation(time:number,location: string) {
    if ( !this._data.muscles.hasOwnProperty(location) ) {
      if ( location != 'mental' && !this.character.creatureType.limbs.hasOwnProperty(location) ) {
        throw new Error('Invalid location '+location);
      }
      this._data.muscles[location] = [{ time: time, rate: 0, amount: Array(5).fill(0) }];
    }
  }
  
  AddMuscleRate(time:number,rate:number,location:string): void {
    
    this.ValidateMuscleLocation(time,location);
    let i = this._data.muscles[location].length;

    if ( this._data.muscles[location][i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }
    if ( this._data.muscles[location][i-1].time == time ) {
      this._data.muscles[location][i-1].rate += rate;
      return;
    }
    let result = this.MuscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
    this._data.muscles[location].push({time:time,rate:rate+this._data.muscles[location][i-1].rate,amount:result});
  }

  // Adding Instant Fatigue
  AddMuscleAmount(time:number,amount:number,location:string): void {
    
    this.ValidateMuscleLocation(time,location);
    let i = this._data.muscles[location].length;
    
    if ( this._data.muscles[location][i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }

    let result = this.MuscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
    for ( let i = 0; i < 5; i++ ) {
      result[i] += amount;
      if ( result[i] < 0 ) {
        result[i] = 0;
      }

      if ( i < 4 ) {
        amount *= muscleCarryover;
        if ( amount < result[i] - 60000 - result[i+1] ) { // this bucket is more than one penalty larger than the next
          amount = result[i] - 60000 - result[i+1];
        }
      }
    }

    if ( this._data.muscles[location][i-1].time == time ) {
      this._data.muscles[location][i-1].amount = result;
      return;
    }
    this._data.muscles[location].push({time:time,rate:this._data.muscles[location][i-1].rate,amount:result});
  }


  protected MuscleOverTime(rate:number,amount:number[],duration:number): number[] {
    let result = Array(5).fill(0);
    let toadd = duration * rate;

    for ( let i = 0; i < 5; i++ ) {
      result[i] = amount[i] + toadd - duration * Math.pow(0.1,i);
      if ( result[i] < 0 ) {
        result[i] = 0;
      }

      if ( i < 4 ) {
        toadd *= muscleCarryover;
        if ( toadd < result[i] - 60000 - amount[i+1] ) { // this bucket is more than one penalty larger than the next
          toadd = result[i] - 60000 - amount[i+1];
        }
      }
    }

    return result;
  }

}