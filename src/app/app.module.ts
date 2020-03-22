import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet/sheet.component';
import { MapComponent } from './map/map.component';
import { ExecuteComponent } from './log/execute/execute.component';
import { LogComponent } from './log/log.component';
import { AspectsComponent } from './sheet/aspects/aspects.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, ExecuteComponent, LogComponent, AspectsComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
