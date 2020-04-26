import { Injectable } from '@angular/core';
import { Campaign, CampaignData } from './model/campaign';
import { Character } from './model/character';

// This is in charge of saving and retrieving storage
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _campaignblank: CampaignData = {
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
      height: { average: 1.692, stddev: 0.127 },
      weight: {
        frameSizeFactor: { average: 1, stddev: 0.05 },
        boneFrameFactor: { minimum: 1.5, average: 2.5, stddev: 0.5 },
        boneToughnessFactor: { minimum: 0, average: 0.6, stddev: 0.2 },
        organWeightFactor: 5.6,
        muscleBrawnFactor: { minimum: NaN, average: 9, stddev: 1 },
        muscleBulkFactor: { minimum: 0.6, average: 1, stddev: 0.09 },
        fatMassFactor: { minimum: 0.4, average: 5, stddev: 10 }
      }
    }]
  };
  constructor() { }

  private _campaign: Campaign;
  get campaign() {
    if(typeof this._campaign === "undefined") {
      let data = this.parse(localStorage.getItem('campaign'));
      if(data) {
        data.creatureTypes = this._campaignblank.creatureTypes; // For Debugging
        this._campaign = new Campaign(data,(id,version)=>this.getCharacter(id,version));
      }
      else {
        this._campaign = new Campaign(this._campaignblank, (id,version)=>this.getCharacter(id,version));
  
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
