import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet.component';
import { MapComponent } from './map.component';
import { ExecuteComponent } from './log/execute/execute.component';
import { LogComponent } from './log/log.component';
import { QueueComponent } from './log/queue/queue.component';
import { HistoryComponent } from './log/history/history.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, ExecuteComponent, LogComponent, QueueComponent, HistoryComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
