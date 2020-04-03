import { Injectable } from '@angular/core';
import { Campaign } from './model/campaign';
import { Character } from './model/character';

// This is in charge of saving and retrieving storage
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private _campaign: Campaign;
  get campaign() {
    if(typeof this._campaign === "undefined") {
      let data = this.parse(localStorage.getItem('campaign'));
      if(data) {
        this._campaign = new Campaign(data,(id,version)=>this.getCharacter(id,version));
      }
      else {
        this._campaign = new Campaign({
          characters: [],
          allCharacters: [],
          now: 0,
          creatureTypes: [{
            name: 'Human',
            limbs: {
              leftArm:  { dexterity: 5, locomotion: 0.05, muscleSize: 2, reach: 0.375 },
              rightArm: { dexterity: 5, locomotion: 0.05, muscleSize: 2, reach: 0.375 },
              leftLeg:  { dexterity: 1, locomotion: 0.85, muscleSize: 3, reach: 0.5 },
              rightLeg: { dexterity: 1, locomotion: 0.85, muscleSize: 3, reach: 0.5 },
            },
            height: { average: 1.7, stddev: 0.1 },
            bodyTypes: [
              {label: 'Extremely Thin', amount: 0.5},
              {label: 'Thin', amount: 0.75},
              {label: 'Average', amount: 1},
              {label: 'Stout', amount: 1.5},
              {label: 'Very Large', amount: 2},
              {label: 'Extremely Large', amount: 3}
            ],
            weight: { bmiOffset: 7, btFactor: 15, multiplier: 1 },
          }]
        }, (id,version)=>this.getCharacter(id,version));
  
      }
    }
    return this._campaign;
  }

  saveCampaign() {
    localStorage.setItem('campaign',this._campaign.serialize());
  }

  getCharacter(id:number,version:number) {
    return this.parse(localStorage.getItem('character_'+id+'_'+version));
  }

  saveCharacter(character: Character) {
    localStorage.setItem('character_'+character.id+'_'+character.createdAt,character.serialize());
  }

  deleteCharacter(character: Character) {
    localStorage.removeItem('character_'+character.id+'_'+character.createdAt);
  }

  parse(data) {
    if ( data ) {
      return JSON.parse(data);
    }
    return false;
  }
}
