import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef, AfterViewInit } from '@angular/core';
import { Character } from '../model/character';
import { Campaign } from '../model/campaign';
import { LogService } from '../log/log.service';
import { MoveActionFactory, MoveActionObject } from '../log/action/move/action';
import { DataService } from '../data.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.less']
})

export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() character: Character;
  @Output() saved = new EventEmitter();
  @Output() selected = new EventEmitter();
  private canvas: HTMLCanvasElement;

  campaign: Campaign;
  openMenu: boolean; // token main menu
  openMenuSelect: string; // the selected item in token menu
  scale: number; // pixels per meter
  mouseMode: string; // when mouse movement is special, like during a move
  offsetX: number;  // distance of top left of tabletop to the center
  offsetY: number;
  movements: MoveActionObject[]; 

  constructor(private elementRef: ElementRef, private logService: LogService, private dataService: DataService) {}
 
  ngOnInit() {
    this.campaign = this.dataService.campaign;
    this.openMenu = true;
    this.scale = 50;
    this.mouseMode = '';
    this.offsetX = screen.availWidth * 1.5;
    this.offsetY = screen.availHeight * 1.5;

    if ( !this.character ) {
      this.character = this.campaign.characters[0];
    }

    this.movements = this.logService.movements;
  }

  ngOnDestroy() {
    // remove custom event listeners
  }

  ngAfterViewInit() {
    if ( !this.canvas ) {
      this.canvas = <HTMLCanvasElement>this.elementRef.nativeElement.querySelector('canvas');
    }
    //console.log(this.canvas); return;
    this.canvas.parentElement.style.height = document.querySelector('.logPane').clientHeight - this.canvas.offsetTop*2 + 'px';
    //this.canvas.parentElement.style.width = screen.availWidth - this.canvas.offsetLeft + 'px';
    
    this.canvas.style.height = screen.availHeight*3 +'px';
    this.canvas.style.width = screen.availWidth*3 +'px';
    this.offsetX = screen.availWidth * 1.5;
    this.offsetY = screen.availHeight * 1.5;
    let scrollX = this.offsetX - this.canvas.parentElement.clientWidth / 2;
    let scrollY = this.offsetY - this.canvas.parentElement.clientHeight / 2;
    this.canvas.parentElement.scrollTo(scrollX,scrollY);
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
  }

  openMenuSelectReposition() {
    if(this.logService.timer.time == this.logService.now) {
     this.openMenuSelect = 'reposition';
     this.mouseMode = 'reposition';
    }
    this.openMenu = false;
    //this.canvas.nativeElement
  }

  placeReposition() {
    const repo = this.elementRef.nativeElement.querySelector('#reposition');
    let x = (repo.offsetLeft - this.offsetX) / this.scale + .5;
    let y = (repo.offsetTop - this.offsetY) / this.scale + .5;
    let time = this.logService.timer.time;

    if ( this.mouseMode == 'reposition' ) {
      this.character.setLocation({time:time,x:x,y:y});      
    }
    else if ( this.mouseMode == 'move' ) {
      let mymoves = this.movements.filter((move)=>{return move.character == this.character;});
      if(mymoves.length) {
        mymoves[0].data.path.push({x:x,y:y,speed:0.5});
      } else {
        let factory = new MoveActionFactory();
        let action = factory.build(this.character,{time:time,path:[{x:x,y:y,speed:0.5}]});
        this.logService.newAction(action);
        this.movements.push(action);
      }
      
    }

    this.mouseMode = '';
    this.save();
  }

  onMouseMove(event: MouseEvent) {
    if ( ! this.mouseMode ) { return; }

    if ( this.mouseMode == 'reposition' || this.mouseMode == 'move' ) {
      if(event.offsetX == 0 || event.offsetY == 0) console.log(event);
      let repo = this.elementRef.nativeElement.querySelector('#reposition');
      let viewer = this.canvas.parentElement;
      repo.style.left = event.clientX + viewer.scrollLeft - viewer.offsetLeft - this.scale/2 + 'px';
      repo.style.top = event.clientY + viewer.scrollTop - viewer.offsetTop - this.scale/2 + 'px';
      
    }
    
  }

  openMenuSelectMove() {
    if(this.logService.timer.time >= this.logService.now) {
      this.openMenuSelect = 'move';
      this.mouseMode = 'move';
    }
    this.openMenu = false;
  }

  deleteMove(action: MoveActionObject) {
    if(action.data.executed) {
      return;
    }
    action.data.path.pop();
    if(action.data.path.length==0) {
      this.logService.removeAction(action);
      action.character.actions.remove(action.data);
      this.movements.splice(this.movements.indexOf(action),1);
    }
  }

  locationX(character: Character,time?:number): number {
    time = time || this.logService.timer.time;
    return (character.location(time).x - .5) * this.scale + this.offsetX;
  }
  locationY(character: Character,time?:number): number {
    time = time || this.logService.timer.time;
    return (character.location(time).y - .5) * this.scale + this.offsetY;
  }


}