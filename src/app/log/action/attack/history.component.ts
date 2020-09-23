import { Component, Input } from '@angular/core';
import { AttackProcessActionObject } from './action';
import { ActionHistoryComponent } from '../history.component';
import { LogService } from '../../log.service';

@Component({
  template: `{{action.character.about.name}} attacking {{action.enemy.about.name}}. <a *ngIf="action.data.nextExecution" (click)="execute()">EXE</a>`
})
export class AttackHistoryComponent implements ActionHistoryComponent {
  @Input() action: AttackProcessActionObject;
  
  constructor(private logService: LogService) { }

  // run the next execution
  execute() {
    this.logService.progressClock(this.action.data.nextExecution);
    if(this.action.wound) {

    }
  }

}
