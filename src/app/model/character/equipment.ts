interface EquipmentData {
  [propName: string]: {  // Location (e.g. leftArm,rightLeg,body)
    start: number; // when moved to this location
    end: number;   // when removed from this location. 0 or undefined means indefinitely
    item: number;  // item id
    status: string; // held (ready to use, limit 1), worn (gain armor), or carried (no bonuses but larger limit)
  }[]
}

export class Equipment {

  protected _data: EquipmentData;
 
  constructor(data?: EquipmentData) {
    if(data) {
      this._data = data;
    }
  }

  initialize(): EquipmentData {
    this._data = {};
    return this._data;
  }

  Weight(location: string): number {
    return 0;
  }

  AddItem(time: number, location: string, item: number): void {}
  RemoveItem(time: number, location: string, item: number): void {}
  MoveItem(time: number, location: string, item: number): void {}
}