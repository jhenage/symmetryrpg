import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet/sheet.component';
import { MapComponent } from './map/map.component';
import { LogComponent } from './log/log.component';
import { TimeButtonDirective } from './log/time-button.directive';
import { RollDialogComponent } from './log/roll-dialog.component';
import { GenericActionEditor } from './log/action/generic/editor.component';
import { AttackActionEditor } from './log/action/attack/editor.component';

import { AspectsComponent } from './sheet/aspects/aspects.component';
import { SkillsComponent } from './sheet/skills/skills.component';
import { SpecialtiesComponent } from './sheet/specialties/specialties.component';
import { AboutComponent } from './sheet/about/about.component';
import { StatusComponent } from './status/status.component';
import { TraitsComponent } from './sheet/traits/traits.component';
import { EquipmentComponent } from './sheet/equipment/equipment.component';
import { SpellsComponent } from './sheet/spells/spells.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, MatDialogModule, BrowserAnimationsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, LogComponent, 
    RollDialogComponent, 
    AspectsComponent, SkillsComponent, AboutComponent, GenericActionEditor, AttackActionEditor,
    SpecialtiesComponent,
    StatusComponent,
    TraitsComponent,
    TimeButtonDirective,
    EquipmentComponent,
    SpellsComponent
  ],
  entryComponents: [ RollDialogComponent, GenericActionEditor, AttackActionEditor ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
