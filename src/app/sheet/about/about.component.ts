import { Component, Input, OnInit } from '@angular/core';
import { About } from 'src/app/model/character/about';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {

  @Input() about: About;
  
  constructor() { }

  ngOnInit(): void {
  }

}
