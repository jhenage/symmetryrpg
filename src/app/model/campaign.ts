import { Character } from './character'
import { CreatureType, CreatureTypeData } from './creaturetype';
import { SpecialtyCategories } from './character/specialties';
import { TraitDetails } from './character/traits';
import { CurrencyInterval } from './character/equipment';
import { SpellsDetails } from './character/spells';

export interface CampaignData {
    characters: {id:number,version:number}[];
    allCharacters: {name:string,versions:number[]}[];
    now: number; // The current time
    characterEditMode: boolean;
    creatureTypes: CreatureTypeData[];
    commonSpecialties: SpecialtyCategories; // each specialty should have no more than 4 categories
    traitsDetails: {
        naturalTraining: {[propName:string]: TraitDetails};
        qiTraining: {[propName:string]: TraitDetails};
        bestowed: {[propName:string]: TraitDetails};
        epic: {[propName:string]: TraitDetails};
        roleplaying: {[propName:string]: TraitDetails};
    };
    spellsDetails: {[propName:string]: SpellsDetails};
    currencyIntervals: CurrencyInterval[];
}

export class Campaign {

    protected _data: CampaignData;

    characters: Character[];
    creatureTypes: CreatureType[];

    constructor(data: CampaignData,getcharacter: (id,version)=>any) {
        
        this._data = data;
 
        this.creatureTypes = [];
        for ( let creaturetype of this._data.creatureTypes ) {
            this.creatureTypes.push(new CreatureType(creaturetype));
        }

        this.characters = [];
        for ( let char of data.characters ) {
            let charData = getcharacter(char.id,char.version);
            let charObject = new Character(char.id,charData.creatureType,charData,this);
            // charObject.resetAll(); // For Debugging
            this.characters.push(charObject);
        }
    }

    get now(): number {
        return this._data.now;
    }

    set now(time:number) {
        this._data.now = time;
    }

    get commonSpecialties(): SpecialtyCategories {
        return this._data.commonSpecialties;
    }

    get traitTypes(): string[] {
        return Object.keys(this._data.traitsDetails);
    }

    get currencyIntervals(): CurrencyInterval[] {
        return this._data.currencyIntervals;
    }

    get characterEditMode(): boolean {
        return this._data.characterEditMode;
    }

    set characterEditMode(editable:boolean) {
        this._data.characterEditMode = editable;
    }

    getTraitList(traitType: string): string[] {
        return Object.keys(this._data.traitsDetails[traitType]);
    }

    getTraitDetails(traitName: string): TraitDetails {
        let result = {ipCost:0,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},description:"",attributeMods:{},enabledActions:[]};
        this.traitTypes.forEach(traitType => {
            if(this._data.traitsDetails[traitType][traitName]) result = this._data.traitsDetails[traitType][traitName];
        });
        return result;
    }

    getSpellList(): string[] {
        return Object.keys(this._data.spellsDetails);
    }

    getSpellDetails(spellName: string): SpellsDetails {
        return this._data.spellsDetails[spellName];
    }

    serialize(): string {
        return JSON.stringify(this._data);
    }

    archiveCharacter(character: Character): void {
        let index = this.characters.indexOf(character);
        this.characters.splice(index,1);
        this._data.characters.splice(index,1);
        this._data.allCharacters[character.id].name = character.about.name;
    }
    deleteCharacter(character: Character): void {
        this.archiveCharacter(character);

    }

    newCharacter(): Character {
        let character = new Character(this._data.allCharacters.length,0,this._data.now,this);
        this.characters.push(character);
        this._data.characters.push({id:character.id,version:character.createdAt});
        this._data.allCharacters.push({name:'',versions:[character.createdAt]});
        return character;
    }

    nextActions(): any[] {
        let actions = [];
        let current = 0;
        this.characters.forEach((char) => {
            char.actions.nextActions(this._data.now).forEach((action) => {
                if ( current == 0 || current > action.time ) {
                    current = action.time;
                }
                actions.push(action);
            });
        });
        
        return actions.filter((action) => { return action.time == current; });
    }


}