import { Injectable } from '@angular/core';
import { Character } from '../model/character';
import { DataService } from '../data.service';
import { RollData } from '../model/character/actions';
import { ActionObject } from './action/object';
import { GenericActionObject } from './action/generic/action';
import { MoveActionObject } from './action/move/action';
import { AttackActionObject } from './action/attack/action';


export interface LogComponentData {
  time: number; // time currently being viewed
  nextRoll: number; // time of next roll
  log: {
      time:number;
      action:ActionObject;
      roll?:RollData;
    }[];
  
}

// Manages the generated log from campaign
@Injectable({
  providedIn: 'root'
})
export class LogService {
  private lastProcessedTime: number = 0;
  private lastOrderNumber: number = 0;
  private queue: ActionObject[] = [];
  data: LogComponentData = {time:0,nextRoll:0,log:[]};
  movements: ActionObject[] = [];

  classes = {
    generic: GenericActionObject,
    move: MoveActionObject,
    attack: AttackActionObject
  };
 
  constructor(private dataService: DataService) { }

  get now() {
    return this.dataService.campaign.now;
  }

  // adds an action to the log
  newAction(action: ActionObject) {
    if( typeof action.data.nextExecution != 'undefined' ) {
      this.queue.push(action);
      if(action.data.type=="move") {
        this.movements.push(action);
      }
    }
    
    if(action.data.rolls && action.data.rolls.length) {
      action.data.rolls.forEach((roll) => {
        this.data.log.push({time:roll.time,action,roll});
      });
    } else {
      this.data.log.push({time:action.data.time,action});
    }
  }

  // removes an action from the log
  removeAction(action: ActionObject) {
    this.data.log = this.data.log.filter(item => item.action != action);
    let i = this.queue.indexOf(action);
    if ( i > -1 ) {
      this.queue.splice(i,1);
    }
    if(action.data.type=="move") {
      i = this.movements.indexOf(action);
      if ( i > -1 ) {
        this.movements.splice(i,1);
      }
    }
  }

  // add all actions from a character to the log
  import(character: Character) {
    character.actions.getAll().forEach((action) => {
      const obj = new this.classes[action.type](character,action);
      this.newAction(obj);
    });
    this.sortAll();
  }

  sortAll() {
    this.queue.sort((a,b) => a.data.nextExecution - b.data.nextExecution);

    let nextRollTime: number;
    this.data.log.forEach(item => {
      if(item.roll) {
        item.time = item.roll.time;
        if(!item.roll.dice || item.roll.dice.length==0) {
          if(typeof nextRollTime == 'undefined' || nextRollTime > item.time) {
            nextRollTime = item.time;
          }
        }
      } else {
        item.time = item.action.data.time;
      }
    });
    this.data.nextRoll = nextRollTime;

    this.data.log.sort((a,b) => {
      if(a.time != b.time) {
        return a.time - b.time;
      }
      if(!a.roll) {
        return b.roll ? 1 : 0;
      }
      if(!b.roll){
        return -1;
      }
      if(a.roll.order && b.roll.order) {
        return a.roll.order - b.roll.order;
      }
      if(a.roll.order) {
        return -1;
      }
      if(b.roll.order) {
        return 1;
      }
      return 0;
    });

  }

  // returns a new generated order number, to sort the order actions were processed
  nextOrder(time: number): number {
    if ( time < this.lastProcessedTime ) {
      throw new Error('Invalid time '+time+' before '+this.lastProcessedTime);
    }
    if ( time == this.lastProcessedTime ) {
      return ++this.lastOrderNumber;
    }
    this.lastProcessedTime = time;
    this.lastOrderNumber = 0;
    return this.lastOrderNumber;
  }

//  executeAction(action: ActionObject) {
//    if(action.data.executed) {
//
//    }
//    else {
//      this.progressClock(action.data.time);
//      this.removeAction(action);
//      this.factories[action.data.type].execute(action);
//      this.newAction(action);
//      this.sortAll();
//    }
//    this.dataService.saveCharacter(action.character);
//    this.dataService.saveCampaign();
//   
//  }

  progressClock(time: number): void {
    // run all in progress tasks up to this point
    if(this.data.nextRoll && time > this.data.nextRoll) {
      console.error('Can\'t progress past a die roll');
      time = this.data.nextRoll;
    }
    if(this.queue.length){
      let sorting = (a: ActionObject,b: ActionObject) => {
        return a.data.nextExecution - b.data.nextExecution;
      };
      this.queue.sort(sorting);  
      while(this.queue.length && this.queue[0].data.nextExecution <= time) {
        let action = this.queue.shift();
        if(action.data.nextExecution==action.data.time && action.data.type == 'move') {
          this.movements.splice(this.movements.indexOf(action),1);
        }
        action.execute();
        if(action.data.nextExecution) {
          this.queue.push(action);
          this.queue.sort(sorting);
        }
      }
    }
    
    // set campaign now
    this.dataService.campaign.now = time;
  }

}
