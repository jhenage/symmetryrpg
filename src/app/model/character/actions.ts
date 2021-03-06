import { Character } from '../character'
export interface ActionData {
  type: string;
  time: number;
  body: ActionBodyPart[];
  rolls?: RollData[];
  nextExecution?: number; //next time this action needs to execute. Undefined when done.
  endTime?: number;
  order?: number; // order of execution
}

export interface ActionBodyPart {
  name:string; // name of body part
  effort:number; // 0-100. used to calculate fatigue amount
  exclusive?:boolean; // prevents limb from other actions
}

export interface RollData {
  dice: number[];
  time: number;
  modifier: {
    aspect: string;
    skill?: string;
    specialties?: string[];
    qi?: number;
  };
  testDescription?: string;
  resultDescription?: string;
  order?: number; // order in the roll log
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
    this._data.push(data);
  }

  remove(data: ActionData): void {
    let i = this._data.indexOf(data);
    if ( i > -1 ) {
      this._data.splice(i,1);
    }
  }

  getAll() { return this._data; }

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
