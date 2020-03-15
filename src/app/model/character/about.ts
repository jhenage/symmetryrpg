interface AboutData {
  name: string;
  height: number; // in meters (100in/254cm)(100cm/1m)
  age: number;
  bodyType: number; // weight multiplier, usually 0.5 to 2
  description: string;
  notes: string;
}

export class About {
  protected _data: AboutData;

  constructor(data?: AboutData) {
    if (data) {
      this._data = data;
    }
  }

  initialize(): AboutData {
    this._data = {
      name: "",
      height: 1.7,
      age: 18,
      bodyType: 1,
      description: "",
      notes: ""
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
      this._data.height = (Number(res[1]) * 12 + Number(res[2])) * 2.54 / 100;
    }
  }

  HeightMeter(): number {
    return this._data.height;
  }

  HeightInch(): number {
    return this._data.height * 100 / 2.54;
  }

  get age(): number {
    return this._data.age;
  }

  set age(age) {
    this._data.age = Number(age || 18);
  }

  get bodyType(): number {
    return this._data.bodyType;
  }

  set bodyType(bt) {
    this._data.bodyType = Number(bt || 1);
  }

  get description(): string {
    return this._data.description;
  }

  set description(description: string) {
    this._data.description = description;
  }

  get notes(): string {
    return this._data.notes;
  }

  set notes(notes: string) {
    this._data.name = notes;
  }
}
