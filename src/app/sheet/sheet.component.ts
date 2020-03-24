import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Character } from '../model/character';

@Component({
  selector: 'app-sheet',
  templateUrl: 'sheet.component.html',
  styleUrls: ['sheet.component.less']
})

export class SheetComponent {

  @Input() character: Character;
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  save() {
    this.saved.emit();
  }

  delete() {
    this.deleted.emit(this.character);
  }
  
}