import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionBodyPart } from 'src/app/model/character/actions';
import { ActionObject } from '../object';

@Component({
  selector: 'generic-editor',
  templateUrl: './editor.component.html',
})
export class GenericEditorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: ActionObject }) { }

  addBody() {
    this.data.action.data.body.push({name:"",intensity:0});
  }

  removeBody(index: number) {
    this.data.action.data.body.splice(index,1);
  }

  addRoll() {
    this.data.action.data.rolls.push({time:this.data.action.data.time,modifier:{aspect:''},dice:[]});
  }
  removeRoll(index: number) {
    this.data.action.data.rolls.splice(index,1);
  }

  rollDice() { }
}


// Calling this editor:
//import { Component, Input } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
//import { LogService } from '../../log.service';
//import { ActionComponentInterface } from '../component.interface';
//import { ActionObject } from '../factory';
//import { GenericEditorComponent } from './editor.component';
//
//@Component({
//  template: `{{action.character.about.name}} <a *ngIf="!action.data.executed" (click)="edit()">Edit</a>`
//})
//export class GenericActionComponent implements ActionComponentInterface {
//  @Input() action: ActionObject;
//  
//  constructor(private logService: LogService, public dialog: MatDialog) { }
//
//  // run the next execution
//  execute() {
//    //this.logService.executeAction(this.action);
//    
//  }
//
//  edit() {
//    const dialogRef = this.dialog.open(GenericEditorComponent, {data:{action:this.action}});
//    dialogRef.afterClosed().subscribe(result => {
//      // set the next roll
//      this.action.data.nextRoll = 0;
//      this.action.data.rolls.sort((a,b)=> {return a.time - b.time;})
//      this.action.data.rolls.forEach((roll,index)=>{
//        if(!this.action.data.nextRoll && roll.time >= this.logService.now) {
//          this.action.data.nextRoll = index+1;
//        }
//      })
//      this.logService.sortAll();
//    });
//  }
//
//}
