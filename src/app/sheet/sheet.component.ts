import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Character } from '../model/character';
import { LogService } from '../log/log.service';
import { AspectTestActionFactory } from '../log/action/aspecttest/action';
import { SkillTestActionFactory } from '../log/action/skilltest/action';

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
    let factory = new SkillTestActionFactory();
    let action = factory.build(this.character,{time:time,aspect:aspectName,skill:skillName});
    this.logService.newAction(action);
  }

}