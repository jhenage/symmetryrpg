import { Injectable } from '@angular/core';
import { Character } from '../model/character';
import { ActionObject, ActionFactory } from './action/factory';
import { MoveActionFactory } from './action/move/action';
import { AttackActionFactory } from './action/attack/action';
import { DataService } from '../data.service';
import { RollObject } from '../model/character/rolls';


export interface TimerObject {
  time: number;
}

// Manages the generated log from campaign
@Injectable({
  providedIn: 'root'
})
export class LogService {
  private lastProcessedTime: number = 0;
  private lastOrderNumber: number = 0;
  private inprogress: ActionObject[] = [];
  history: ActionObject[] = [];
  queue: ActionObject[] = [];
  movements: ActionObject[] = [];
  rolls: RollObject[];
  timer: TimerObject = {time:0};

  readonly factories: {[propName:string]:ActionFactory} = {
    move: new MoveActionFactory(),
    attack: new AttackActionFactory(),    
  }

 
  constructor(private dataService: DataService) { }

  get now() {
    return this.dataService.campaign.now;
  }

  newAction(action: ActionObject) {
    if(action.data.executed) {
      if ( typeof action.data.order == 'undefined' ) {
        action.data.order = this.nextOrder(action.data.time);
      }
      this.history.push(action);
      if(action.data.nextExecution) {
        this.inprogress.push(action);
      }
    }
    else {
      this.queue.push(action);
      this.sortAll();
      if(action.data.type=="move") {
        this.movements.push(action);
      }
    }
  }

  removeAction(action: ActionObject) {
    if(action.data.executed) {
      let i = this.history.indexOf(action);
      if ( i > -1 ) {
        this.history.splice(i,1);
      }
      i = this.inprogress.indexOf(action);
      if ( i > -1 ) {
        this.inprogress.splice(i,1);
      }
    }
    else {
      let i = this.queue.indexOf(action);
      if ( i > -1 ) {
        this.queue.splice(i,1);
      }
      i = this.movements.indexOf(action);
      if ( i > -1 ) {
        this.movements.splice(i,1);
      }
    }
  }

  newRoll(roll: RollObject): void {
    this.rolls.push(roll);
  }

  import(character: Character) {
    character.actions.getAll().forEach((action) => {
      this.newAction(this.factories[action.type].buildFromStorage(character,action));
    });
    character.rolls.getAll().forEach((roll) => {
      let ro = new RollObject(character,roll);
      this.rolls.push(ro);
    })
    this.sortAll();
  }

  sortAll() {
    this.history.sort((a,b) => {
      if(a.data.time == b.data.time) {
        return a.data.order - b.data.order;
      }
      return a.data.time - b.data.time;
    });
    if(this.queue.length==0) return;
    this.queue.sort((a,b) => a.data.time - b.data.time);
    this.rolls.sort((a,b) => a.data.time - b.data.time);

    let time = this.queue[0].data.time;
  }

  queueFiltered(filter): ActionObject[] {
    return this.queue.slice().concat(this.queue).filter((action) => { 
      if(typeof filter.character == 'number') {
        if(filter.character != action.character.id) {
          return false;
        }
      }
      if(typeof filter.character == 'object') {
        if(filter.character != action.character) {
          return false;
        }
      }
      return this.queueFiltered_Iterate(action.data,filter);
    });
  }
  private queueFiltered_Iterate(data,filter): boolean {
    for ( let name in filter ) {
      if ( typeof data[name] == 'undefined' ) {
        return false;
      }
      if ( typeof filter[name] == 'object' ) {
        if ( !this.queueFiltered_Iterate(data[name],filter[name]) ) {
          return false;
        }
      }
      else {
        if ( data[name] != filter[name] ) {
          return false;
        }
      }
    }
    return true;
  }

  nextOrder(time: number) {
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

  executeAction(action: ActionObject) {
    if(action.data.executed) {

    }
    else {
      this.progressClock(action.data.time);
      this.removeAction(action);
      this.factories[action.data.type].execute(action);
      this.newAction(action);
      this.sortAll();
    }
    this.dataService.saveCharacter(action.character);
    this.dataService.saveCampaign();
   
  }

  progressClock(time: number): void {
    // run all in progress tasks up to this point
    if(this.inprogress.length){
      let sorting = (a: ActionObject,b: ActionObject) => {
        if(a.data.nextExecution == b.data.nextExecution) {
          return a.data.order - b.data.order;
        }
        return a.data.nextExecution - b.data.nextExecution;
      };
      this.inprogress.sort(sorting);  
      while(this.inprogress.length && this.inprogress[0].data.nextExecution <= time) {
        let action = this.inprogress.shift();
        this.factories[action.data.type].execute(action);
        if(action.data.nextExecution) {
          this.inprogress.push(action);
          this.inprogress.sort(sorting);
        }
      }
    }
    
    // set campaign now
    this.dataService.campaign.now = time;
  }

}
