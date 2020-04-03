import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.less']
})
export class ExecuteComponent implements OnInit {

 @Input() actions: {}[];

  constructor() { }

  ngOnInit(): void {
    //this.actions = this.campaign.nextActions();
  }

}