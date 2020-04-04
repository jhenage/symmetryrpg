import { Component, Input } from '@angular/core';
import { MoveProcessActionObject } from './action';
import { ActionHistoryComponent } from '../history.component';

@Component({
  template: `{{action.character.about.name}} movement.`
})
export class MoveHistoryComponent implements ActionHistoryComponent {
  @Input() action: MoveProcessActionObject;
  
  constructor() { }

  //get speed(): string {
  //  if(this.action.data.speed <= .25) {
  //    return 'walked';
  //  }
  //  if(this.action.data.speed <= .5) {
  //    return 'jogged';
  //  }
  //  if(this.action.data.speed <= .75) {
  //    return 'ran';
  //  }
  //  return 'sprinted';
  //}

  // run the next execution
  execute() {

  }

}
