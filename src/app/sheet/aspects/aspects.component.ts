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
  readonly MIN_RANK = 0;
  readonly MAX_RANK = 25;

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.aspects.aspectsList.forEach((aspect) => {
      this.inputsOutOfRange[aspect] = false;
    })
  }

  setAspectRank(aspectName: string,rank: number) {
    if(rank < this.MIN_RANK) {
      rank = this.MIN_RANK;
      this.inputsOutOfRange[aspectName] = true;
    } else if(rank > this.MAX_RANK) {
      rank = this.MAX_RANK;
      this.inputsOutOfRange[aspectName] = true;
    } else {
      this.inputsOutOfRange[aspectName] = false;
    }
    this.aspects.setAspectRank(aspectName,rank);
  }


  makeAspectTest(time:number, aspectName:string) {
    let factory = new AspectTestActionFactory();
    let action = factory.build(this.aspects.character,{time:time,aspect:aspectName});
    this.logService.newAction(action);
  }
}
