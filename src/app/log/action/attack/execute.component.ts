import { Component, Input, OnDestroy } from '@angular/core';
import { AttackActionObject, AttackProcessActionObject } from './action';
import { ActionExecuteComponent } from '../execute.component';
import { LogService } from '../../log.service';

@Component({
  template: `{{action.character.about.name}} attacking {{action.enemy.about.name}}. <a (click)="execute()">EXE</a>`
})
export class AttackExecuteComponent implements ActionExecuteComponent {
  @Input() action: AttackActionObject;
  
  constructor(private logService: LogService) { }
  
  execute() {
    this.logService.executeAction(this.action);
  }

}
