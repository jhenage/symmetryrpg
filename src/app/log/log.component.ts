import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit {
  history: {}[];
  constructor(private logService: LogService ) {
    
  }

  ngOnInit(): void {
    this.history = this.logService.history;
  }

}
