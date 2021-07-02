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
//   Note that Aerobic buckets are 30*Endurance, Muscle Buckets are 60,000

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

  penalty(location: string, time: number): number {
    if ( location == 'aerobic' || location == 'general' ) {
      let buckets = this.aerobicTotal(time);
      return .2 * (buckets - 2) **2 - .8;
    }
    if ( !this._data.muscles.hasOwnProperty(location) ) {
      return 0;
    }

    for(let i = this._data.muscles[location].length; i > 0; i--) {
      if ( this._data.muscles[location][i-1].time <= time ) {
        let result = this.muscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
        let total = result.reduce((a,b) => a+b);
        return total / 60000;
      }
    }
  }

  aerobicTotal(time:number): number {
      // find the correct entry:
      for(let i = this._data.aerobic.length; i > 0; i--) {
        if ( this._data.aerobic[i-1].time <= time ) {
          let result = this.aerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
          let buckets2 = this.aerobicBuckets(time,result.amount+result.malfatigue);
          let buckets1 = this.aerobicBuckets(time,result.amount);
          return .2 * (buckets1 - 2) **2 - .8 > .2 * (buckets2 - 2) **2 - .8 ? buckets1 : buckets2;
        }
      }
      return 0;

  }

  addAerobicRate(time:number,rate:number): void {
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
    let result = this.aerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
    this._data.aerobic.push({time:time,rate:this._data.aerobic[i-1].rate+rate,amount:result.amount,malfatigue:result.malfatigue});
  }

  addAerobicMalfatigue(time:number,malfatigue:number): void {
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
    let result = this.aerobicOverTime(this._data.aerobic[i-1].amount,this._data.aerobic[i-1].malfatigue,this._data.aerobic[i-1].rate,this._data.aerobic[i-1].time,time);
    this._data.aerobic.push({time:time,rate:this._data.aerobic[i-1].rate,amount:result.amount,malfatigue:result.malfatigue+malfatigue});
  }

  protected aerobicBucketSize(time:number): number {
    return this.character.endurance(time) * 30;
  }

  protected aerobicBuckets(time:number,fatigue: number): number {
    return fatigue / this.aerobicBucketSize(time);
  }

  // return fatigue per milisecond
  protected aerobicRecoverySpeed(time:number,buckets: number): number {
    return this.character.endurance(time) * 0.0002 * (Math.floor(buckets)**1.5+1);
  }

  protected aerobicOverTime(amount:number,malfatigue:number,rate:number,start:number,end:number): {amount:number,malfatigue:number} {
    let recovery = this.aerobicRecoverySpeed(start,this.aerobicBuckets(start,amount));
    let bucketsize = this.aerobicBucketSize(start);
    let bucketremaining = bucketsize - amount % bucketsize;
    let duration = end - start;

    // first must reduce malfatigue
    if ( malfatigue > 0 ) {
      let timeuntilempty = malfatigue / recovery;
      let timeuntilfull = rate > 0 ? bucketremaining / rate : duration;

      if ( timeuntilempty < duration && timeuntilempty < timeuntilfull ) {
        return this.aerobicOverTime(amount+rate*timeuntilempty, 0, rate, start+timeuntilempty, end);
      }
      if ( timeuntilfull < duration ) {
        return this.aerobicOverTime(amount+rate*timeuntilfull, malfatigue-recovery*timeuntilfull, rate, start+timeuntilfull, end);
      }
      return {amount: amount+rate*duration, malfatigue: malfatigue-recovery*duration};
    }
    
    if ( recovery == rate ) {
      return {amount: amount, malfatigue: 0}
    }
    if ( recovery < rate ) {
      let timeuntilfull = bucketremaining / (rate - recovery);
      if ( timeuntilfull < duration ) {
        return this.aerobicOverTime(amount+bucketremaining,0,rate,start+timeuntilfull,end);
      }
      return {amount: amount+(rate-recovery)*duration, malfatigue: 0};
    }
    if ( amount == 0 ) {
      return {amount: 0, malfatigue: 0};
    }
    bucketremaining = bucketsize - bucketremaining; // change to amount in bucket rather than amount left to fill
    if ( bucketremaining == 0 ) {
      recovery = this.aerobicRecoverySpeed(start,this.aerobicBuckets(start,amount)-1);
      if ( recovery <= rate ) {
        return {amount: amount, malfatigue: 0};
      }

      bucketremaining = bucketsize;
            
    }

    let timeuntilempty = bucketremaining / (recovery - rate);
    if (timeuntilempty < duration) {
      return this.aerobicOverTime(amount - bucketremaining,0,rate,start+timeuntilempty,end);
    }
    return {amount:amount - duration * (recovery - rate),malfatigue:0};

  }

  validateMuscleLocation(time:number,location: string) {
    if ( !this._data.muscles.hasOwnProperty(location) ) {
      if ( location != 'mental' && !this.character.specie.limbs.hasOwnProperty(location) ) {
        throw new Error('Invalid location '+location);
      }
      this._data.muscles[location] = [{ time: time, rate: 0, amount: Array(5).fill(0) }];
    }
  }
  
  addMuscleRate(time:number,rate:number,location:string): void {
    
    this.validateMuscleLocation(time,location);
    let i = this._data.muscles[location].length;

    if ( this._data.muscles[location][i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }

    rate = 3000 * rate / this.character.endurance(time);

    if ( this._data.muscles[location][i-1].time == time ) {
      this._data.muscles[location][i-1].rate += rate;
      return;
    }
    let result = this.muscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
    this._data.muscles[location].push({time:time,rate:rate+this._data.muscles[location][i-1].rate,amount:result});
  }

  // Adding Instant Fatigue
  addMuscleAmount(time:number,amount:number,location:string): void {
    
    this.validateMuscleLocation(time,location);
    let i = this._data.muscles[location].length;
    
    if ( this._data.muscles[location][i-1].time > time ) {
      throw new Error('Invalid time '+time);
    }

    let result = this.muscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
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


  protected muscleOverTime(rate:number,amount:number[],duration:number): number[] {
    let result = Array(5).fill(0);
    let toadd = duration * rate;

    for ( let i = 0; i < 5; i++ ) {
      result[i] = amount[i] + toadd - duration * 0.1**i;
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

  muscleHalflife(time:number,location:string):number {
    if ( !this._data.muscles.hasOwnProperty(location) ) {
      return 0;
    }
    for(let i = this._data.muscles[location].length; i > 0; i--) {
      if ( this._data.muscles[location][i-1].time <= time ) {
        let result = this.muscleOverTime(this._data.muscles[location][i-1].rate,this._data.muscles[location][i-1].amount,time-this._data.muscles[location][i-1].time);
        let goal = result.reduce((a,b) => a+b) / 2;

        for(let i = 0; i<5; i++) {
          if(result[i] *1.1 >= goal) {
            return Math.round(goal/1.1 / .1**i);
          }
          goal -= result[i];
        }
      }
    }

  }

}