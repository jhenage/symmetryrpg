import { Directive, HostListener, Input, HostBinding, TemplateRef, ViewContainerRef, Renderer2 } from '@angular/core';
import { LogService } from './log.service';

@Directive({
  selector: '[appTimeButton]'
})
export class TimeButtonDirective {
  private hasView = false;

  time: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private logService: LogService) { }

  @HostBinding('class.past') get isPast() { 
    if(Number.isInteger(this.time)) {
      const el = this.templateRef.elementRef.nativeElement.previousElementSibling;
      if(this.time < this.logService.data.time) {
        this.renderer.addClass(el, 'past');
        this.renderer.removeClass(el, 'present');
        this.renderer.removeClass(el, 'future');
        return true;
      }
      if(this.time == this.logService.data.time) {
        this.renderer.addClass(el, 'present');
        this.renderer.removeClass(el, 'past');
        this.renderer.removeClass(el, 'future');
        return true;
      }
      if(this.time > this.logService.data.time) {
        this.renderer.addClass(el, 'future');
        this.renderer.removeClass(el, 'present');
        this.renderer.removeClass(el, 'past');
        return true;
      }
    }
    return false;
  };

  @Input() set appTimeButton(time: number) {
    this.time = time;
    if (!Number.isInteger(time) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    } else if (Number.isInteger(time) && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      const el = this.templateRef.elementRef.nativeElement;//.nextElementSibling;
      this.renderer.listen(el.previousElementSibling, 'click', () => {this.logService.data.time = time});
    }
  }

}

