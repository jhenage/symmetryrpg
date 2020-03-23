import { Component, Input, OnInit } from '@angular/core';
import { Skills } from 'src/app/model/character/skills';
import { LogService } from 'src/app/log/log.service';
import { SkillTestActionFactory } from 'src/app/log/action/skilltest/action';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.less','../sheet.component.less']
})
export class SkillsComponent implements OnInit {

  @Input() skills: Skills;
  inputsOutOfRange = {};
  readonly MIN_RANK = 0;
  readonly MAX_RANK = 25;

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.skills.skillsList.forEach((skill) => {
      this.inputsOutOfRange[skill] = false;
    })
  }

  setSkillRank(skillName: string,rank: number) {
    if(rank < this.MIN_RANK) {
      rank = this.MIN_RANK;
      this.inputsOutOfRange[skillName] = true;
    } else if(rank > this.MAX_RANK) {
      rank = this.MAX_RANK;
      this.inputsOutOfRange[skillName] = true;
    } else {
      this.inputsOutOfRange[skillName] = false;
    }
    this.skills.setSkillRank(skillName,rank);
  }


  makeSkillTest(time:number, aspectName:string, skillName:string) {
    let factory = new SkillTestActionFactory();
    let action = factory.build(this.skills.character,{time:time,aspect:aspectName,skill:skillName});
    this.logService.newAction(action);
  }

}
