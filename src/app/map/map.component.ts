import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Character } from '../model/character';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.less']
})

export class MapComponent { //implements OnInit, OnDestroy {

 
  save() {
    //this.saved.emit();
  }

  delete() {
    //this.deleted.emit(this.character);
  }

}