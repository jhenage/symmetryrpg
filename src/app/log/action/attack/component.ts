import { Component, Input } from '@angular/core';
import { AttackActionObject } from './action';
import { LogService } from '../../log.service';
import { ActionComponentInterface } from '../component.interface';

@Component({
  template: `{{action.character.about.name}} attacking {{action.enemy.about.name}}. <a *ngIf="!action.data.endTime" (click)="execute()">EXE</a>`
})
export class AttackActionComponent implements ActionComponentInterface {
  @Input() action: AttackActionObject;
  
  constructor(private logService: LogService) { }

  // run the next execution
  execute() {
    if(this.action.data.nextExecution) {
        this.logService.progressClock(this.action.data.nextExecution);
    } else {
        this.logService.executeAction(this.action);
    }
    
  }

}
