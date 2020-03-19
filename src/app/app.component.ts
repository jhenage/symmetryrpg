import { Component, OnInit } from '@angular/core';
import { Character } from './model/character';
import { CreatureType } from './model/creaturetype';
import { Campaign } from './model/campaign';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent  {
  character: Character; // the selected character
  campaign: Campaign;
  chars: Character[];
  creaturetypes: CreatureType[];

  constructor() {
  }

  ngOnInit() {
    if(localStorage.getItem('campaign')) {
      this.campaign = new Campaign(JSON.parse(localStorage.getItem('campaign')));
    }
    else {
      this.campaign = new Campaign({
        characters: [],
        archivedCharacters: [],
        now: 0,
        creatureTypes: [{
          name: 'Human',
          limbs: {
            leftArm:  { dexterity: 5, locomotion: 1, muscleSize: 2, reach: 0.374 },
            rightArm: { dexterity: 5, locomotion: 1, muscleSize: 2, reach: 0.374 },
            leftLeg:  { dexterity: 1, locomotion: 5, muscleSize: 3, reach: 0.48 },
            rightLeg: { dexterity: 1, locomotion: 5, muscleSize: 3, reach: 0.48 },
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
          weight: { bmiOffset: 11, btFactor: 10, multiplier: 1 },
        }]
      });

    }
  }

  save():void {
    for ( let char of this.campaign.characters ) {
      localStorage.setItem('character_'+char.id+'_'+char.createdAt,char.serialize());
    }
    localStorage.setItem('campaign',this.campaign.serialize());
  }

  delete(character: Character): void {
    this.campaign.deleteCharacter(character);
    this.save();
  }

  newChar():void {
    this.character = this.campaign.newCharacter();
  }

  select(character: Character) {
    this.character = character;

    //character.fatigue.AddAerobicRate(0,.1);
    //character.fatigue.AddAerobicRate(5000,-.1);
    //character.fatigue.AddAerobicRate(60000,.01);
    //character.fatigue.AddAerobicRate(120000,.01);
    //character.fatigue.AddAerobicRate(180000,.01);
    //character.fatigue.AddAerobicRate(240000,-.03);
    //character.fatigue.AddAerobicRate(60000*60,.01);
    //character.fatigue.AddAerobicRate(60000*61,-.01);
    //character.fatigue.AddAerobicRate(60000*60*3,.01);
    //character.fatigue.AddAerobicRate(60000*61*3,-.01);
    //character.fatigue.AddAerobicRate(60000*60*10,.01);
    //character.fatigue.AddMuscleRate(5000,-5,'mental');
    //character.fatigue.AddMuscleRate(60000,1,'mental');
    //character.fatigue.AddMuscleRate(120000,1,'mental');
    //character.fatigue.AddMuscleRate(180000,1,'mental');
    //character.fatigue.AddMuscleRate(240000,-3,'mental');
    //character.fatigue.AddMuscleRate(60000*60,1,'mental');
    //character.fatigue.AddMuscleRate(60000*61,-1,'mental');
    //character.fatigue.AddMuscleRate(60000*60*3,1,'mental');
    //character.fatigue.AddMuscleRate(60000*61*3,-1,'mental');
    //character.fatigue.AddMuscleRate(60000*60*10,1,'mental');
    //console.log(character.fatigue);
    //console.log(character.fatigue.Penalty('aerobic',60000*61*3));
  }

}
