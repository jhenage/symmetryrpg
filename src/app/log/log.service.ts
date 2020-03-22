import { Injectable } from '@angular/core';
import { Character } from '../model/character';

// Manages the generated log from campaign
@Injectable({
  providedIn: 'root'
})
export class LogService {
  private lastProcessedTime: number = 0;
  private lastOrderNumber: number = 0;

 
  constructor() { }

  buildAction(character: Character,time: number,type:string,data: any,objects: any): void {
    data.character = character.id;
    objects.character = character;
    data.time = time;
    data.type = type;

    if ( objects.roll ) {
      data.dice = objects.roll.result;
    }

    objects.data = data;
    character.actions.add(data);
 
    if(type == 'test') {
      data.executed = true;
      data.order = this.nextOrder(time);
      data.luck = 'high';
      if ( data.modifierBySpecialty ) {
        data.missingSpecialty = 0;
      }
      else {
        data.modifier = objects.roll.modifier;
      }
      console.log('Adding History',objects);
      this.AddToHistory(objects);
    }
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

  private AddToHistory: CallableFunction;
  registerAddToHistory(fn: CallableFunction) {
    this.AddToHistory = fn;
  }

}
