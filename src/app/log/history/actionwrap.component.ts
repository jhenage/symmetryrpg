import { Component, ViewChild, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { ActionDirective } from '../action/action.directive';
import { ActionHistoryComponent } from '../action/history.component';

import { AspecttestHistoryComponent } from '../action/aspecttest/history.component'
import { SkilltestHistoryComponent } from '../action/skilltest/history.component'

const historyActionComponents = {
  aspecttest: AspecttestHistoryComponent,
  skilltest: SkilltestHistoryComponent
};

@Component({
  selector: 'historyactionwrap',
  template: `<a (click)="log(action)">(_)</a><ng-template appAction></ng-template>`
})
export class HistoryActionwrapComponent implements OnInit {
  @Input() action: any;
  @ViewChild(ActionDirective, {static: true}) actionHost: ActionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentClass = historyActionComponents[this.action.data.type];
    if ( ! componentClass ) { throw new Error('Bad action type '+this.action.data.type); }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);

    const viewContainerRef = this.actionHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<ActionHistoryComponent>componentRef.instance).action = this.action;

  }

  log(action) { console.log(action); }
}
