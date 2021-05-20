import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RollData } from '../model/character/actions';
import { DiceRoll } from '../model/diceroll';
import { ActionObject } from './action/object';

@Component({
  selector: 'roll-dialog',
  templateUrl: './roll-dialog.component.html',
})
export class RollDialogComponent implements OnInit {
  //@Input() roll: RollObject;
  modifier: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { roll: RollData, action: ActionObject }) { }

  ngOnInit(): void {
    let modify = this.data.roll.modifier;
    let character = this.data.action.character;
    let time = this.data.roll.time;
    this.modifier = 0; //aspect
    if(modify.skill) {
      let aspectRank = character.aspects.current(time,modify.aspect);
      // TODO: Need to actually see if they have these specialties
      let specialties = modify.specialties ? modify.specialties.length : 0; 
      this.modifier = character.skills.getBaseResult(aspectRank,modify.skill,specialties);
    } else {
      this.modifier = character.aspects.getBaseResult(time,modify.aspect);
    }
    //per body part - TAP, fatigue, wound   -- how much with multiple parts? Add or average? Intensity?
    //
    this.modifier -= character.generalPenalty(time);
    setTimeout(()=>this.rollDice(),1);
  }
  rollDice(): void { 
    let dice = new DiceRoll();
    this.data.roll.dice = dice.standardDice();
  }
  total(): number {
    let ret = this.modifier;
    this.data.roll.dice.forEach((die)=>{ret+=die});
    return ret;
  }
}
