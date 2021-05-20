import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericActionObject } from './action';

@Component({
  selector: 'generic-editor',
  templateUrl: './editor.component.html',
})
export class GenericActionEditor {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: GenericActionObject }) { }

  addBody() {
    this.data.action.data.body.push({name:"",effort:0});
  }

  removeBody(index: number) {
    this.data.action.data.body.splice(index,1);
  }

  addRoll() {
    this.data.action.data.rolls.push({time:this.data.action.data.time,modifier:{aspect:''},dice:[]});
  }
  removeRoll(index: number) {
    this.data.action.data.rolls.splice(index,1);
  }

}
