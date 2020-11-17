import { Component, Input, OnInit } from '@angular/core';
import { Spells } from 'src/app/model/character/spells';

@Component({
  selector: 'app-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.less','../sheet.component.less']
})
export class SpellsComponent implements OnInit {

  @Input() spells: Spells
  alphabetized: boolean

  constructor() { }

  ngOnInit(): void {
  }

  getSpellList(): string[] {
    let result = this.spells.character.campaign.getSpellList();
    if(this.alphabetized) result.sort();
    return result;
  }

  getDisplayName(spellKey: string): string {
    let result =  spellKey.replace(/(?<=[^\-\_A-Z])[A-Z][^A-Z]/g, function (x) { // insert spaces into lowerCamelCase variable names
      return " "+x;
    });
    result = result.replace(/_/g,"-"); // convert underscores to dashes
    result = result.replace(/(?<=[-])[a-z]/g, function(x) { // capitalize the first letter of each word after a dash
      return x.toUpperCase();
    });
    ["Of","To","All"].forEach((word) => { // uncapitalize special words
      var pattern = new RegExp("(?<=[ \-])(?=" + word + "[ \-])" + word, "g");
      result = result.replace(pattern,function(x) { 
        return x.toLowerCase();
      });
    });
    result = result.substring(0,1).toUpperCase() + result.substring(1); // capitalize first letter
    return result;
  }

  isUnlocked(spellName: string): boolean {
    return this.spells.isUnlocked(spellName);
  }

  isDisabled(spellName: string): string {
    return this.spells.isAvailable(spellName) ? null : "";
  }

  isUnknown(spellName:string): boolean {
    return !this.spells.hasSpell(spellName);
  }

  getDescription(spellName: string): string {
    return this.spells.character.campaign.getSpellDetails(spellName).description;
  }

}
