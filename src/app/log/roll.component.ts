import { Component, Input } from '@angular/core';
import { RollObject } from '../model/character/rolls';
import { LogService } from './log.service';

@Component({
  selector: 'rollwrap',
  template: `<a *appTimeButton="roll.data.time">Start</a>
              <a (click)="log(roll)">(_)</a>{roll.character.about.name} {roll.data.modifier.ability.aspect}`,
})
export class RollComponent {
  @Input() roll: RollObject;

  constructor(private logService: LogService) { }

  log(roll) { console.log(roll); }
  time(time:number) { this.logService.timer.time = time; }
}
