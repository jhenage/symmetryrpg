import { Character, ModifiableStat, ModifiedValue, ChangeModifiedValue } from '../character'
export interface AboutData {
  name: string;
  height: ModifiableStat; // in meters (100in/254cm)(100cm/1m)
  age: number;
  bodyType: ModifiableStat; // between 0 and 10, descriptive label from creatureType
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
      bodyType: {amount:1},
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
    return Math.floor(this.HeightInch() / 12) + '\'' + Math.round(this.HeightInch() % 12) + '"';
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

  HeightMeter(time?: number): number {
    if ( typeof time === undefined ) {
      return this._data.height.amount;
    }
    return ModifiedValue(time,this._data.height);
  }

  HeightInch(time?: number): number {
    if ( typeof time === undefined ) {
      return this._data.height.amount * 100 / 2.54;
    }
    return ModifiedValue(time,this._data.height) * 100 / 2.54;
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

  get bodyType(): number {
    return this._data.bodyType.amount;
  }

  set bodyType(bt) {
    this._data.bodyType.amount = Number(bt) || 1;
  }

  CurrentBodyType(time:number): number {
    return ModifiedValue(time,this._data.bodyType);
  }

  AlterBodyType(time:number,amount:number) {
    ChangeModifiedValue(time,this._data.bodyType,amount);
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


}
