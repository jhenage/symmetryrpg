import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAction]'
})
export class ActionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
