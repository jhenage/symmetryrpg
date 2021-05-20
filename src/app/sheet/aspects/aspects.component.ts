import { Component, Input, OnInit } from '@angular/core';
import { Aspects } from '../../model/character/aspects'
import { LogService } from '../../log/log.service';
import { GenericActionObject } from '../../log/action/generic/action';

@Component({
  selector: 'app-aspects',
  templateUrl: './aspects.component.html',
  styleUrls: ['./aspects.component.less','../sheet.component.less']
})
export class AspectsComponent implements OnInit {

  @Input() aspects: Aspects;
  readonly MINIMUM_VALUE = -7;
  readonly MAXIMUM_VALUE = 15;
  readonly ASPECT_PRECISION = 1; // number of digits after decimal point to keep track of
  readonly TIME_PRECISION = 3;
  inputsOutOfRange = {};

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.aspects.aspectsList.forEach((aspect) => {
      this.inputsOutOfRange[aspect] = false;
    })
  }

  setAspectRank(aspectName: string,rank: number) {
    if(rank < this.MINIMUM_VALUE) {
      rank = this.MINIMUM_VALUE;
      this.inputsOutOfRange[aspectName] = true;
    } else if(rank > this.MAXIMUM_VALUE) {
      rank = this.MAXIMUM_VALUE;
      this.inputsOutOfRange[aspectName] = true;
    } else {
      this.inputsOutOfRange[aspectName] = false;
    }
    this.aspects.setAspectRank(aspectName,Number(Number(rank).toFixed(this.ASPECT_PRECISION)));
  }

  makeAspectTest(aspectName:string) {
    let action = GenericActionObject.Build(this.aspects.character,{time:this.logService.now,aspect:aspectName});
    this.logService.newAction(action);
  }

  get mentalActionDuration(): string {
    let result = this.aspects.getMentalActionTime(this.now,1,{targetedPenalty:0,genericPenalty:0,incidentalPenalty:0});
    return result.toFixed(this.TIME_PRECISION) + " sec";
  }

  get physicalActionDuration(): string {
    let result = this.aspects.getPhysicalActionTime(this.now,1,{targetedPenalty:0,genericPenalty:0,incidentalPenalty:0});
    return result.toFixed(this.TIME_PRECISION) + " sec";
  }

  get mentalReactionTimeRange(): string {
    let result = this.aspects.getMentalReactionTime(this.now,0,[0,0,0,0],false).toFixed(this.TIME_PRECISION) + " - ";
    return result + this.aspects.getMentalReactionTime(this.now,0,[50,50,50,50],false).toFixed(this.TIME_PRECISION) + " sec"; 
  }

  get physicalReactionTimeRange(): string {
    let result = this.aspects.getPhysicalReactionTime(this.now,0,[0,0,0,0],false).toFixed(this.TIME_PRECISION) + " - ";
    return result + this.aspects.getPhysicalReactionTime(this.now,0,[50,50,50,50],false).toFixed(this.TIME_PRECISION) + " sec"; 
  }

  get surpriseMultiplier(): string {
    return this.aspects.getSurpriseMultiplier(this.aspects.current(this.now,"awareness")).toFixed(this.ASPECT_PRECISION + 1);
  }

  get now(): number {
    return this.aspects.character.campaign.now;
  }

  displayValue(value: number) {
    return value.toFixed(this.ASPECT_PRECISION);
  }

  getModifierString(aspectName:string): string {
    let bonus = this.aspects.permanent(aspectName) - this.aspects.getAspectRank(aspectName);
    let result = " " + Math.abs(bonus).toFixed(this.ASPECT_PRECISION) + " = ";
    if(bonus < 0) return " -" + result;
    return " +" + result;
  }

}
