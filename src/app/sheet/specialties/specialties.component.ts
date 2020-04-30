import { Component, Input, OnInit } from '@angular/core';
import { Specialties } from 'src/app/model/character/specialties';

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.less','../sheet.component.less']
})
export class SpecialtiesComponent implements OnInit {

  @Input() specialties: Specialties
  readonly MINIMUM_VALUE = 0;
  readonly MAXIMUM_VALUE = 3;
  
  constructor() { }

  ngOnInit(): void {
  }

  setSpecialtyRank(specialtyName: string, newRank: number) {
    newRank = Math.min(this.MAXIMUM_VALUE,Math.max(this.MINIMUM_VALUE,Math.round(newRank)));
    this.specialties.setSpecialtyRank(specialtyName,newRank);
  }

}
