import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Character } from '../model/character';
import { Campaign } from '../model/campaign';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.less']
})

export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() character: Character;
  @Input() campaign: Campaign;
  @Output() saved = new EventEmitter();
  @Output() selected = new EventEmitter();
  private canvas: ElementRef;

  openMenu: boolean; // token main menu
  openMenuSelect: string; // 
  scale: number; 
  mouseMode: string; // when mouse movement is special, like during a move
  offsetX: number;
  offsetY: number;

  constructor(private elementRef: ElementRef) {}
 
  ngOnInit() {
    this.openMenu = true;
    this.scale = 50;
    this.mouseMode = '';
    this.offsetX = screen.availWidth * 1.5;
    this.offsetY = screen.availHeight * 1.5;

    if ( !this.character ) {
      this.character = this.campaign.characters[0];
    }
  }

  ngOnDestroy() {
    // remove custom event listeners
  }

  ngAfterViewInit() {
    if ( !this.canvas ) {
      this.canvas = new ElementRef(this.elementRef.nativeElement.querySelector('canvas'));
    }
    //console.log(this.canvas); return;
    this.canvas.nativeElement.parentElement.style.height = document.querySelector('.logPane').clientHeight - this.canvas.nativeElement.offsetTop*2 + 'px';
    //this.canvas.nativeElement.parentElement.style.width = screen.availWidth - this.canvas.nativeElement.offsetLeft + 'px';
    
    this.canvas.nativeElement.style.height = screen.availHeight*3 +'px';
    this.canvas.nativeElement.style.width = screen.availWidth*3 +'px';
    this.offsetX = screen.availWidth * 1.5;
    this.offsetY = screen.availHeight * 1.5;
    let scrollX = this.offsetX - this.canvas.nativeElement.parentElement.clientWidth / 2;
    let scrollY = this.offsetY - this.canvas.nativeElement.parentElement.clientHeight / 2;
    this.canvas.nativeElement.parentElement.scrollTo(scrollX,scrollY);
  }

  save() {
    this.saved.emit();
  }

  select(character: Character) {
    if(this.character!=character) {
      this.selected.emit(character);
      this.openMenu = true;
    }
    else {
      this.openMenu = !this.openMenu;
    }
  }

  openMenuSelectEdit() {
    this.openMenuSelect = 'edit';
    console.log(this.canvas);
  }

  openMenuSelectReposition() {
    this.openMenuSelect = 'reposition';
    this.openMenu = false;
    this.mouseMode = 'reposition';
    //this.canvas.nativeElement
  }

  placeReposition() {
    const repo = this.elementRef.nativeElement.querySelector('#reposition');
    this.mouseMode = '';
    let x = (repo.offsetLeft - this.offsetX) / this.scale + .5;
    let y = (repo.offsetTop - this.offsetY) / this.scale + .5;
    this.character.setLocation({time:0,x:x,y:y});
  }

  onMouseMove(event: MouseEvent) {
    if ( ! this.mouseMode ) { return; }

    if ( this.mouseMode == 'reposition' ) {
      if(event.offsetX == 0 || event.offsetY == 0) console.log(event);
      let repo = this.elementRef.nativeElement.querySelector('#reposition');
      let viewer = this.canvas.nativeElement.parentElement;
      repo.style.left = event.clientX + viewer.scrollLeft - viewer.offsetLeft - this.scale/2 + 'px';
      repo.style.top = event.clientY + viewer.scrollTop - viewer.offsetTop - this.scale/2 + 'px';
      
    }
    
  }

  openMenuSelectMove() {
    this.openMenuSelect = 'move';
    this.mouseMode = 'move';
    this.openMenu = false;
  }

  locationX(character: Character,time?:number): number {
    time = time || 0; // should look at view timer instead
    return (character.location(time).x - .5) * this.scale + this.offsetX;
  }
  locationY(character: Character,time?:number): number {
    time = time || 0; // should look at view timer instead
    return (character.location(time).y - .5) * this.scale + this.offsetY;
  }


}