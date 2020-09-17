import { Component, Input, OnInit } from '@angular/core';
import { LogService } from 'src/app/log/log.service';
import { Equipment } from 'src/app/model/character/equipment';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less','../sheet.component.less']
})
export class EquipmentComponent implements OnInit {

  @Input() equipment: Equipment

  constructor(private logService: LogService) { }

  ngOnInit(): void {
  }

  displayCurrency(value: number): string {
    let cutoff = value < 0 ? 8 : 7; // string length limit
    let result = value.toFixed(2);
    if(result.length < cutoff) return "$" + result;
    let idx = result.length - 3;
    let j = 0;
    let suffixes = ["K","M","B"];
    while( j < suffixes.length ) {
      result = result.slice(0,idx);
      idx = result.length - 3;
      if(result.length < cutoff) {
        result = result.slice(0,idx) + "." + result.slice(idx,Math.max(idx+1,3)) + suffixes[j];
        j = suffixes.length;
      }
      j++;
    }
    return "$" + result;
  }

  get incomeValue(): string {
    return this.displayCurrency(this.equipment.incomeValue);
  }

  get lifestyleValue(): string {
    return this.displayCurrency(this.equipment.lifestyleValue);
  }

}
