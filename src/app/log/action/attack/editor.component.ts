import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionBodyPart } from 'src/app/model/character/actions';
import { AttackActionObject } from './action';

@Component({
  selector: 'attack-editor',
  templateUrl: './editor.component.html',
})
export class AttackActionEditor {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: AttackActionObject }) { }

  get effort(): number {
    return this.data.action.data.body[0].effort;
  }

  set effort(value: number) {
    this.data.action.data.body.forEach(body => body.effort = value);
  }

  // Power is how hard you are hitting = muscle effort * duration
  // where 0 is minimum possible power, and 100 is maximum possible
//  get power(): number {
//    let effort = this.data.action.data.body[0].effort;
//    let duration = this.data.action.data.endTime - this.data.action.data.time;
//    let maxDuration = 500;
//    return effort * duration / maxDuration;
//  }
//
//  set power(value:number) {
//    let duration = this.data.action.data.endTime - this.data.action.data.time;
//    let maxDuration = 500;
//    let effort = value * maxDuration / duration;
//    if(effort>100) {
//      effort = 100;
//      duration = value * maxDuration / effort;
//      this.data.action.data.endTime = this.data.action.data.time + duration;
//    }
//    this.data.action.data.body.forEach(body => body.effort = effort);
//  }



}

