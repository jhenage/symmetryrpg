import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  @Input() actions:{}[];

  constructor() { }

  ngOnInit(): void {
//   this.actions = [];
//   this.logService.registerAddToHistory((action) => {
//     this.actions.push(action);
//     console.log('added',this.actions);
//   });
  }

}
