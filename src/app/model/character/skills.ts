interface SkillsData {
  actor: number;
  artist: number;
  athlete: number;
  crafter: number;
  diplomat: number;
  engineer: number;
  fighter: number;
  investigator: number;
  linguist: number;
  mage: number;
  medic: number;
  musician: number;
  pilot: number;
  scholar: number;
  sharpshooter: number;
  sneak: number;
  stylist: number;
  survivalist: number;
}

export class Skills {

  protected _data: SkillsData;
 
  constructor(data?: SkillsData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): SkillsData {
    this._data = {
      actor: 0,
      artist: 0,
      athlete: 0,
      crafter: 0,
      diplomat: 0,
      engineer: 0,
      fighter: 0,
      investigator: 0,
      linguist: 0,
      mage: 0,
      medic: 0,
      musician: 0,
      pilot: 0,
      scholar: 0,
      sharpshooter: 0,
      sneak: 0,
      stylist: 0,
      survivalist: 0
    };
    return this._data;
  }

}