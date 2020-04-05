import { Component, Input } from '@angular/core';
import { MoveProcessActionObject } from './action';
import { ActionHistoryComponent } from '../history.component';
import { LogService } from '../../log.service';

@Component({
  template: `{{action.character.about.name}} movement. <a *ngIf="action.data.nextExecution" (click)="execute()">EXE</a>`
})
export class MoveHistoryComponent implements ActionHistoryComponent {
  @Input() action: MoveProcessActionObject;
  
  constructor(private logService: LogService) { }

  // run the next execution
  execute() {
    this.logService.progressClock(this.action.data.nextExecution);
  }

}
