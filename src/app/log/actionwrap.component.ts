import { Component, ViewChild, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { ActionDirective } from './action/action.directive';
import { ActionComponentInterface } from './action/component.interface';
import { LogService } from './log.service';
import { ActionObject } from './action/factory';
//import { TimeButtonDirective } from '../time-button.directive';

import { MoveActionComponent } from './action/move/component';
import { AttackActionComponent } from './action/attack/component';

const actionComponents = {
  move: MoveActionComponent,
  attack: AttackActionComponent
};

@Component({
  selector: 'actionwrap',
  template: `<a *appTimeButton="action.data.time">Start</a>
              <a *appTimeButton="action.data.nextExecution||action.data.endTime">End</a>
              <a (click)="log(action)">(_)</a><ng-template appAction></ng-template>`,
  styleUrls: ['./actionwrap.component.less']
})
export class ActionwrapComponent implements OnInit {
  @Input() action: ActionObject;
  @ViewChild(ActionDirective, {static: true}) actionHost: ActionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private logService: LogService) { }

  ngOnInit() {
    const componentClass = actionComponents[this.action.data.type];
    if ( ! componentClass ) { throw new Error('Bad action type '+this.action.data.type); }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);

    const viewContainerRef = this.actionHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ActionComponentInterface>componentRef.instance).action = this.action;

  }

  log(action) { console.log(action); }
  time(time:number) { this.logService.timer.time = time; }
}
