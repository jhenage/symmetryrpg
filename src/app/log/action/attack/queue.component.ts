import { Component, Input } from '@angular/core';
import { AttackActionObject } from './action';
import { ActionQueueComponent } from '../queue.component';

@Component({
  template: `{{action.character.about.name}} attacking {{action.enemy.about.name}}.`
})
export class AttackQueueComponent implements ActionQueueComponent {
  @Input() action: AttackActionObject;
  
  constructor() { }

}
