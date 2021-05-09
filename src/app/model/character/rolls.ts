import { Character } from '../character'
export interface RollData {
  dice?: number[];
  modifier: ModifierData;
  testDescription?: string;
  resultDescription?: string;
  opposed?: {
    character: number;
    modifier: ModifierData;
  }
  time: number;
}

export interface ModifierData {
  ability: {
    aspect: string;
    skill?: string;
    specialties?: string[];
  };
  body?: string[]; // body part list
  circumstance?: {
    qi?: number;
  }
}

export class RollObject {
  character: Character;
  data: RollData;
  
  constructor(character: Character,data?: RollData) {
    this.character = character;
    if (data) {
      data.dice = data.dice || [];
      data.modifier.body = data.modifier.body || [];
      data.modifier.circumstance = data.modifier.circumstance || {};
      
      this.data = data;
    }
  }

  get opponent(): Character {
    return this.data.opposed ? this.character.scene.getCharacter(this.data.opposed.character) : null;
  }
}

export class Rolls {
  protected _data: RollData[];
  character: Character;

  constructor(character: Character,data?: RollData[]) {
    this.character = character;
    if (data) {
      this._data = data;
    }
  }

  initialize(): RollData[] {
    this._data = [];
    return this._data;
  }

  add(data: RollData): RollObject {
    this._data.push(data);
    return new RollObject(this.character,data);
  }

  remove(data: RollData): void {
    let i = this._data.indexOf(data);
    if ( i > -1 ) {
      this._data.splice(i,1);
    }
  }

  getAll() { return this._data; }


 }
