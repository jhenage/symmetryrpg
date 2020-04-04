import { Component, Input, OnDestroy } from '@angular/core';
import { MoveActionObject, MoveProcessActionObject } from './action';
import { ActionExecuteComponent } from '../execute.component';
import { LogService } from '../../log.service';

@Component({
  template: `{{action.character.about.name}} movement. <a (click)="execute()">EXE</a>`
})
export class MoveExecuteComponent implements ActionExecuteComponent {
  @Input() action: MoveActionObject;
  
  constructor(private logService: LogService) { }

  //get speed(): string {
  //  if(this.action.data.speed <= .25) {
  //    return 'is walking';
  //  }
  //  if(this.action.data.speed <= .5) {
  //    return 'is jogging';
  //  }
  //  if(this.action.data.speed <= .75) {
  //    return 'is running';
  //  }
  //  return 'is sprinting';
  //}

  // convert action into MoveProcessActionObject
  execute() {
    this.logService.executeAction(this.action);
  }

}
