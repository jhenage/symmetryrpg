import { Component, Input, OnInit } from '@angular/core';
import { Specialties } from 'src/app/model/character/specialties';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.less','../sheet.component.less']
})
export class SpecialtiesComponent implements OnInit {

  @Input() specialties: Specialties
  
  constructor() { }

  ngOnInit(): void {
  }

}
