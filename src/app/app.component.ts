import { Component, OnInit } from '@angular/core';
import { Character } from './model/character';
import { CreatureType } from './model/creaturetype';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  character: Character;
  chars: Character[];
  creaturetypes: CreatureType[];

  constructor() {
    this.creaturetypes = [];
    this.creaturetypes.push(new CreatureType({
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
    }));
  }

  ngOnInit() {
    this.chars = [];
    if(localStorage.getItem('chars')) {
      let chars = JSON.parse(localStorage.getItem('chars'));
      for ( let char of chars ) {
        let character = JSON.parse(localStorage.getItem('character_'+char.id+'_'+char.version));
        let creaturetype = this.creaturetypes[character.creatureType];
        this.chars.push(new Character(char.id,creaturetype,character));
      }
    }

    if(this.chars.length) {
      console.log('huh');
     // this.chars[0].tap.AddTap(1,1);
     // console.log(this.chars[0].tap,this.chars[0].tap.Penalty(2));
    }
  }

  save() {
    let chars = [];
    for ( let char of this.chars ) {
      chars.push({id:char.id,version:char.createdAt});
      localStorage.setItem('character_'+char.id+'_'+char.createdAt,char.serialize());
    }
    localStorage.setItem('chars',JSON.stringify(chars));
  }

  delete(character) {
    let index = this.chars.indexOf(character);
    localStorage.removeItem('character_'+character.id+'_'+character.createdAt);
    this.chars.splice(index,1);
    this.save();
  }

  newChar() {
    this.character = new Character(this.chars.length,this.creaturetypes[0]);
    this.chars.push(this.character);
  }

  select(character: Character) {
    this.character = character;
  }

}
