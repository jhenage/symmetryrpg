import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Character } from '../model/character';
import { DiceRoll } from '../model/diceroll';
import { LogService } from '../log/log.service';
import { AspectTestActionFactory } from '../log/action/aspecttest/action';

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
    let factory = new AspectTestActionFactory();
    let action = factory.build(this.character,{time:time,aspect:aspectName});
    this.logService.newAction(action);
  }

  makeSkillTest(time:number, aspectName:string, skillName:string) {
    let die = new DiceRoll();
    let modifiers = this.character.skills.getTestModifiers(this.character.aspects.Current(time,aspectName),skillName);
    //this.logService.buildAction(this.character,time,'skilltest',{aspect:aspectName,skill:skillName,modifierBySpecialty:modifiers},{roll:die});
    console.log(modifiers,die);
  }

}