import { Character } from '../character'
export interface WoundData {
  bleed: {
    time: number;
    bloodLoss: number; // 0-49 only fatigue, 50-99 penalties, at 100 organs shut down 
    bleedRate: number; // bloodLoss per second
  }[];
  wounds: {
    [propName: string]: { // Location (e.g. leftArm,head,torso)
      initial: { // the initial wound object
        time: number;
        impact: number;
        cutting: number;
        elemental: number;
      };
      recovery: { // actions taken toward recover, and results

      };
    }[]    
  }

}

export class Wounds {

  protected _data: WoundData;
  character: Character;
 
  constructor(character: Character,data?: WoundData) {
    this.character = character;
    if(data) {
      this._data = data;
    }
  }

  initialize(): WoundData {
    this._data = {bleed:[],wounds:{}};
    return this._data;
  }

  Penalty(location: string, time: number): number {
    return 0;
  }

}