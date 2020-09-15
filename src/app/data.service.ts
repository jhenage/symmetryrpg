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
        leftArm:  { dexterity: 5, locomotion: 0.05, muscleSize: 2, reach: 0.375 }, // reach and muscle size might need to calculate from target sizes
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
      },
      tissues: {
        skin: {
          impact: { absorb: 1, give: .8, break: 100 },
          cutting: { break: 0 }
        },
        fat: {
          impact: { absorb: 1, give: .8, break: 100 },
          cutting: { break: 0 }
        },
        muscle: {
          impact: { absorb: 5, give: .5, break: 300 },
          cutting: { break: 0 }
        },
        bone: {
          impact: { absorb: 30, give: 0, break: 200 },
          cutting: { break: 0 }
        },
        lung: {
          impact: { absorb: 5, give: 0.05, break: 100 },
          cutting: { break: 0 }
        },
        brain: {
          impact: { absorb: 5, give: 0.05, break: 100 },
          cutting: { break: 0 }
        }

      },
      targets: {
        torso: { 
          length: 645, // probably should calculate from height 686
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"fat",thickness:20},
            {tissue:"muscle",thickness:25},
            {tissue:"bone",thickness:15},
            {tissue:"lung",thickness:110}
          ]
        },
        head: { 
          length: 235, // probably should calculate from height 254
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"bone",thickness:30},
            {tissue:"brain",thickness:55}
          ]
        },
        leftArm: { 
          length: 695, // probably should be calculated 737
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"fat",thickness:10},
            {tissue:"muscle",thickness:30},
            {tissue:"bone",thickness:15}
          ]
        },
        rightArm: { 
          length: 695, // probably should be calculated
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"fat",thickness:10},
            {tissue:"muscle",thickness:30},
            {tissue:"bone",thickness:15}
          ]
        },
        leftLeg: { 
          length: 810, // probably should be calculated 864
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"fat",thickness:10},
            {tissue:"muscle",thickness:60},
            {tissue:"bone",thickness:20}
          ]
        },
        rightLeg: { 
          length: 810, // probably should be calculated
          layers: [
            {tissue:"skin",thickness:2},
            {tissue:"fat",thickness:10},
            {tissue:"muscle",thickness:60},
            {tissue:"bone",thickness:20}
          ]
        }
        

      }
    }],
    commonSpecialties: {
      archeology: ["academic"], biology:["academic","medical"],chemistry:["academic","technology"],
      economics:["academic"],education:["academic"],history:["academic"],mathematics:["academic"],
      philosophy:["academic"],physics:["academic","technology"],research:["academic"],
      calligraphy:["art"],cosmetics:["art"],illustration:["art"],jewelry:["art"],needlework:["art"],
      photography:["art"],poetry:["art"],sculpture:["art"],tattoos:["art"],clay:["crafting"],
      clothing:["crafting"],culinaryArts:["crafting"],leatherworking:["crafting"],metalworking:["crafting"],
      stoneworking:["crafting"],woodworking:["crafting"],arson:["criminology"],bindings:["criminology"],
      forensics:["criminology"],law:["criminology"],securitySystems:["criminology","espionage"],streetCulture:["criminology"],
      cryptography:["espionage"],disguise:["art","espionage"],locks:["espionage","technology"],pickingPockets:["espionage"],
      seduction:["espionage","social"],tailing:["espionage"],automatics:["fighting"],axes:["fighting"],
      bows:["fighting"],chainWeapons:["fighting"],clubs:["fighting"],crossbows:["fighting"],knives:["fighting"],
      longarms:["fighting"],pistols:["fighting"],slings:["fighting"],sniping:["fighting"],spears:["fighting"],
      staves:["fighting"],swords:["fighting"],unarmedCombat:["fighting"],anatomy:["medical"],diseases:["medical"],
      drugs:["medical"],genetics:["medical"],physicalTherapy:["medical"],psychology:["medical"],reproductiveHealth:["medical"],
      surgery:["medical"],armor:["military"],artillery:["fighting","military"],explosives:["military"],
      interrogation:["military","social"],militaryCulture:["military"],militaryTactics:["military"],brass:["music"],
      composing:["music"],keyboards:["music"],percussion:["music"],singing:["music"],strings:["music"],woodwinds:["music"],
      enchantments:["mystic"],magicalBeasts:["mystic"],meditation:["mystic"],occult:["mystic"],qi:["mystic"],
      residues:["mystic"],ritualMagic:["mystic"],spellcasting:["mystic"],animalCare:["nature"],animalTraining:["nature"],
      aquatic:["nature"],arctic:["nature"],cartography:["nature"],caverns:["nature"],deserts:["nature"],
      ecology:["nature"],farming:["nature"],jungles:["nature"],landscaping:["nature"],meteorology:["nature"],
      mountains:["nature"],swamps:["nature"],tracking:["nature"],comedy:["performance"],dancing:["performance"],
      firePerformance:["performance"],juggling:["performance"],legerdemain:["performance"],storytelling:["art","performance"],
      theater:["performance"],anthropology:["social"],bureacracy:["social"],business:["social"],highSociety:["social"],
      intimidation:["social"],marketing:["social"],negotiation:["social"],politics:["social"],religion:["social"],
      acrobatics:["sports"],climbing:["sports"],cycling:["sports"],parkour:["sports"],skiing:["sports"],skydiving:["sports"],
      swimming:["sports"],architecture:["technology"],artificialIntelligence:["technology"],bionics:["medical","technology"],
      civilEngineering:["technology"],cloaking:["technology"],communications:["technology"],construction:["crafting","technology"],
      conversionPlants:["technology"],electricity:["technology"],gravitics:["technology"],integratedCircuits:["technology"],
      jumpDrives:["technology"],mechanics:["technology"],metallurgy:["technology"],mining:["technology"],
      nanotechnology:["technology"],networkSecurity:["technology"],nuclearTechnology:["technology"],optics:["technology"],
      qiGenerators:["technology"],robotics:["technology"],software:["technology"],syntheticMaterials:["crafting","technology"],
      airplanes:["vehicles"],automobiles:["vehicles"],carts:["vehicles"],helicopters:["vehicles"],militaryVehicles:["military","vehicles"],
      motorboats:["vehicles"],riding:["vehicles"],sailboats:["vehicles"],spacecraft:["vehicles"],submarines:["vehicles"],
      trains:["vehicles"]
    }
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
