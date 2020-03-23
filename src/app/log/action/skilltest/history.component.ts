import { Component, Input } from '@angular/core';
import { SkillTestActionObject } from './action';
import { ActionHistoryComponent } from '../history.component';

@Component({
  template: `{{action.character.about.name}} rolled a {{action.data.aspect|titlecase}} {{action.data.skill|titlecase}} test.
  <div class="result">
      <select [(ngModel)]="action.data.luck">
          <option value="low">Low Luck</option>
          <option value="high">High Luck</option>
      </select>
      <select [(ngModel)]="action.data.missingSpecialty">
          <option value="0">0 Missing Specialties</option>
          <option value="1">1 Missing Specialties</option>
          <option value="2">2 Missing Specialties</option>
          <option value="3">3 Missing Specialties</option>
      </select>
      {{result()}}
  </div>`
})
export class SkilltestHistoryComponent implements ActionHistoryComponent {
  @Input() action: SkillTestActionObject;
  
  constructor() { }

  result(): number {
    let result = this.action.data.luck=="low" ? this.action.roll.lowluckResult : this.action.roll.standardResult;
    result += this.action.data.modifierBySpecialty[this.action.data.missingSpecialty];
    return result;
  }
}
