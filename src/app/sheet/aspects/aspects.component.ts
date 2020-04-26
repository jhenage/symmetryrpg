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
  inputsOutOfRange = {};

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.aspects.aspectsList.forEach((aspect) => {
      this.inputsOutOfRange[aspect] = false;
    })
  }

  setAspectRank(aspectName: string,rank: number) {
    if(rank < this.aspects.MINIMUM_VALUE) {
      rank = this.aspects.MINIMUM_VALUE;
      this.inputsOutOfRange[aspectName] = true;
    } else if(rank > this.aspects.MAXIMUM_VALUE) {
      rank = this.aspects.MAXIMUM_VALUE;
      this.inputsOutOfRange[aspectName] = true;
    } else {
      this.inputsOutOfRange[aspectName] = false;
    }
    this.aspects.setAspectRank(aspectName,rank);
  }


  makeAspectTest(aspectName:string) {
    let factory = new AspectTestActionFactory();
    let action = factory.build(this.aspects.character,{time:this.logService.now,aspect:aspectName});
    this.logService.newAction(action);
  }
}
