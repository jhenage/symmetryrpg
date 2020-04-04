import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService, TimerObject } from './log.service';
import { ActionObject } from './action/factory'
import { Campaign } from '../model/campaign';
import { DataService } from '../data.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit, OnDestroy {
  history: ActionObject[];
  execute: ActionObject[];
  queue: ActionObject[];
  timer: TimerObject;
  campaign: Campaign;
  private interval: number; // setIntervalID
  constructor(private logService: LogService, private dataService: DataService ) { }

  ngOnInit(): void {
    this.history = this.logService.history;
    this.execute = this.logService.execute;
    this.queue = this.logService.queue;
    this.timer = this.logService.timer;
    this.campaign = this.dataService.campaign;
    this.toNow();
  }

  ngOnDestroy() {
    window.clearInterval(this.interval);
  }

  play() {
    
    if(typeof this.interval == 'undefined') {
      this.interval = window.setInterval(()=>{
        this.timer.time += 1;
      },10);
    }
    else {
      window.clearInterval(this.interval);
      this.interval = undefined;
    }
    
  }
  setNow() {
    if(this.timer.time > this.campaign.now) {
      this.logService.progressClock(this.timer.time);
    }
    else {
      this.toNow();
    }
  }
  toNow() {
    this.timer.time = this.campaign.now;
    window.clearInterval(this.interval);
    this.interval = undefined;
  }

  setTime(time:number) {
    this.timer.time = Number(time);
  }

}
