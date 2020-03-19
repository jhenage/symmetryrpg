import { Injectable } from '@angular/core';
import { Campaign } from './model/campaign';
import { Character } from './model/character';

// This is in charge of saving and retrieving storage
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getCampaign() {
    return this.parse(localStorage.getItem('campaign'));
  }

  saveCampaign(campaign: Campaign) {
    localStorage.setItem('campaign',campaign.serialize());
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
