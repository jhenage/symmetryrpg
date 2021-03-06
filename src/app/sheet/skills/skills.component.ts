import { Component, Input, OnInit } from '@angular/core';
import { Skills } from 'src/app/model/character/skills';
import { LogService } from 'src/app/log/log.service';
import { GenericActionObject } from 'src/app/log/action/generic/action';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.less','../sheet.component.less']
})
export class SkillsComponent implements OnInit {

  @Input() skills: Skills;
  readonly MINIMUM_VALUE = -7;
  readonly MAXIMUM_VALUE = 15;
  readonly PRECISION = 1; // number of digits after decimal point to keep track of
  inputsOutOfRange = {};

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.skills.skillsList.forEach((skill) => {
      this.inputsOutOfRange[skill] = false;
    })
  }

  setSkillRank(skillName: string,rank: number) {
    if(rank < this.MINIMUM_VALUE) {
      rank = this.MINIMUM_VALUE;
      this.inputsOutOfRange[skillName] = true;
    } else if(rank > this.MAXIMUM_VALUE) {
      rank = this.MAXIMUM_VALUE;
      this.inputsOutOfRange[skillName] = true;
    } else {
      this.inputsOutOfRange[skillName] = false;
    }
    this.skills.setSkillRank(skillName,Number(Number(rank).toFixed(this.PRECISION)));
  }

  makeSkillTest(aspectName:string, skillName:string) {
    let action = GenericActionObject.Build(this.skills.character,{time:this.logService.now,aspect:aspectName,skill:skillName});
    this.logService.newAction(action);
  }

  getBaseResultRank(aspectName:string, skillName:string): number {
    return this.skills.getBaseResult(this.skills.character.aspects.permanent(aspectName),skillName);
  }

  getBaseResultRankText(aspectName:string, skillName:string): string {
    return `Base: ${this.getBaseResultRank(aspectName,skillName).toFixed(this.PRECISION+1)}`;
  }

  getBaseResultProbabilityDescription(aspectName, skillName): string {
    return this.skills.character.getFullProbabilityDescription(this.getBaseResultRank(aspectName,skillName)/2);
  }

}
