import { Component, ViewChild, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { ActionDirective } from '../action/action.directive';
import { ActionQueueComponent } from '../action/queue.component';
import { LogService } from '../log.service';

import { MoveQueueComponent } from '../action/move/queue.component';

const queueActionComponents = {
  move: MoveQueueComponent
};

@Component({
  selector: 'queueactionwrap',
  template: `<a (click)="time(action.data.time)">C</a><a (click)="log(action)">(_)</a><ng-template appAction></ng-template>`
})
export class QueueActionwrapComponent implements OnInit {
  @Input() action: any;
  @ViewChild(ActionDirective, {static: true}) actionHost: ActionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private logService: LogService) { }

  ngOnInit() {
    const componentClass = queueActionComponents[this.action.data.type];
    if ( ! componentClass ) { throw new Error('Bad action type '+this.action.data.type); }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);

    const viewContainerRef = this.actionHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ActionQueueComponent>componentRef.instance).action = this.action;

  }

  log(action) { console.log(action); }
  time(time:number) { this.logService.timer.time = time; }
}
