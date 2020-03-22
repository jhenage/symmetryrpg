import { Character } from '../character'
export interface ActionData {
  time: number;
  character?: number;
}

export class Actions {
  protected _data: ActionData[];
  character: Character;

  constructor(character: Character,data?: ActionData[]) {
    this.character = character;
    if (data) {
      this._data = data;
    }
  }

  initialize(): ActionData[] {
    this._data = [];
    return this._data;
  }

  add(data: ActionData): void {
    data.character = this.character.id;
    this._data.push(data);
  }

  nextActions(time:number): ActionData[] {
    let actions = this.allNextActions(time);
    if ( actions.length == 0 ) return actions;

    let current = actions[0].time;
    return actions.filter((action)=>{ return action.time == current; });
  }

  allNextActions(time:number): ActionData[] {
    return this._data.filter((action)=>{ return action.time >= time; });
  }

 }
