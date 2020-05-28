import { Component, Input, OnInit } from '@angular/core';
import { Specialties } from 'src/app/model/character/specialties';
import { DataService } from 'src/app/data.service'

@Component({
  selector: 'app-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.less','../sheet.component.less']
})
export class SpecialtiesComponent implements OnInit {

  @Input() specialties: Specialties
  readonly MINIMUM_VALUE = 0;
  readonly MAXIMUM_VALUE = 3;
  readonly ROWS_PER_COLUMN = 10;
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  setSpecialtyRank(specialtyName: string, newRank: number) {
    newRank = Math.min(this.MAXIMUM_VALUE,Math.max(this.MINIMUM_VALUE,Math.round(newRank)));
    this.specialties.setSpecialtyRank(specialtyName,newRank);
  }

  getMultiCategoryFlag(specialty:string): string {
    return this.specialties.isMultiCategory(specialty) ? "*" : "";
  }

  getSpecialtiesGrid(): string[][] {
    let result = []
    let specialties = this.specialties.getSpecialtiesList();
    let row = 0;
    let column = 0;
    for(let i=0; i<specialties.length; i++) {
      result[column][row] = specialties[i];
      row++
      if(row >= this.ROWS_PER_COLUMN) {
        row = 0;
        column++;
      } else {
        row++;
      } 
    }
    return result;
  }

  getDisplayName(specialtyKey: string): string {
    return specialtyKey.replace(/(?<=[^-])[A-Z]/g, function (x) {
      return " "+x;
    });
  }

}
