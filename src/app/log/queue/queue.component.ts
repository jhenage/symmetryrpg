import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {
  @Input() actions:{}[];

  constructor() { }

  ngOnInit(): void {
  }

}
