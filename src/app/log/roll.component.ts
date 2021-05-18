import { Component, Input } from '@angular/core';
import { RollData } from '../model/character/actions';
import { LogService } from './log.service';
import {MatDialog} from '@angular/material/dialog';
import { RollDialogComponent } from './roll-dialog.component';

@Component({
  selector: 'rollwrap',
  templateUrl: './roll.component.html',
})
export class RollComponent {
  @Input() roll: RollData;

  constructor(private logService: LogService, public dialog: MatDialog) { }

  log(roll) { console.log(roll); }
  time(time:number) { this.logService.data.time = time; }
  edit() {
    const dialogRef = this.dialog.open(RollDialogComponent, {data:{roll:this.roll}});
  }

}
