import { Component, Input, OnInit } from '@angular/core';
import { Aspects } from '../../model/character/aspects'

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

  getRangeClass(aspect) {
    return this.inputsOutOfRange[aspect] ? "out-of-range" : "";
  }

}
