import { Component, OnInit } from '@angular/core';
import { Character } from './model/character';
import { CreatureType } from './model/creaturetype';
import { Campaign } from './model/campaign';
import { DataService } from './data.service';
import { LogService } from './log/log.service';
import { Scene } from './model/scene';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent  {
  character: Character; // the selected character
  campaign: Campaign;
  scene: Scene;
  creaturetypes: CreatureType[];
  mode: string; // sheet | status | map

  constructor(private dataService: DataService, private logService: LogService) {
  }

  ngOnInit() {
    this.mode = 'sheet';
    this.campaign = this.dataService.campaign;
    this.scene = this.campaign.activeScene;
    //this.campaign.now = 0; // For Debugging

    this.scene.characters.forEach((character) => {
      //character.resetAll(); // For Debugging
      this.logService.import(character);
    });
  }

  save():void {
    for ( let char of this.scene.characters ) {
      this.dataService.saveCharacter(char);
    }
    this.dataService.saveCampaign();
  }

  delete(character: Character): void {
    this.scene.deleteCharacter(character);
    this.dataService.deleteCharacter(character);
    this.dataService.saveCampaign();
  }

  newChar():void {
    this.character = this.scene.newCharacter();
    this.mode = 'sheet';
  }

  select(character: Character) {
    this.character = character;
  }

}
