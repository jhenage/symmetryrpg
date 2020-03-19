import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet.component';
import { MapComponent } from './map.component';
import { ExecuteComponent } from './execute/execute.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, ExecuteComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
