import { Component, ViewChild, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { ActionDirective } from '../action/action.directive';
import { ActionExecuteComponent } from '../action/execute.component';

import { MoveExecuteComponent } from '../action/move/execute.component'

const executeActionComponents = {
  move: MoveExecuteComponent
};

@Component({
  selector: 'executeactionwrap',
  template: `<a (click)="log(action)">(_)</a><ng-template appAction></ng-template>`
})
export class ExecuteActionwrapComponent implements OnInit {
  @Input() action: any;
  @ViewChild(ActionDirective, {static: true}) actionHost: ActionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentClass = executeActionComponents[this.action.data.type];
    if ( ! componentClass ) { throw new Error('Bad action type '+this.action.data.type); }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);

    const viewContainerRef = this.actionHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ActionExecuteComponent>componentRef.instance).action = this.action;

  }

  log(action) { console.log(action); }
}
