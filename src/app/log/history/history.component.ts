import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  actions:{}[];

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.actions = [];
    this.logService.registerAddToHistory((action) => {
      this.actions.push(action);
      console.log('added',this.actions);
    });
  }

}
