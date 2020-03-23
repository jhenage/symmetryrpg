import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet/sheet.component';
import { MapComponent } from './map/map.component';
import { ExecuteComponent } from './log/execute/execute.component';
import { LogComponent } from './log/log.component';
import { QueueComponent } from './log/queue/queue.component';
import { HistoryComponent } from './log/history/history.component';
import { ActionDirective } from './log/action/action.directive';
import { AspectsComponent } from './sheet/aspects/aspects.component';
import { HistoryActionwrapComponent } from './log/history/actionwrap.component';

import { AspecttestHistoryComponent } from './log/action/aspecttest/history.component';
import { SkilltestHistoryComponent } from './log/action/skilltest/history.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, ExecuteComponent, LogComponent, QueueComponent, HistoryComponent, ActionDirective, 
    HistoryActionwrapComponent, AspectsComponent,
    AspecttestHistoryComponent, SkilltestHistoryComponent
   ],
  entryComponents: [ AspecttestHistoryComponent, SkilltestHistoryComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
