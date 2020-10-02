import { Component, Input } from '@angular/core';
import { MoveProcessActionObject } from './action';
import { LogService } from '../../log.service';
import { ActionComponentInterface } from '../component.interface';

@Component({
  template: `{{action.character.about.name}} movement. <a *ngIf="!action.data.endTime" (click)="execute()">EXE</a>`
})
export class MoveActionComponent implements ActionComponentInterface {
  @Input() action: MoveProcessActionObject;
  
  constructor(private logService: LogService) { }

  // run the next execution
  execute() {
    if(this.action.data.nextExecution) {
        this.logService.progressClock(this.action.data.nextExecution);
    } else {
        this.action.data.path.forEach((path) => {
            path.speed = Number(path.speed);
        });
        this.logService.executeAction(this.action);
    }
    
  }

}
