interface SkillsData {
  [propName: string]: number;
}

export class Skills {

  protected _data: SkillsData;
 
  constructor(data?: SkillsData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): SkillsData {
    this._data = {};
    return this._data;
  }

}