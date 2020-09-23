import { Component, ViewChild, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { About } from 'src/app/model/character/about';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less', '../sheet.component.less']
})
export class AboutComponent implements OnInit, OnChanges {

  @Input() about: About;
  @Input() brawn: number;
  @ViewChild('portrait', { static: true }) 
  portrait: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  readonly CANVAS_SIZE = 300;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.portrait.nativeElement.getContext('2d');
  }

  ngOnChanges(): void {
    if(this.ctx) {
      this.drawPortrait();
    }
  }

  log(evt: any) {
    console.log(evt);
  }

  get frameSize(): number {
    return this.about.frameSize;
  }

  set frameSize(newValue: number) {
    this.about.frameSize = newValue;
    this.drawPortrait();
  }

  get muscleBulk(): number {
    return this.about.muscleBulk;
  }

  set muscleBulk(newValue: number) {
    this.about.muscleBulk = newValue;
    this.drawPortrait();
  }

  get bodyFat(): number {
    return this.about.bodyFat;
  }

  set bodyFat(newValue: number) {
    this.about.bodyFat = newValue;
    this.drawPortrait();
  }

  get weightLbs(): string {
    return this.about.character.WeightLbs(this.about.character.campaign.now).toFixed(0);
  }

  get endurance(): string {
    return this.about.character.Endurance(this.about.character.campaign.now).toFixed(2);
  }

  get physicalEccentricity(): string {
    return this.about.physicalEccentricity(this.about.character.campaign.now).toFixed(2);
  }

  get physicalDefense(): string {
    return this.about.character.PhysicalDefense(this.about.character.campaign.now).toFixed(2);
  }

  get magicalDefense(): string {
    return this.about.character.MagicalDefense(this.about.character.campaign.now).toFixed(2);
  }

  get maxQi(): string {
    return this.about.character.MaxQi(this.about.character.campaign.now).toFixed(0);
  }

  drawPortrait(): void {
    this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
    let c = Math.round(this.CANVAS_SIZE / 2); // horizontal center
    let h = Math.round(this.CANVAS_SIZE / 11); // head height, used for proportions
    let so = 0.35 + (7+this.frameSize)**1.8/90; // shoulder offset, 0.35 - 1.65, avg = 0.72
    let mb = 0.01 * (15 + (Math.abs(this.muscleBulk) + 3 * this.muscleBulk)); // muscle bulk
    mb *= Math.min(1.75,(7+this.about.character.aspects.getAspectRank("brawn"))**1.5/30); // 0 - 7.525, avg = 0.09
    let bf = 0.01 + (7+this.bodyFat)**3/1000; // body fat, 0.01 - 2.75, avg = 0.35
    let offsets = [
      [0,0.9],[0.4,1],[0.4,1.6],[0.3,2],[0.15+0.05*bf,2], // head
      [0.15+0.1*mb+0.08*bf,Math.max(2,2.5-0.8*mb-0.05*bf)],[so,2.5-0.3*mb-0.07*bf], // neck to shoulder
      [so+0.5,2.5-Math.max(0.08*bf,mb+0.05*bf)],[so+1,2.5-Math.max(0.08*bf,mb+0.05*bf)],[so+1.5,2.5-0.07*bf], // bicep
      [so+1.8,2.5-Math.max(0.08*bf,0.5*mb+0.05*bf)],[so+2.2,2.5-Math.max(0.08*bf,0.5*mb+0.05*bf)],[so+3,2.5-0.02*bf], // forearm top
      [so+3,2],[so+3.2,2.1],[so+3.2,2.4],[so+3.8,2.3],[so+3.9,2.5],[so+3.8,2.9],[so+3,2.8], // hand
      [so+3,2.8+0.02*bf],[so+2.2,2.8+Math.max(0.08*bf,0.5*mb+0.05*bf)],[so+1.8,2.8+Math.max(0.08*bf,0.5*mb+0.05*bf)], // forearm bottom
      [so+1.5,2.8+0.07*bf],[so+1,2.8+Math.max(0.08*bf,mb+0.05*bf)],[so+0.5+0.1*bf,2.8+Math.max(0.08*bf,mb+0.05*bf)],[so+0.3*bf,3+0.3*mb+0.05*bf], // tricep
      [0.8*so+0.7*bf,3.3],[0.1+0.2*so+1.4*bf,4+0.2*bf],[0.1+0.2*so+1.5*bf,4.2+0.4*bf], // torso
      [0.3+1.45*bf,4.5+0.45*bf],[0.25+1.25*bf+1.8*mb,5.3+0.3*bf],[0.3+1.1*bf+1.8*mb,5.6+0.3*bf],[0.5+0.7*bf+0.5*mb,6+0.4*bf],[0.4+0.4*bf,6.6+0.3*bf], // thigh
      [0.4+0.4*mb+0.3*bf,7.4],[0.4+0.4*mb+0.3*bf,7.6],[0.3+0.3*bf,8.5], // calf
      [0.6+0.1*bf,9],[0,9] // foot
    ];
    let vShift = 0.5;
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(c + h * offsets[0][0], h * (offsets[0][1]+vShift));
    for(let i=1; i<offsets.length; i++) this.ctx.lineTo(c + h * offsets[i][0], h * (offsets[i][1]+vShift));
    this.ctx.stroke();
    this.ctx.moveTo(c - h * offsets[0][0], h * (offsets[0][1]+vShift));
    for(let i=1; i<offsets.length; i++) this.ctx.lineTo(c - h * offsets[i][0], h * (offsets[i][1]+vShift));
    this.ctx.lineTo(c,h*5.3);
    this.ctx.stroke();
  }

}
