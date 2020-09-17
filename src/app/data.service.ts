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
        organMassFactor: 6.2,
        fatMassFactor: { minimum: 0, average: 6.2, stddev: 10 },
        boneMassFactor: 3.5,
        muscleMassFactor: 10.5,
        brawnFactor: { minimum: 0.75, average: 1, stddev: 0.05 },
        toughnessFactor: { minimum: 0.9, average: 1, stddev: 0.01 },
        muscleBulkFactor: { minimum: 0.75, average: 1, stddev: 0.1 }
      },
      quickness: { physical: 1, mental: 1, action: 1, reaction: 1},
      qi: {minimum: 1, average: 10, stddev: 2},
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
      forensics:["criminology"],law:["criminology"],securitySystems:["criminology","espionage"],
      streetCulture:["criminology","cultural"],americanCulture:["cultural"],chineseCulture:["cultural"],
      japaneseCulture:["cultural"],shaolinCulture:["cultural"],cryptography:["espionage"],
      disguise:["art","espionage"],locks:["espionage","technology"],pickingPockets:["espionage"],
      seduction:["espionage","social"],tailing:["espionage"],automatics:["fighting"],axes:["fighting"],
      bows:["fighting"],chainWeapons:["fighting"],clubs:["fighting"],crossbows:["fighting"],knives:["fighting"],
      longarms:["fighting"],pistols:["fighting"],slings:["fighting"],sniping:["fighting"],spears:["fighting"],
      staves:["fighting"],swords:["fighting"],unarmedCombat:["fighting"],arabic:["languages"],english:["languages"],
      french:["languages"],german:["languages"],hebrew:["languages"],japanese:["languages"],mandarin:["languages"],
      russian:["languages"],spanish:["languages"],anatomy:["medical"],diseases:["medical"],
      drugs:["medical"],genetics:["medical"],physicalTherapy:["medical"],psychology:["medical"],reproductiveHealth:["medical"],
      surgery:["medical"],armor:["military"],artillery:["fighting","military"],explosives:["military"],
      interrogation:["military","social"],militaryCulture:["military","cultural"],militaryTactics:["military"],brass:["music"],
      composing:["music"],keyboards:["music"],percussion:["music"],singing:["music"],strings:["music"],woodwinds:["music"],
      enchantments:["mystic"],magicalBeasts:["mystic"],meditation:["mystic"],occult:["mystic","cultural"],qi:["mystic"],
      residues:["mystic"],ritualMagic:["mystic"],spellcasting:["mystic"],animalCare:["nature"],animalTraining:["nature"],
      aquatic:["nature"],arctic:["nature"],cartography:["nature"],caverns:["nature"],deserts:["nature"],
      ecology:["nature"],farming:["nature"],jungles:["nature"],landscaping:["nature"],meteorology:["nature"],
      mountains:["nature"],swamps:["nature"],tracking:["nature"],comedy:["performance"],dancing:["performance"],
      firePerformance:["performance"],juggling:["performance"],legerdemain:["performance"],storytelling:["art","performance"],
      theater:["performance"],anthropology:["social","cultural"],bureacracy:["social"],business:["social"],
      highSociety:["social","cultural"],intimidation:["social"],marketing:["social"],negotiation:["social"],
      politics:["social","cultural"],religion:["social","cultural"],acrobatics:["sports"],climbing:["sports"],
      cycling:["sports","vehicles"],parkour:["sports"],skiing:["sports"],skydiving:["sports"],
      swimming:["sports"],architecture:["technology"],artificialIntelligence:["technology"],bionics:["medical","technology"],
      civilEngineering:["technology"],cloaking:["technology"],communications:["technology"],construction:["crafting","technology"],
      conversionPlants:["technology"],electricity:["technology"],gravitics:["technology"],integratedCircuits:["technology"],
      jumpDrives:["technology"],mechanics:["technology"],metallurgy:["technology"],mining:["technology"],
      nanotechnology:["technology"],networkSecurity:["technology"],nuclearTechnology:["technology"],optics:["technology"],
      qiGenerators:["technology"],robotics:["technology"],software:["technology"],syntheticMaterials:["crafting","technology"],
      airplanes:["vehicles"],automobiles:["vehicles"],carts:["vehicles"],helicopters:["vehicles"],militaryVehicles:["military","vehicles"],
      motorboats:["vehicles"],riding:["vehicles"],sailboats:["vehicles"],spacecraft:["vehicles"],submarines:["vehicles"],
      trains:["vehicles"]
    },
    traitsDetails: {
      naturalTraining: {
        ambidextrous: {ipCost:30,prerequisites:{aspects:{agility:0.5},skills:{},specialties:{},traits:[],other:{}},
          description:"Reduces your off-hand penalty from -4 to -2."},
        balancedForce: {ipCost:45,prerequisites:{aspects:{agility:1.5},skills:{},specialties:{},traits:["ambidextrous"],other:{}},
          description:"Increases the damage dealt by attacks with the off-hand from 60% to 80%."},
        brute: {ipCost:45,prerequisites:{aspects:{brawn:1.5},skills:{},specialties:{},traits:["strongArm"],other:{}},
          description:"Increases the damage dealt by two-handed attacks from 150% to 175%."},
        defensiveDisarm: {ipCost:45,prerequisites:{aspects:{},skills:{},specialties:{},traits:["defensiveGrab","disarm"],other:{}},
          description:"You can perform a Disarm move twice as quickly immediately after a defensive grab."},
        defensiveGrab: {ipCost:45,prerequisites:{aspects:{},skills:{},specialties:{unarmedCombat:2},traits:["jointLock"],other:{}},
          description:"Allows the Defensive Grab move."},
        defensivePin: {ipCost:45,prerequisites:{aspects:{},skills:{fighter:3},specialties:{},traits:["defensiveGrab"],other:{}},
          description:"You can perform a Pin move twice as quickly immediately after a defensive grab."},
        defensiveStrike: {ipCost:30,prerequisites:{aspects:{},skills:{},specialties:{},traits:["defensiveGrab"],other:{}},
          description:"You can perform a Strike move twice as quickly immediately after a defensive grab."},
        defensiveThrow: {ipCost:60,prerequisites:{aspects:{},skills:{fighter:3},specialties:{},traits:["defensiveGrab"],other:{}},
          description:"You can perform a Throw move twice as quickly and with increased Effective Brawn immediately after a defensive grab."},
        dervish: {ipCost:45,prerequisites:{aspects:{agility:1.5},skills:{athlete:2},specialties:{},traits:[],other:{}},
          description:"Penalties to your actions due to your own movement are reduced by 1 to 2."},
        dirtyFighting: {ipCost:15,prerequisites:{aspects:{},skills:{sneak:0.5,fighter_OR_sharpshooter:0.5},specialties:{},traits:[],other:{}},
          description:"You can perform the Dirty Fighting move twice as quickly."},
        disarm: {ipCost:45,prerequisites:{aspects:{},skills:{fighter:2},specialties:{},traits:[],other:{}},
          description:"You can perform the Disarm move twice as quickly. In addition the penalty for the move is reduced from -3 to -1."},
        eagleEye: {ipCost:30,prerequisites:{aspects:{},skills:{sharpshooter:2},specialties:{},traits:[],other:{}},
          description:"The bonus you receive from the Aim combat option is doubled."},
        endurance: {ipCost:45,prerequisites:{aspects:{toughness:1,serenity:0.5},skills:{},specialties:{},traits:[],other:{}},
          description:"Increases your Endurance attribute by 2."},
        gangFighter: {ipCost:45,prerequisites:{aspects:{agility:0.5},skills:{fighter:2},specialties:{},traits:[],other:{}},
          description:"Reduces effects of being ganged up on by multiple melee opponents."},
        greatBrute: {ipCost:75,prerequisites:{aspects:{brawn:2.5},skills:{},specialties:{},traits:["brute"],other:{}},
          description:"Further increases the damage dealt by two-handed attacks from 175% to 200%."},
        greatEndurance: {ipCost:75,prerequisites:{aspects:{toughness:2.5,serenity:1.5},skills:{},specialties:{},traits:["endurance"],other:{}},
          description:"Further increases your Endurance attribute by 3."},
        greatSturdiness: {ipCost:30,prerequisites:{aspects:{toughness:2.5},skills:{},specialties:{},traits:["sturdiness"],other:{}},
          description:"Further increases your Damage Resistance."},
        greatTenacity: {ipCost:60,prerequisites:{aspects:{toughness:2.5},skills:{},specialties:{},traits:["tenacity"],other:{}},
          description:"Further increases your wound capacity."},
        jack_of_all_trades: {ipCost:75,prerequisites:{aspects:{cleverness:1.5},skills:{ALL_BUT_LINGUIST:0.5},specialties:{ALL_CATEGORIES:1,TOTAL_IP:800},traits:[],other:{}},
          description:"Reduces unspecialized penalties for all skills except Linguist by 1.2 skill ranks."},
        jointLock: {ipCost:45,prerequisites:{aspects:{},skills:{fighter:2},specialties:{unarmedCombat:1},traits:[],other:{}},
          description:"You make Grab and Pin moves twice as quickly and with a +1 bonus. The maximum advantage you can maintain while grappling is increased by 2."},
        kip_up: {ipCost:15,prerequisites:{aspects:{agility:0.5},skills:{athlete:1.5},specialties:{},traits:[],other:{}},
          description:"Unlocks the Kip-up move, allowing you to attempt to stand from prone twice as quickly."},
        knockout: {ipCost:45,prerequisites:{aspects:{brawn:0.5},skills:{fighter:2},specialties:{},traits:[],other:{}},
          description:"Unlocks the Knockout move."},
        perfectAmbidexterity: {ipCost:60,prerequisites:{aspects:{agility:2},skills:{},specialties:{},traits:["ambidextrous"],other:{}},
          description:"Eliminates your off-hand penalty."},
        perfectBalancedForce: {ipCost:60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["perfectAmbidexterity","balancedForce"],other:{}},
          description:"Further increases the damage dealt by attacks with the off-hand from 80% to 100%."},
        perfectSpeedShooter: {ipCost:45,prerequisites:{aspects:{agility:2.5},skills:{sharpshooter:3},specialties:{},traits:["speedShooter"],other:{}},
          description:"Further reduces the penalty from the Snap Shot combat option from -2 to -1."},
        polyglot: {ipCost:45,prerequisites:{aspects:{cleverness:0.5},skills:{linguist:3},specialties:{FIVE_LANGUAGES:2},traits:[],other:{}},
          description:"Reduces unspecialized penalties for the Linguist skill by 1 skill rank."},
        quickLoad: {ipCost:30,prerequisites:{aspects:{agility:1},skills:{sharpshooter:0.5},specialties:{},traits:[],other:{}},
          description:"You reload ranged weapons twice as quickly."},
        slippery: {ipCost:30,prerequisites:{aspects:{agility:0.5,reflex:0.5},skills:{fighter:2},specialties:{unarmedCombat:1},traits:[],other:{}},
          description:"You make the Escape move twice as quickly and with a +1 bonus."},
        speedShooter: {ipCost:45,prerequisites:{aspects:{agility:1.5},skills:{sharpshooter:2},specialties:{},traits:[],other:{}},
          description:"Reduces the penalty from the Snap Shot combat option from -3 to -2."},
        strongArm: {ipCost:30,prerequisites:{aspects:{brawn:1},skills:{fighter:1},specialties:{},traits:[],other:{}},
          description:"Removes the attack test penalty from the Power Attack combat option."},
        sturdiness: {ipCost:15,prerequisites:{aspects:{toughness:1},skills:{},specialties:{},traits:[],other:{}},
          description:"Increases your Damage Resistance."},
        swift: {ipCost:45,prerequisites:{aspects:{brawn:0.5,agility:0.5},skills:{athlete:1.5},specialties:{},traits:[],other:{}},
          description:"Your Effective Brawn is increased by 1 for the purposes of calculating your acceleration and maximum speed."},
        tenacity: {ipCost:15,prerequisites:{aspects:{toughness:1.5},skills:{},specialties:{},traits:["endurance"],other:{}},
          description:"Increases your wound capacity."},
        trip: {ipCost:45,prerequisites:{aspects:{},skills:{fighter:2},specialties:{},traits:[],other:{}},
          description:"You make the Trip move twice as quickly and the penalty is reduced from -3 to -1."},
        tumble: {ipCost:45,prerequisites:{aspects:{agility:1.5},skills:{athlete:2.5},specialties:{},traits:["kip_up"],other:{}},
          description:"When you make the Dive move you can dive in any direction and can choose to end the move standing, crouching, or prone."}
      },
      qiTraining: {
        airWalk: {ipCost:120,prerequisites:{aspects:{impression:3,serenity:3},skills:{},specialties:{},traits:["controlledLightness"],other:{}},
          description:"You gain even greater control of your Qi Lightness ability, allowing weight increments of 10% down to a minimum of 10%." +
                      "At 10%, you create a repulsive force in your feet that lets you hover just above solid ground or run on liquids."},
        bloodMagic: {ipCost:60,prerequisites:{aspects:{},skills:{mage:2},specialties:{occult:1},traits:["spellShaping"],other:{}},
          description:"You can shed blood to increase the power of your spells."},
        bondLink: {ipCost:75,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiSharing"],other:{}},
          description:"You can form a permanent bond link with another channeler."},
        bondWeb: {ipCost:90,prerequisites:{aspects:{serenity:3},skills:{},specialties:{},traits:["bondLink"],other:{}},
          description:"You can form multiple bond links."},
        controlledLightness: {ipCost:90,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiLightness"],other:{}},
          description:"You gain greater control of your Qi Lightness ability, allowing you to lower your weight to 25%, 50%, or 75% of your standard weight."},
        dedicatedToAction: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedAction","NOT_philosophyOfBody","NOT_philosophyOfFinesse","NOT_philosophyOfMind","NOT_philosophyofStrength"],other:{}},
          description:"You gain even further ability to channel qi on Action tests. Your Qi Capacity Multiplier further increases by 1."},
        dedicatedToBalance: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedBalance","NOT_philosophyOfBody","NOT_philosophyOfFinesse","NOT_philosophyOfMind","NOT_philosophyofStrength"],other:{}},
          description:"You gain even further ability to channel qi on Balance tests. Your Qi Capacity Multiplier further increases by 1."},
        dedicatedToBody: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedBody","NOT_philosophyOfAction","NOT_philosophyOfFinesse","NOT_philosophyOfBalance","NOT_philosophyofStrength"],other:{}},
          description:"You gain even further ability to channel qi on Body tests. Your Qi Capacity Multiplier further increases by 1."},
        dedicatedToFinesse: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedFinesse","NOT_philosophyOfAction","NOT_philosophyOfBody","NOT_philosophyOfMind","NOT_philosophyOfBalance"],other:{}},
          description:"You gain even further ability to channel qi on Finesse tests. Your Qi Capacity Multiplier further increases by 1."},
        dedicatedToMind: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedMind","NOT_philosophyOfAction","NOT_philosophyOfFinesse","NOT_philosophyOfBalance","NOT_philosophyofStrength"],other:{}},
          description:"You gain even further ability to channel qi on Mind tests. Your Qi Capacity Multiplier further increases by 1."},
        dedicatedToStrength: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{meditation:3},
          traits:["focusedStrength","NOT_philosophyOfAction","NOT_philosophyOfBody","NOT_philosophyOfMind","NOT_philosophyOfBalance"],other:{}},
          description:"You gain even further ability to channel qi on Strength tests. Your Qi Capacity Multiplier further increases by 1."},
        deepEmpathy: {ipCost:90,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiEmpathy"],other:{}},
          description:"Restricted (1 per activation): Your Qi Empathy ability is sensitive enough that you can detect surface thoughts."},
        distantQi: {ipCost:90,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiBreaking_OR_qiEmpathy_OR_qiHardening_OR_qiVigilence"],other:{}},
          description:"Restricted (1 per activation): Your Qi Breaking, Qi Empathy, and Qi Hardening abilities can be used on targets within your Qi Range." +
                      "Your Qi Vigilence activates for harm intended toward allies within your Qi Range"},
        disruptingArmor: {ipCost:75,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiArmor"],other:{}},
          description:"Restricted (1 per activation): Your Qi Armor applies a TAP to anyone who strikes you in melee combat."},
        enduringQi: {ipCost:60,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiArmor_OR_qiCombat_OR_qiLightness_OR_qiQuickness"],other:{}},
          description:"The duration of your Qi Armor, Qi Combat, and Qi Lightness abilities are multiplied by 10. The duration of your Qi Quickness ability is doubled."},
        extendedQi: {ipCost:90,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiForce_OR_qiJump_OR_qiSurvey_OR_qiVigilence"],other:{}},
          description:"Restricted (1 per activation): The range of your Qi Force, Qi Jump, and Qi Survey abilities are doubled. The range of your Qi Vigilence ability is multiplied by 10."},
        focusedAction: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfAction","NOT_philosophyOfBalance"],other:{}},
          description:"You gain further ability to channel qi on Action tests. Your Qi Capacity Multiplier further increases by 1."},
        focusedBalance: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfBalance","NOT_philosophyOfAction"],other:{}},
          description:"You gain further ability to channel qi on Balance tests. Your Qi Capacity Multiplier further increases by 1."},
        focusedBody: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfBody","NOT_philosophyOfMind"],other:{}},
          description:"You gain further ability to channel qi on Body tests. Your Qi Capacity Multiplier further increases by 1."},
        focusedFinesse: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfFinesse","NOT_philosophyofStrength"],other:{}},
          description:"You gain further ability to channel qi on Finesse tests. Your Qi Capacity Multiplier further increases by 1."},
        focusedMind: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfMind","NOT_philosophyOfBody"],other:{}},
          description:"You gain further ability to channel qi on Mind tests. Your Qi Capacity Multiplier further increases by 1."},
        focusedStrength: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{meditation:2},traits:["philosophyOfStrength","NOT_philosophyOfFinesse"],other:{}},
          description:"You gain further ability to channel qi on Strength tests. Your Qi Capacity Multiplier further increases by 1."},
        gentleQi: {ipCost:60,prerequisites:{aspects:{serenity:2.5},skills:{},specialties:{qi:2},traits:["qiJump_OR_qiQuickness"],other:{}},
          description:"The recovery times of your Qi Jump and Qi Quickness abilities are halved."},
        greaterExtendedQi: {ipCost:120,prerequisites:{aspects:{impression:3,serenity:3},skills:{},specialties:{},traits:["extendedQi"],other:{}},
          description:"Restricted (1 per activation): The range of your Qi Force, Qi Jump, and Qi Survey abilities are multiplied by 4. The range of your Qi Vigilence ability is multiplied by 100."},
        greaterPowerMage: {ipCost:75,prerequisites:{aspects:{impression:3},skills:{},specialties:{},traits:["powerMage"],other:{}},
          description:"The power of your spells is further increased."},
        greaterQiReserves: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{},traits:["qiReserves"],other:{}},
          description:"Your Qi Capacity Multiplier is increased by 3 to a maximum of 10."},
        greaterSpellShaping: {ipCost:150,prerequisites:{aspects:{cleverness:3,impression:1},skills:{mage:3},specialties:{spellcasting:2},traits:["spellShaping"],other:{}},
          description:"You can shape spells with a difficulty of 15 or less."},
        harmoniousArt: {ipCost:30,prerequisites:{aspects:{serenity:1},skills:{artist_OR_musician:2.5},specialties:{},traits:["qiAwareness"],other:{}},
          description:"You recover qi via creative efforts twice as quickly."},
        negativeQi: {ipCost:90,prerequisites:{aspects:{},skills:{},specialties:{occult:1},traits:["ANY_2_PHILOSOPHY"],other:{}},
          description:"You can gather and manipulate negative qi."},
        philosophyOfAction: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedBalance","NOT_dedicatedToBody","NOT_dedicatedToFinesse","NOT_dedicatedToMind","NOT_dedicatedToStrength"],other:{}},
          description:"You gain the ability to channel qi on Action tests. Your Qi Capacity Multiplier increases by 1."},
        philosophyOfBalance: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedAction","NOT_dedicatedToBody","NOT_dedicatedToFinesse","NOT_dedicatedToMind","NOT_dedicatedToStrength"],other:{}},
          description:"You gain the ability to channel qi on Balance tests. Your Qi Capacity Multiplier increases by 1."},
        philosophyOfBody: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedMind","NOT_dedicatedToAction","NOT_dedicatedToFinesse","NOT_dedicatedToBalance","NOT_dedicatedToStrength"],other:{}},
          description:"You gain the ability to channel qi on Body tests. Your Qi Capacity Multiplier increases by 1."},
        philosophyOfFinesse: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedStrength","NOT_dedicatedToAction","NOT_dedicatedToBody","NOT_dedicatedToMind","NOT_dedicatedToBalance"],other:{}},
          description:"You gain the ability to channel qi on Finesse tests. Your Qi Capacity Multiplier increases by 1."},
        philosophyOfMind: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedBody","NOT_dedicatedToAction","NOT_dedicatedToFinesse","NOT_dedicatedToBalance","NOT_dedicatedToStrength"],other:{}},
          description:"You gain the ability to channel qi on Mind tests. Your Qi Capacity Multiplier increases by 1."},
        philosophyOfStrength: {ipCost:75,prerequisites:{aspects:{serenity:1},skills:{mage:1},specialties:{},
          traits:["qiAwareness","NOT_focusedFinesse","NOT_dedicatedToAction","NOT_dedicatedToBody","NOT_dedicatedToMind","NOT_dedicatedToBalance"],other:{}},
          description:"You gain the ability to channel qi on Strength tests. Your Qi Capacity Multiplier increases by 1."},
        powerfulQi: {ipCost:120,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiArmor_OR_qiBreaking_OR_qiCombat_OR_qiForce_OR_qiHardening_OR_qiQuickness"],other:{}},
          description:"Restricted (1 per activation): You may double the qi cost to double the effect of your Qi Armor, Qi Breaking, Qi Combat, Qi Force, Qi Hardening, or Qi Quickness abilities."},
        powerMage: {ipCost:45,prerequisites:{aspects:{impression:1.5},skills:{},specialties:{},traits:["spellShaping"],other:{}},
          description:"The power of your spells is increased."},
        qiArmor: {ipCost:45,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfBalance_OR_philosophyOfStrength"],other:{}},
          description:"When activated temporarily forms personal armor made of qi"},
        qiAwareness: {ipCost:30,prerequisites:{aspects:{serenity:0.5},skills:{mage:0.5},specialties:{meditation:1,qi:1},traits:[],other:{}},
          description:"You can sense qi. Your Magical Defense is increased by 2. Your Qi Capacity Multiplier increases by 1."},
        qiBonding: {ipCost:60,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiSharing"],other:{}},
          description:"You may form qi bonds."},
        qiBreaking: {ipCost:45,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfAction_OR_philosophyOfStrength"],other:{}},
          description:"When activated immediately before making an attack test for an unarmed strike, increases the damage of that strike."},
        qiCombat: {ipCost:60,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfBody_OR_philosophyOfStrength"],other:{}},
          description:"When activated, increases your unarmed damage and allows you to strike intangible beings for a limited time."},
        qiEmpathy: {ipCost:60,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfFinesse_OR_philosophyOfMind"],other:{}},
          description:"You can spend qi to sense the emotions of others."},
        qiForce: {ipCost:60,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfAction_OR_philosophyOfMind"],other:{}},
          description:"You can spend qi to slowly exert significant force at a distance."},
        qiHardening: {ipCost:45,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfBody_OR_philosophyOfBalance"],other:{}},
          description:"When damaged, you may spend qi to absorb some or all of the damage received."},
        qiJump: {ipCost:75,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfAction_OR_philosophyOfBody"],other:{}},
          description:"You can spend qi to teleport short distances."},
        qiLightness: {ipCost:45,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfBody_OR_philosophyOfFinesse"],other:{}},
          description:"When activated, temporarily halves your weight."},
        qiQuickness: {ipCost:60,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfAction_OR_philosophyOfFinesse"],other:{}},
          description:"When activated, temporarily decreases your mental and physical action durations by 10%."},
        qiReserves: {ipCost:75,prerequisites:{aspects:{serenity:2},skills:{},specialties:{},traits:["qiAwareness"],other:{}},
          description:"Your Qi Capacity Multiplier is increased by 2."},
        qiSharing: {ipCost:30,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfMind_OR_philosophyOfStrength"],other:{}},
          description:"You may form a qi link up to once per day."},
        qiSurvey: {ipCost:45,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfMind_OR_philosophyOfBalance"],other:{}},
          description:"When activated, for as long as your eyes are closed, you can sense qi at 5 times your Qi Range."},
        qiVigilance: {ipCost:60,prerequisites:{aspects:{impression:1},skills:{},specialties:{},traits:["philosophyOfFinesse_OR_philosophyOfBalance"],other:{}},
          description:"You may make an automatic test to sense immediate harm intended toward you from sources within 10 times your normal Qi Range."},
        qiWriting: {ipCost:30,prerequisites:{aspects:{},skills:{mage:1},specialties:{},traits:["qiAwareness"],other:{}},
          description:"You can write or draw on the background qi."},
        residueScrubbing: {ipCost:75,prerequisites:{aspects:{cleverness:1},skills:{mage:2},specialties:{qi:2},traits:[],other:{}},
          description:"You can attempt to obscure a qi residue."},
        residueTracking: {ipCost:75,prerequisites:{aspects:{cleverness:1},skills:{mage:2},specialties:{qi:2},traits:[],other:{}},
          description:"When you detect the qi signature of a person, you can follow the qi trail to or from that signature."},
        spellShaping: {ipCost:75,prerequisites:{aspects:{cleverness:1,impression:0.5},skills:{mage:1.5},specialties:{spellcasting:1},traits:["qiWriting"],other:{}},
          description:"You can shape spells with a difficulty of 5 or less."},
        subtleQi: {ipCost:75,prerequisites:{aspects:{},skills:{mage:2},specialties:{qi:2},traits:["qiEmpathy_OR_qiSurvey"],other:{}},
          description:"You may take a penalty to your Mage's Awareness test to attempt to hide your use of Qi Empathy or Qi Survey."},
        unmovableDefense: {ipCost:90,prerequisites:{aspects:{impression:3,serenity:3},skills:{},specialties:{},traits:["powerfulQi,qiHardening"],other:{}},
          description:"When you apply Powerful Qi to your Qi Hardening ability while your feet are planted, your mass is temporarily tripled."},
        weaponFocus: {ipCost:90,prerequisites:{aspects:{impression:2,serenity:2},skills:{},specialties:{qi:2},traits:["qiBreaking_OR_qiCombat"],other:{}},
          description:"Restricted (1 per activation): You may use your Qi Breaking or Qi Combat abilities with melee weapons."},
      },
      bestowed: {
        angel: {ipCost:120,prerequisites:{aspects:{serenity:3,awareness:3},skills:{medic:3},specialties:{diseases:2,surgery:2},traits:["fastHealing","secondHealing"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Serenity and Awareness. You can use Healing Meditation three times per day."},
        beastBond: {ipCost:50,prerequisites:{aspects:{impression:2},skills:{},specialties:{},traits:["chosenOfTheChampionsOfNature","friendOfBeasts"],other:{}},
          description:"You can form a permanent bond with an animal."},
        beastSight: {ipCost:50,prerequisites:{aspects:{awareness:2},skills:{},specialties:{},traits:["chosenOfTheChampionsOfNature","friendOfBeasts"],other:{}},
          description:"You can share the senses of animals."},
        beastTransformation: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfTheChampionsOfNature"],other:{}},
          description:"You can transform into a twin of an animal to which you are are bonded. You can form two additional bonds with animals."},
        chosenOfTheArmOfMercy: {ipCost:80,prerequisites:{aspects:{serenity:2,awareness:2},skills:{medic:2},specialties:{diseases_OR_surgery:2},traits:["initiateOfTheArmOfMercy"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Serenity and Awareness."},
        chosenOfTheChampionsOfNature: {ipCost:80,prerequisites:{aspects:{toughness:2,reflex:2},skills:{survivalist:2},specialties:{animalCare_OR_animalTraining:2},traits:["initiateOfTheChampionsOfNature"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Toughness and Reflex."},
        chosenOfTheCorruptedHeart: {ipCost:80,prerequisites:{aspects:{impression:2,serenity:2},skills:{mage:2},specialties:{occult_OR_qi:2},traits:["initiateOfTheCorruptedHeart"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity."},
        chosenOfTheFistOfDestruction: {ipCost:80,prerequisites:{aspects:{brawn:2,agility:2},skills:{fighter:2},specialties:{militaryTactics_OR_unarmedCombat:2},traits:["initiateOfTheFistOfDestruction"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Brawn and Agility."},
        chosenOfTheGuardiansOfLore: {ipCost:80,prerequisites:{aspects:{impression:2,serenity:2},skills:{mage:2},specialties:{ritualMagic_OR_spellcasting:2},traits:["initiateOfTheGuardiansOfLore"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity."},
        chosenOfThePuppeteers: {ipCost:80,prerequisites:{aspects:{impression:2,cleverness:2},skills:{diplomat:2},specialties:{intimidation_OR_seduction:2},traits:["initiateOfThePuppeteers"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Cleverness."},
        corruptingAura: {ipCost:60,prerequisites:{aspects:{serenity:2},skills:{},specialties:{},traits:["chosenOfTheCorruptedHeart","corruption"],other:{}},
          description:"Your Corruption ability can affect all targets within your Qi Awareness."},
        corruption: {ipCost:60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["initiateOfTheCorruptedHeart","negativeQi"],other:{}},
          description:"You can more easily infuse people, places, and objects with negative qi."},
        destroyer: {ipCost:120,prerequisites:{aspects:{brawn:3,agility:3},skills:{fighter:3},specialties:{militaryTactics:2,unarmedCombat:2},traits:["distantDrain","drainingStrike"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Brawn and Agility. You drain more from your victims."},
        disguisedDomination: {ipCost:60,prerequisites:{aspects:{cleverness:2},skills:{},specialties:{},traits:["chosenOfThePuppeteers","possession"],other:{}},
          description:"The effects of your Possession and Subjugation abilities are more difficult to detect."},
        distantDrain: {ipCost:50,prerequisites:{aspects:{awareness:2},skills:{},specialties:{},traits:["chosenOfTheFistOfDestruction","essenceDrain"],other:{}},
          description:"You can use Essence Drain on visible targets within your Qi Awareness."},
        drainingStrike: {ipCost:60,prerequisites:{aspects:{impression:2},skills:{},specialties:{},traits:["chosenOfTheFistOfDestruction","essenceDrain"],other:{}},
          description:"You can use Essence Drain as a free action on targets you strike in melee."},
        enslavement: {ipCost:150,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfThePuppeteers"],other:{}},
          description:"By decreasing your qi capacity, you can permanently subjugate victims."},
        essenceDrain: {ipCost:50,prerequisites:{aspects:{},skills:{},specialties:{},traits:["initiateOfTheFistOfDestruction","negativeQi"],other:{}},
          description:"You can drain qi from another person."}, 
        fastHealing: {ipCost:40,prerequisites:{aspects:{impression:2},skills:{},specialties:{},traits:["chosenOfTheArmOfMercy","healingMeditation"],other:{}},
          description:"Your Healing Meditation is four times faster."},
        friendOfBeasts: {ipCost:30,prerequisites:{aspects:{},skills:{},specialties:{},traits:["initiateOfTheChampionsOfNature","qiEmpathy"],other:{}},
          description:"You can communicate with animals. Animals are more likely to trust you."},
        groupDrain: {ipCost:150,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfTheFistOfDestruction"],other:{}},
          description:"You can drain qi from a group of people simultaneously."},
        headOfTheArmOfMercy: {ipCost:100,prerequisites:{aspects:{serenity:5,awareness:5},skills:{medic:5},specialties:{diseases:3,surgery:3},traits:["angel","epicAdvancement"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Serenity and Awareness."},
        headOfTheChampionsOfNature: {ipCost:100,prerequisites:{aspects:{toughness:5,reflex:5},skills:{survivalist:5},specialties:{animalCare:3,animalTraining:3},traits:["epicAdvancement","liberator"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Toughness and Reflex."},
        headOfTheCorruptedHeart: {ipCost:100,prerequisites:{aspects:{impression:5,serenity:5},skills:{mage:5},specialties:{occult:3,qi:3},traits:["epicAdvancement","twistedOne"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity."},
        headOfTheFistOfDestruction: {ipCost:100,prerequisites:{aspects:{brawn:5,agility:5},skills:{fighter:5},specialties:{militaryTactics:3,unarmedCombat:3},traits:["destroyer","epicAdvancement"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Brawn and Agility."},
        headOfTheGuardiansOfLore: {ipCost:100,prerequisites:{aspects:{impression:5,serenity:5},skills:{mage:5},specialties:{ritualMagic:3,spellcasting:3},traits:["epicAdvancement","keeper"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity."},
        headOfThePuppeteers: {ipCost:100,prerequisites:{aspects:{impression:5,cleverness:5},skills:{diplomat:5},specialties:{intimidation:3,seduction:3},traits:["epicAdvancement","master"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Cleverness."},
        healingMeditation: {ipCost:60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["initiateOfTheArmOfMercy","philosophyOfBody","philosophyOfMind"],other:{}},
          description:"Once per day, you can meditate while touching another to heal them."},
        healingTouch: {ipCost:150,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfTheArmOfMercy"],other:{}},
          description:"You can complete a Healing Meditation in seconds. You can use Healing Meditation five times per day."},
        incite: {ipCost:60,prerequisites:{aspects:{},skills:{},specialties:{seduction:2},traits:["chosenOfTheCorruptedHeart","corruption"],other:{}},
          description:"You can incite negative emotions in people infused with negative qi."},
        initiateOfTheArmOfMercy: {ipCost:50,prerequisites:{aspects:{serenity:1,awareness:1},skills:{medic:1},specialties:{diseases:1,surgery:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Serenity and Awareness."},
        initiateOfTheChampionsOfNature: {ipCost:50,prerequisites:{aspects:{toughness:1,reflex:1},skills:{survivalist:1},specialties:{animalCare:1,animalTraining:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Toughness and Reflex."},
        initiateOfTheCorruptedHeart: {ipCost:50,prerequisites:{aspects:{impression:1,serenity:1},skills:{mage:1},specialties:{occult:1,qi:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Impression and Serenity."},
        initiateOfTheFistOfDestruction: {ipCost:50,prerequisites:{aspects:{brawn:1,agility:1},skills:{fighter:1},specialties:{militaryTactics:1,unarmedCombat:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Brawn and Agility."},
        initiateOfTheGuardiansOfLore: {ipCost:50,prerequisites:{aspects:{impression:1,serenity:1},skills:{mage:1},specialties:{ritualMagic:1,spellcasting:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Impression and Serenity."},
        initiateOfThePuppeteers: {ipCost:50,prerequisites:{aspects:{impression:1,cleverness:1},skills:{diplomat:1},specialties:{intimidation:1,seduction:1},traits:[],other:{}},
          description:"You gain a +0.5 bonus to effective Impression and Cleverness."},
        keeper: {ipCost:120,prerequisites:{aspects:{impression:3,serenity:3},skills:{mage:3},specialties:{ritualMagic:2,spellcasting:2},traits:["spellMastery","spellSight"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity. Your spellcasting time is reduced by 10%"},
        liberator: {ipCost:100,prerequisites:{aspects:{toughness:3,reflex:3},skills:{survivalist:3},specialties:{animalCare:2,animalTraining:2},traits:["beastBond","beastSight"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Toughness and Reflex. You can form an additional bond with animals."},
        master: {ipCost:110,prerequisites:{aspects:{impression:3,cleverness:3},skills:{diplomat:3},specialties:{intimidation:2,seduction:2},traits:["disguisedDomination","subjugation"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Cleverness. Your Subjugation ability lasts twice as long."},
        possession: {ipCost:60,prerequisites:{aspects:{impression:1,serenity:1},skills:{mage:1.5},specialties:{},traits:["initiateOfThePuppeteers","negativeQi"],other:{}},
          description:"Your spirit can attempt to enter another's body and temporarily take control of it."},
        secondHealing: {ipCost:60,prerequisites:{aspects:{serenity:2},skills:{},specialties:{},traits:["chosenOfTheArmOfMercy","healingMeditation"],other:{}},
          description:"You can use Healing Meditation twice per day."},
        spellDesign: {ipCost:120,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfTheGuardiansOfLore"],other:{}},
          description:"You can design new spells."},
        spellMastery: {ipCost:60,prerequisites:{aspects:{cleverness:2},skills:{},specialties:{},traits:["chosenOfTheGuardiansOfLore","spellReading"],other:{}},
          description:"By doubling the spell difficulty, you can choose to cast a motionless version of any spell you know."},
        spellReading: {ipCost:30,prerequisites:{aspects:{},skills:{},specialties:{},traits:["initiateOfTheGuardiansOfLore","spellShaping"],other:{}},
          description:"You gain increased ability to read spell vibrations and spell residues."},
        spellSight: {ipCost:60,prerequisites:{aspects:{awareness:2},skills:{},specialties:{},traits:["chosenOfTheGuardiansOfLore","spellReading"],other:{}},
          description:"Your Qi Awareness satisfies line of sight requirements for your spells."},
        subjugation: {ipCost:60,prerequisites:{aspects:{impression:2},skills:{},specialties:{},traits:["chosenOfThePuppeteers","possession"],other:{}},
          description:"You can attempt to give a possessed person mental commands they will follow autonomously after you leave their body."},
        summonTaint: {ipCost:150,prerequisites:{aspects:{},skills:{},specialties:{},traits:["headOfTheCorruptedHeart"],other:{}},
          description:"You can summon a malevolent creature that spreads negative qi."},
        twistedOne: {ipCost:110,prerequisites:{aspects:{impression:3,serenity:3},skills:{mage:3},specialties:{occult:2,qi:2},traits:["corruptingAura","incite"],other:{}},
          description:"You gain an additional +0.5 bonus to effective Impression and Serenity. The range of your Corrupting Aura is doubled."},
      },
      epic: {
        airClimb: {ipCost:150,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["airWalk","epicAdvancement"],other:{}},
          description:"When you use your Air Walk ability at 10% weight, the repulsive force in your feet can operate at any altitude up to 5 times your Qi Range."},
        detailedSurvey: {ipCost:125,prerequisites:{aspects:{awareness:8},skills:{},specialties:{qi:3},traits:["epicAdvancement","extendedQi","qiSurvey"],other:{}},
          description:"Restricted (1 per activation): You gain a +3 bonus to Mage's Awareness tests made while using your Qi Survey ability."},
        epicAdvancement: {ipCost:100,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You gain access to epic aspects, skills, and traits."},
        epicDeepEmpathy: {ipCost:175,prerequisites:{aspects:{awareness:8},skills:{},specialties:{qi:3},traits:["deepEmpathy","epicAdvancement"],other:{}},
          description:"Restricted (1 per activation): By spending additional qi, your Qi Empathy ability becomes sensitive enough to detect memories."},
        epicDistantQi: {ipCost:100,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["distantQi","epicAdvancement"],other:{}},
          description:"Restricted (1 per activation): Your Qi Breaking, Qi Empathy, and Qi Hardening abilities can be used on targets within twice your Qi Range. " +
          "Your Qi Vigilence activates for harm intended toward allies within twice your Qi Range."},
        epicEndurance: {ipCost:100,prerequisites:{aspects:{toughness:8},skills:{},specialties:{},traits:["epicAdvancement","greatEndurance"],other:{}},
          description:"Further increase your endurance attribute by 4."},
        epicEnduringQi: {ipCost:100,prerequisites:{aspects:{serenity:8},skills:{},specialties:{qi:3},traits:["enduringQi","epicAdvancement"],other:{}},
          description:"Restricted (1 per activation): The duration of your Qi Armor, Qi Combat, and Qi Lightness abilities are again multiplied by 10. " +
          "The duration of your Qi Quickness ability is doubled again."},
        epicExtendedQi: {ipCost:125,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["epicAdvancement","greaterExtendedQi"],other:{}},
          description:"Restricted (1 per activation): The range of your Qi Force, Qi Jump, and Qi Survey abilities are multiplied by 10. " +
          "The range of your Qi Vigilence ability is multiplied by 1000."},
        epicPowerfulQi: {ipCost:150,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["epicAdvancement","powerfulQi"],other:{}},
          description:"Restricted (1 per activation): You may triple the qi cost to triple the effect of your Qi Armor, Qi Breaking, " +
          "Qi Combat, Qi Force, Qi Hardening, or Qi Quickness abilities."},
        epicPowerMage: {ipCost:125,prerequisites:{aspects:{impression:8},skills:{},specialties:{},traits:["epicAdvancement","greaterPowerMage"],other:{}},
          description:"Further increases the power of your spells."},
        epicSpellShaping: {ipCost:200,prerequisites:{aspects:{cleverness:8,impression:3},skills:{mage:8},specialties:{qi:2,spellcasting:3},traits:["epicAdvancement","greaterSpellShaping"],other:{}},
          description:"You can shape spells of any difficulty."},
        epicStrength: {ipCost:175,prerequisites:{aspects:{brawn:8,toughness:5},skills:{},specialties:{},traits:["epicAdvancement","greatSturdiness"],other:{}},
          description:"You gain a +1 bonus to your effective Brawn."},
        epicSturdiness: {ipCost:100,prerequisites:{aspects:{toughness:8},skills:{},specialties:{},traits:["epicAdvancement","greatSturdiness"],other:{}},
          description:"Your DR is doubled."},
        epicSubtleQi: {ipCost:100,prerequisites:{aspects:{},skills:{mage:8},specialties:{},traits:["epicAdvancement","subtleQi"],other:{}},
          description:"You may take an additional penalty to your Mage's Awareness test to gain a bonus to your ability to hide your use of Qi Empathy or Qi Survey."},
        epicSwiftness: {ipCost:100,prerequisites:{aspects:{brawn:4,agility:4},skills:{athlete:8},specialties:{},traits:["epicAdvancement","swift"],other:{}},
          description:"Your effective Brawn is increased by an additional 2 for the purpose of calculating acceleration and speed."},
        epicTenacity: {ipCost:100,prerequisites:{aspects:{toughness:8},skills:{},specialties:{},traits:["epicAdvancement","greatTenacity"],other:{}},
          description:"Your Wound Capacity is further increased."},
        groupJump: {ipCost:200,prerequisites:{aspects:{impression:10},skills:{},specialties:{},traits:["epicAdvancement","tandemJump"],other:{}},
          description:"Restricted (1 per activation): You may take a number of passengers equal to your Impression rank with you when you Qi Jump. " +
          "This increases the qi cost of the jump by 50% per passenger."},
        perfectRegeneration: {ipCost:200,prerequisites:{aspects:{toughness:12},skills:{},specialties:{},traits:["epicAdvancement","regeneration","supremeTenacity"],other:{}},
          description:"Your body automatically consumes qi to rapidly heal injuries."},
        qiReceiving: {ipCost:150,prerequisites:{aspects:{serenity:8},skills:{},specialties:{qi:3},traits:["bondLink","epicAdvancement","distantQi"],other:{}},
          description:"Restricted (1 per activation): When you use your Qi Sharing ability, you may instead transfer the qi from the target to yourself if the target is willing."},
        qiSoaring: {ipCost:200,prerequisites:{aspects:{impression:10},skills:{},specialties:{},traits:["airClimb","epicAdvancement"],other:{}},
          description:"Restricted (1 per activation): When you use your Air Walk ability at 10% weight, the repulsive force in your feet can operate at any altitude up to 100 times your Qi Range."},
        qiTracer: {ipCost:150,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["bondLink","epicAdvancement","distantQi"],other:{}},
          description:"Restricted (1 per activation): When you use your Qi Sharing ability, whether or not you transfer qi, you can put a qi tracking beacon on the target. "+
          "The tracking beacon is observable only to you."},
        qiWell: {ipCost:125,prerequisites:{aspects:{serenity:10},skills:{},specialties:{},traits:["epicAdvancement","qiReserves"],other:{}},
          description:"You gain +2.5 to your effective Serenity for the purpose of calculating your Qi Capacity."},
        quickCasting: {ipCost:150,prerequisites:{aspects:{cleverness:8},skills:{mage:8},specialties:{spellcasting:3},traits:["epicAdvancement","greaterSpellShaping"],other:{}},
          description:"You can accept a -4 penalty to your spellcasting test to decrease the duration of your spellcasting action by 20%."},
        regeneration: {ipCost:150,prerequisites:{aspects:{toughness:10},skills:{},specialties:{},traits:["epicAdvancement","epicTenacity"],other:{}},
          description:"You heal by natural means at four times the normal rate. You do not need to spend qi to be healed by supernatural means."},
        supremeEndurance: {ipCost:150,prerequisites:{aspects:{toughness:10},skills:{},specialties:{},traits:["epicAdvancement","epicEndurance"],other:{}},
          description:"Further increase your endurance attribute by 6."},
        supremeEnduringQi: {ipCost:150,prerequisites:{aspects:{serenity:10},skills:{},specialties:{},traits:["epicAdvancement","epicEnduringQi"],other:{}},
          description:"The duration of your Qi Armor, Qi Combat, and Qi Lightness abilities are again multiplied by 10. " +
          "The duration of your Qi Quickness ability is doubled again."},
        supremeExtendedQi: {ipCost:200,prerequisites:{aspects:{impression:10},skills:{},specialties:{},traits:["epicAdvancement","epicDistantQi_OR_epicExtendedQi"],other:{}},
          description:"Your Qi Range is doubled."},
        supremePowerfulQi: {ipCost:250,prerequisites:{aspects:{impression:10},skills:{},specialties:{},traits:["epicAdvancement","epicPowerfulQi"],other:{}},
          description:"The effect of your Qi Armor, Qi Breaking, Qi Combat, Qi Force, Qi Hardening, and Qi Quickness abilities are increased by their base amount."},
        supremePowerMage: {ipCost:200,prerequisites:{aspects:{impression:10},skills:{},specialties:{},traits:["epicAdvancement","epicPowerMage"],other:{}},
          description:"Further increases the power of your spells."},
        supremeStrength: {ipCost:250,prerequisites:{aspects:{brawn:10},skills:{},specialties:{},traits:["epicAdvancement","epicStrength","epicSturdiness"],other:{}},
          description:"You gain an additional +1 bonus to your effective Brawn."},
        supremeSturdiness: {ipCost:150,prerequisites:{aspects:{toughness:10},skills:{},specialties:{},traits:["epicAdvancement","epicSturdiness"],other:{}},
          description:"Your DR is doubled again."},
        supremeTenacity: {ipCost:150,prerequisites:{aspects:{toughness:10},skills:{},specialties:{},traits:["epicAdvancement","epicTenacity"],other:{}},
          description:"Further increases your wound capacity."},
        tandemJump: {ipCost:150,prerequisites:{aspects:{impression:8},skills:{},specialties:{qi:3},traits:["epicAdvancement","extendedQi","qiJump"],other:{}},
          description:"Restricted (1 per activation): You may take one passenger with you when you Qi Jump." +
          "This doubles the qi cost of the jump."},
        threatFinder: {ipCost:125,prerequisites:{aspects:{awareness:8},skills:{},specialties:{qi:3},traits:["epicAdvancement","greaterExtendedQi","qiVigilance"],other:{}},
          description:"Restricted (1 per activation): When your Qi Vigilance ability activates, you can sense the location of the source of the threat."},
      },
      roleplaying: {
        activelyHunted: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["hunted"],other:{}},
          description:"The organization hunting you is hostile and spending effort or resources to find you."},
        addiction: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:["NOT_regeneration"],other:{}},
          description:"You need regular doses of a particular substance or you suffer withdrawls."},
        anemia: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:["NOT_endurance"],other:{baseEndurance:1.5}},
          description:"You have a -1 penalty to your endurance attribute."},
        commonPhobia: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["phobia"],other:{}},
          description:"The source of your phobia is something you encounter frequently."},
        discrimination: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You face discrimination from those who recognize your status."},
        enemy: {ipCost:-30,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You have an enemy who occasionally makes life difficult."},
        expensiveAddiction: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["addiction"],other:{}},
          description:"The substance to which you are addicted is expensive or otherwise difficult to obtain."},
        extremeFame: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["greaterFame"],other:{}},
          description:"You attract enormous amounts of unwanted attention."},
        fame: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You sometimes attract unwanted attention."},
        frail: {ipCost:-30,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"Your DR is reduced."},
        greaterEnemy: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["enemy"],other:{}},
          description:"Your enemy frequently makes life very difficult."},
        greaterFame: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["fame"],other:{}},
          description:"You attract moderate amounts of unwanted attention."},
        hunted: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"An unfriendly organization such as a coroporation or law enforcement is on the lookout for you."},
        illiterate: {ipCost:-30,prerequisites:{aspects:{},skills:{linguist:-3},specialties:{},traits:[],other:{}},
          description:"You cannot read in any language."},
        minor: {ipCost:-30,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You are not yet a legal adult and must obey a parent or guardian."},
        nemesis: {ipCost:-90,prerequisites:{aspects:{},skills:{},specialties:{},traits:["greaterEnemy"],other:{}},
          description:"Your enemy is a constant threat to your life."},
        obligation: {ipCost:-30,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You have an obligation outside of your regulat job that demands significant time or resources."},
        obviousMinority: {ipCost:-80,prerequisites:{aspects:{},skills:{},specialties:{},traits:["discrimination"],other:{}},
          description:"The status that leads to your discrimination is visibly obvious to others."},
        paranoia: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You are slow to trust others, particularly organizations with significant power."},
        phobia: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You are unusually frightened by something."},
        physicalDisability: {ipCost:-30,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You have a specific physical disability that makes some physical activities difficult."},
        psychosis: {ipCost:-20,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},
          description:"You have a disconnect with reality on a particular topic."},
        severeAddiction: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["addiction"],other:{}},
          description:"Your withdrawl penalties are debilitating, potentially life-threatening."},
        severeAnemia: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["anemia"],other:{baseEndurance:2.5}},
          description:"You have an additional -1 penalty to your endurance attribute."},
        severeDisability: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["physicalDisability"],other:{}},
          description:"Your disability makes some physical activities impossible or nearly impossible."},
        severeDiscrimination: {ipCost:-80,prerequisites:{aspects:{},skills:{},specialties:{},traits:["discrimination"],other:{}},
          description:"The discrimination you face is severe."},
        severeParanoia: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["paranoia"],other:{}},
          description:"Your paranoia is extreme and directed at nearly everyone."},
        severePhobia: {ipCost:-40,prerequisites:{aspects:{},skills:{},specialties:{},traits:["phobia"],other:{}},
          description:"Your phobia is extreme, sometimes paralyzing."},
        severePsychosis: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["psychosis"],other:{}},
          description:"You are prone to random wild ideas that are obviously false to everyone else."},
        severelyHunted: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["activleyHunted"],other:{}},
          description:"The organization hunting you is very hostile and expending a lot of effort and resources to find you."},
        weightyObligation: {ipCost:-60,prerequisites:{aspects:{},skills:{},specialties:{},traits:["obligation"],other:{}},
          description:"Your obligation(s) demand enormous amounts of time and resources."}
      }
    },
    currencyIntervals: [{ipMax: 200, computation: "linear", parameters: [0,2]},
                        {ipMax: 1000, computation: "quadratic", parameters: [400,-2,0.01]},
                        {ipMax: 9000, computation: "exponential", parameters: [1800,0.0025,-1782]},
                        {ipMax: 10000, computation: "quadratic", parameters: [-7.3032e+10,85000,1024]},
                        {ipMax: Infinity, computation: "linear", parameters: [-1.7548e+11,20570000]}]
  };
  constructor() { }

  private _campaign: Campaign;
  get campaign() {
    if(typeof this._campaign === "undefined") {
      let data = this.parse(localStorage.getItem('campaign'));
      if(data) {
        data.creatureTypes = this._campaignblank.creatureTypes; // For Debugging
        data.commonSpecialties = this._campaignblank.commonSpecialties; // For Debugging
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
