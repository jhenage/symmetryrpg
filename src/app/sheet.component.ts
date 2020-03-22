import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Character } from './model/character';
import { DiceRoll } from './model/diceroll';
import { LogService } from './log/log.service';

@Component({
  selector: 'app-sheet',
  templateUrl: 'sheet.component.html',
  styleUrls: ['sheet.component.less']
})

export class SheetComponent {//implements OnInit, OnDestroy {

  @Input() character: Character;
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  constructor(private logService: LogService) {}

  save() {
    this.saved.emit();
  }

  delete() {
    this.deleted.emit(this.character);
  }

  makeAspectTest(time:number, aspectName:string) {
    let roll = new DiceRoll();
    roll.modifier = this.character.aspects.getBaseResult(time,aspectName);
    this.logService.buildAction(this.character,time,'test',{aspect:aspectName},{roll:roll});
    //this.character.actions.add({time:time});
    console.log(roll);
  }

  makeSkillTest(time:number, aspectName:string, skillName:string) {
    let die = new DiceRoll();
    let modifiers = this.character.skills.getTestModifiers(this.character.aspects.Current(time,aspectName),skillName);
    this.logService.buildAction(this.character,time,'test',{aspect:aspectName,skill:skillName,modifierBySpecialty:modifiers},{roll:die});
    console.log(modifiers,die);
  }

}