import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet.component';
import { MapComponent } from './map.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
