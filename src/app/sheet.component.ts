import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Character } from './model/character';

@Component({
  selector: 'app-sheet',
  templateUrl: 'sheet.component.html',
  styleUrls: ['sheet.component.less']
})

export class SheetComponent {//implements OnInit, OnDestroy {

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