import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogComponentData, LogService } from './log.service';
import { ActionObject } from './action/object'
import { Campaign } from '../model/campaign';
import { DataService } from '../data.service';
import { RollData } from '../model/character/actions';
import { MatDialog } from '@angular/material/dialog';
import { RollDialogComponent } from './roll-dialog.component';
import { GenericEditorComponent } from './action/generic/editor.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit, OnDestroy {
  data: LogComponentData;
  campaign: Campaign;
  private interval: number; // setIntervalID
  speed: number; // speed of timer
  constructor(private logService: LogService, private dataService: DataService, public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.data = this.logService.data;
    this.campaign = this.dataService.campaign;
    this.toNow();
  }

  ngOnDestroy() {
    window.clearInterval(this.interval);
  }

  play() {
    
    if(typeof this.interval == 'undefined') {
      this.speed = 1;
      this.interval = window.setInterval(()=>{
        this.data.time += this.speed;
      },10);
    }
    else if(this.speed == 1) {
      this.speed = 10;
    } else {
      window.clearInterval(this.interval);
      this.interval = undefined;
      this.speed = 0;
    }
    
  }
  toNow() {
    this.data.time = this.campaign.now;
    window.clearInterval(this.interval);
    this.interval = undefined;
    this.speed = 0;
  }

  setTime(time:number) {
    this.data.time = Number(time) || 0;
  }

  rollNow(action: ActionObject,roll: RollData) {
    this.logService.progressClock(roll.time);
    const dialogRef = this.dialog.open(RollDialogComponent, {data:{action,roll}});
    
    dialogRef.afterClosed().subscribe((result)=>{
      if(result) {
        roll.order = this.logService.nextOrder(roll.time);
        this.logService.sortAll();
      } else {
        roll.dice = [];
      }
    });
    
  }

  editAction(action: ActionObject) {
    if(action.data.type=='generic') {
      const dialogRef = this.dialog.open(GenericEditorComponent, {data:{action}});
      dialogRef.afterClosed().subscribe(result => {
        this.logService.sortAll();
      });

    }

  }

  console(xx:any) {
    console.log(xx);
  }

}
