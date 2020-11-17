import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SheetComponent } from './sheet/sheet.component';
import { MapComponent } from './map/map.component';
import { LogComponent } from './log/log.component';
import { ActionDirective } from './log/action/action.directive';
import { TimeButtonDirective } from './log/time-button.directive';

import { AttackActionComponent } from './log/action/attack/component';
import { MoveActionComponent } from './log/action/move/component';
import { ActionwrapComponent } from './log/actionwrap.component';

import { AspectsComponent } from './sheet/aspects/aspects.component';
import { SkillsComponent } from './sheet/skills/skills.component';
import { SpecialtiesComponent } from './sheet/specialties/specialties.component';
import { AboutComponent } from './sheet/about/about.component';
import { StatusComponent } from './status/status.component';
import { TraitsComponent } from './sheet/traits/traits.component';
import { EquipmentComponent } from './sheet/equipment/equipment.component';
import { SpellsComponent } from './sheet/spells/spells.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, LogComponent, ActionDirective, 
    MoveActionComponent, AttackActionComponent, ActionwrapComponent,
    AspectsComponent, SkillsComponent, AboutComponent,
    SpecialtiesComponent,
    StatusComponent,
    TraitsComponent,
    TimeButtonDirective,
    EquipmentComponent,
    SpellsComponent
   ],
  entryComponents: [ MoveActionComponent, AttackActionComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
