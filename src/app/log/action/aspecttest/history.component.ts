import { Component, Input } from '@angular/core';
import { AspectTestActionObject } from './action';
import { ActionHistoryComponent } from '../history.component';

@Component({
  template: `{{action.character.about.name}} rolled a Pure {{action.data.aspect|titlecase}} test.
  <div class="result">
      <select [(ngModel)]="action.data.luck">
          <option value="low">Low Luck</option>
          <option value="high">High Luck</option>
      </select>
      {{action.data.luck=="low" ? action.roll.lowluckResult : action.roll.standardResult}}
  </div>`
})
export class AspecttestHistoryComponent implements ActionHistoryComponent {
  @Input() action: AspectTestActionObject;
  
  constructor() { }
}
