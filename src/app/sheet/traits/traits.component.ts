import { Component, Input, OnInit } from '@angular/core';
import { Traits } from 'src/app/model/character/traits'

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.less','../sheet.component.less']
})
export class TraitsComponent implements OnInit {

  @Input() traits: Traits

  constructor() { }

  ngOnInit(): void {
  }

  get traitTypes(): string[] {
    return this.traits.character.campaign.traitTypes;
  }

  getTraitList(traitType: string): string[] {
    return this.traits.character.campaign.getTraitList(traitType);
  }

  getDisplayName(traitKey: string): string {
    let result =  traitKey.replace(/(?<=[^\-\_A-Z])[A-Z][^A-Z]/g, function (x) { // insert spaces into lowerCamelCase variable names
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

  isUnknown(traitName:string): boolean {
    return !this.traits.hasTrait(traitName);
  }

  isDisabled(traitName:string): string {
    if(this.traits.isAvailable(traitName)) return null;
    if(this.isUnknown(traitName)) return "";
    return null;
  }

  getPassedRequirements(traitName: string): string[] {
    return this.formatReqs(this.traits.checkRequirements(traitName).passed);
  }

  getFailedRequirements(traitName: string): string[] {
    return this.formatReqs(this.traits.checkRequirements(traitName).failed);
  }

  formatReqString(reqString: string): string {
    reqString = reqString.replace(/_OR_/g,"--");
    reqString = this.getDisplayName(reqString);
    reqString = reqString.replace(/--/g," OR ");
    if(reqString.startsWith("ALL-CATEGORIES")) reqString = "1 Specialty in each Category";
    reqString = reqString.replace("ALL-BUT-LINGUIST","All Skills (except Linguist) at");
    reqString = reqString.replace("TOTAL-IP","Specialty IP Total");
    reqString = reqString.replace("FIVE-LANGUAGES","5 Language Specialties at rank");
    if(reqString == "ANY-2-PHILOSOPHY") reqString = "Any 2 Philosophy Traits";
    reqString = reqString.replace("NOT-","NO ");
    return reqString + ";";
  }

  formatReqs(reqs: string[]): string[] {
    if(reqs.length == 0) return [];
    for(let i=0; i< reqs.length; i++) {
      reqs[i] = this.formatReqString(reqs[i]);
    }
    let lastReq = reqs[reqs.length-1];
    reqs[reqs.length-1] = lastReq.substring(0,lastReq.length-1);
    return reqs;
  }
  
  getDescription(traitName: string): string {
    return this.traits.character.campaign.getTraitDetails(traitName).description;
  }

}
