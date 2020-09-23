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

import { AspecttestHistoryComponent } from './log/action/aspecttest/history.component';
import { SkilltestHistoryComponent } from './log/action/skilltest/history.component';
import { MoveHistoryComponent } from './log/action/move/history.component';
import { MoveExecuteComponent } from './log/action/move/execute.component';
import { MoveQueueComponent } from './log/action/move/queue.component';
import { AttackHistoryComponent } from './log/action/attack/history.component';
import { AttackExecuteComponent } from './log/action/attack/execute.component';
import { AttackQueueComponent } from './log/action/attack/queue.component';

import { AspectsComponent } from './sheet/aspects/aspects.component';
import { HistoryActionwrapComponent } from './log/history/actionwrap.component';
import { QueueActionwrapComponent } from './log/queue/actionwrap.component';
import { ExecuteActionwrapComponent } from './log/execute/actionwrap.component';
import { SkillsComponent } from './sheet/skills/skills.component';
import { SpecialtiesComponent } from './sheet/specialties/specialties.component';
import { AboutComponent } from './sheet/about/about.component';
import { StatusComponent } from './status/status.component';
import { TraitsComponent } from './sheet/traits/traits.component';
import { TimeButtonDirective } from './log/time-button.directive';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SheetComponent, MapComponent, ExecuteComponent, LogComponent, QueueComponent, HistoryComponent, ActionDirective, 
    AspecttestHistoryComponent, SkilltestHistoryComponent, MoveHistoryComponent, MoveExecuteComponent, MoveQueueComponent,
    AttackHistoryComponent, AttackExecuteComponent, AttackQueueComponent,
    HistoryActionwrapComponent, AspectsComponent, SkillsComponent, AboutComponent, QueueActionwrapComponent, ExecuteActionwrapComponent,
    SpecialtiesComponent,
    StatusComponent,
    TraitsComponent,
    TimeButtonDirective
   ],
  entryComponents: [ AspecttestHistoryComponent, SkilltestHistoryComponent, MoveHistoryComponent, MoveExecuteComponent, MoveQueueComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
