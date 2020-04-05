import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../model/character';
import { LogService } from '../log/log.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.less']
})
export class StatusComponent implements OnInit {

  @Input() character: Character;
  @Input() now: number; 
  @Output() saved = new EventEmitter();

  timer: {time:number};

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.timer = this.logService.timer;
  }

  save() {
    this.saved.emit();
  }

}
