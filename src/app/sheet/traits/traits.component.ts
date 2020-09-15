import { Component, Input, OnInit } from '@angular/core';
import { Traits } from 'src/app/model/character/traits'

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.less','../sheet.component.less']
})
export class TraitsComponent implements OnInit {

  @Input() traits: Traits

  constructor() { }

  ngOnInit(): void {
  }

}
