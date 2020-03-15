interface SpecialtiesData {
  [propName: string]: number;
}

export class Specialties {

  protected _data: SpecialtiesData;
 
  constructor(data?: SpecialtiesData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): SpecialtiesData {
    this._data = {};
    return this._data;
  }

}