import { Component, Input, OnInit } from '@angular/core';
import { Aspects } from '../../model/character/aspects'
import { LogService } from '../../log/log.service';
import { AspectTestActionFactory } from '../../log/action/aspecttest/action';

@Component({
  selector: 'app-aspects',
  templateUrl: './aspects.component.html',
  styleUrls: ['./aspects.component.less','../sheet.component.less']
})
export class AspectsComponent implements OnInit {

  @Input() aspects: Aspects;
  readonly MINIMUM_VALUE = -7;
  readonly MAXIMUM_VALUE = 15;
  readonly PRECISION = 1; // number of digits after decimal point to keep track of
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
    this.aspects.setAspectRank(aspectName,Number(Number(rank).toFixed(this.PRECISION)));
  }


  makeAspectTest(aspectName:string) {
    let factory = new AspectTestActionFactory();
    let action = factory.build(this.aspects.character,{time:this.logService.now,aspect:aspectName});
    this.logService.newAction(action);
  }
}
