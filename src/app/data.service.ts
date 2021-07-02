import { Injectable } from '@angular/core';
import { Campaign } from './model/campaign';
import { Character } from './model/character';
import { blankcampaign } from './data/blankcampaign';

// This is in charge of saving and retrieving storage

//  All game data is contained within a campaign object
//  The campaign contains world data and a list of scenes
//  Each scene has a roster of characters
//  Each character has its actions, rolls, and various stats over time
//  Characters are cloned into new scenes

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
        data.species = blankcampaign.species; // For Debugging
        data.commonSpecialties = blankcampaign.commonSpecialties; // For Debugging
        this._campaign = new Campaign(data,(id,scene)=>this.getCharacter(id,scene));
      }
      else {
        this._campaign = new Campaign(blankcampaign, (id,scene)=>this.getCharacter(id,scene));
  
      }
    }
    return this._campaign;
  }

  saveCampaign() {
    localStorage.setItem('campaign',this._campaign.serialize());
  }

  getCharacter(id:number,scene:number) {
    return this.parse(localStorage.getItem('character_'+id+'_'+scene));
  }

  saveCharacter(character: Character) {
    localStorage.setItem('character_'+character.id+'_'+character.scene.id,character.serialize());
  }

  deleteCharacter(character: Character) {
    localStorage.removeItem('character_'+character.id+'_'+character.scene.id);
  }

  parse(data) {
    if ( data ) {
      return JSON.parse(data);
    }
    return false;
  }
}
