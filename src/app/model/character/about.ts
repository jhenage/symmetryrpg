import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
import { FrameDimension } from '../creaturetype';
export interface AboutData {
  name: string;
  height: ModifiableStat; // in meters, retrievable as symmetric via function call
  age: number;
  frameSize: number; // symmetric
  muscleBulk: number; // symmetric
  bodyFat: number; // symmetric
  token: {
    url: string;
  }
  potentialRating: number;
  descriptions: {
    origin: string;
    achievements: string;
    failures: string;
    relationships: string;
    goals: string;
    ethics: string;
    occupation: string;
    obligations: string;
    strengths: string;
    weaknesses: string;
    blessings: string;
    trials: string;
    fears: string;
    appearance: string;
    notes: string;
  }
}

export class About {
  protected _data: AboutData;
  character: Character;

  constructor(character: Character,data?: AboutData) {
    this.character = character;
    if (data) {
      this._data = data;
    }
  }

  initialize(): AboutData {
    this._data = {
      name: "",
      height: {amount:1.7},
      age: 18,
      frameSize: 0,
      muscleBulk: 0,
      bodyFat: 0,
      token: {url:""},
      potentialRating: 0,
      descriptions: { 
        origin: "",
        achievements: "",
        failures: "",
        relationships: "",
        goals: "",
        ethics: "",
        occupation: "",
        obligations: "",
        strengths: "",
        weaknesses: "",
        blessings: "",
        trials: "",
        fears: "",
        appearance: "",
        notes: ""
      } 
    };
    return this._data;
  }

  get name(): string {
    return this._data.name;
  }

  set name(newName: string) {
    this._data.name = newName;
  }

  // returns 5'6" instead of meters
  get height(): string {
    return Math.floor(this.heightInch() / 12) + '\'' + Math.round(this.heightInch() % 12) + '"';
  }

  // expects like 5'6" and saves it in meters
  set height(newHeight:string) {
    let regex = /^(\d+)'(\d+)"/;
    let res = regex.exec(newHeight);
    if (res) {
      this._data.height.amount = (Number(res[1]) * 12 + Number(res[2])) * 2.54 / 100;
    }
  }

  get potentialRating(): number {
    return this._data.potentialRating;
  }

  set potentialRating(pr: number) {
    this._data.potentialRating = pr;
  }

  heightMeter(time?: number): number {
    if ( typeof time === "undefined" ) {
      return this._data.height.amount;
    }
    return ModifiedValue(time,this._data.height);
  }

  heightInch(time?: number): number {
    return this.heightMeter(time) / 0.0254;
  }

  heightSymmetric(time?: number): number {
    return (this.heightMeter(time) - this.character.creatureType.height.average) / this.character.creatureType.height.stddev;
  }

  setHeight(time:number,height:string) {
    let regex = /^(\d+)'(\d+)"/;
    let res = regex.exec(height);
    if (res) {
      ChangeModifiedValue(time,this._data.height,(Number(res[1]) * 12 + Number(res[2])) * 0.0254);
    }
 }
  getHeight(time:number): string {
    return Math.floor(this.heightInch(time) / 12) + '\'' + Math.round(this.heightInch(time) % 12) + '"';
  }

  getGrowthFactor(time?:number): number {
    return this.heightMeter(time)/this._data.height.amount;
  }

  getFrameDimensionMeter(fd:FrameDimension): number {
    let result = fd.average + fd.frameStddev * this.frameSize;
    return result + fd.fatStddev * Math.max(fd.minFatStddev,this.bodyFat);
  }

  widthMeter(time?:number): number {
    let baseWidth = this.getFrameDimensionMeter(this.character.creatureType.width);
    return baseWidth * this.getGrowthFactor(time);
  }

  depthMeter(time?:number): number {
    let baseDepth = this.getFrameDimensionMeter(this.character.creatureType.depth);
    return baseDepth * this.getGrowthFactor(time);
  }

  get improvementPoints(): number {
    return this._data.potentialRating - this.character.getSpentIPTotal();
  }

  get age(): number {
    return this._data.age;
  }

  set age(age) {
    this._data.age = Number(age) || 18;
  }

  get frameSize(): number {
    return this._data.frameSize;
  }

  set frameSize(fs: number) {
    this._data.frameSize = Math.min(7,Math.max(-7,fs));
  }

  get frameSizeProbabilityDescription(): string {
    let result = " (" + this.character.getBasicProbabilityDescription(this.frameSize) + ")";
    if(this.frameSize < 0) return "Small" + result;
    else if(this.frameSize > 0) return "Large" + result;
    return "Average" + result;
  }

  get muscleBulk(): number {
    return this._data.muscleBulk;
  }

  set muscleBulk(mb: number) {
    this._data.muscleBulk = Math.min(7,Math.max(-7,mb));
  }

  get muscleBulkProbabilityDescription(): string {
    let result = " (" + this.character.getBasicProbabilityDescription(this.muscleBulk) + ")";
    if(this.muscleBulk < 0) return "Low" + result;
    else if(this.muscleBulk > 0) return "High" + result;
    return "Average" + result;
  }

  get bodyFat(): number {
    return this._data.bodyFat;
  }

  set bodyFat(bf: number) {
    this._data.bodyFat = Math.min(7,Math.max(-7,bf));
  }

  get bodyFatProbabilityDescription(): string {
    let result = " (" +  this.character.getBasicProbabilityDescription(this.bodyFat) + ")";
    if(this.bodyFat < 0) return "Low" + result;
    else if(this.bodyFat > 0) return "High" + result;
    return "Average" + result;
  }

  get descriptionsList(): string[] {
    return Object.keys(this._data.descriptions);
  }

  getDescriptionText(descriptionName: string): string {
    return this._data.descriptions[descriptionName];
  }

  setDescriptionText(descriptionName: string, newText: string) {
    this._data.descriptions[descriptionName] = newText;
  }

  get url(): string {
    return this._data.token.url;
  }

  set url(val: string) {
    this._data.token.url = val;
  }

  physicalEccentricity(time?: number): number {
    let result = this.symmetricEccentricity(this.heightSymmetric(time));
    result += this.symmetricEccentricity(this.frameSize);
    result += this.symmetricEccentricity(this.muscleBulk);
    result += this.symmetricEccentricity(this.bodyFat);
    return result / 4;
  }

  symmetricEccentricity(symmetric: number): number {
    return Math.max(0,Math.abs(symmetric) - 0.8);
  }


}
