import { Component, Input } from '@angular/core';
import { MoveActionObject } from './action';
import { ActionQueueComponent } from '../queue.component';

@Component({
  template: `{{action.character.about.name}} movement.`
})
export class MoveQueueComponent implements ActionQueueComponent {
  @Input() action: MoveActionObject;
  
  constructor() { }

}
