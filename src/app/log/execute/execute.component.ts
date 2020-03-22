import { Component, OnInit, Input } from '@angular/core';
import { Campaign } from '../../model/campaign';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.less']
})
export class ExecuteComponent implements OnInit {

  //@Input() campaign: Campaign;
  actions: {}[];

  constructor() { }

  ngOnInit(): void {
    //this.actions = this.campaign.nextActions();
  }

}
