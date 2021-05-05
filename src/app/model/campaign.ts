import { Character } from './character';
import { Scene, SceneData } from './scene';
import { CreatureType, CreatureTypeData } from './creaturetype';
import { SpecialtyCategories } from './character/specialties';
import { TraitDetails } from './character/traits';
import { CurrencyInterval } from './character/equipment';
import { timeStamp } from 'console';

export interface CampaignData {
    scenes: SceneData[];
    characterCount: number;
    now: number; // The current time
    activeScene: number; // Index of the active scene
    creatureTypes: CreatureTypeData[];
    commonSpecialties: SpecialtyCategories; // each specialty should have no more than 4 categories
    traitsDetails: {
        naturalTraining: {[propName:string]: TraitDetails};
        qiTraining: {[propName:string]: TraitDetails};
        bestowed: {[propName:string]: TraitDetails};
        epic: {[propName:string]: TraitDetails};
        roleplaying: {[propName:string]: TraitDetails};
    };
    currencyIntervals: CurrencyInterval[];
}

export class Campaign {

    protected _data: CampaignData;

    scenes: Scene[];
    creatureTypes: CreatureType[];

    constructor(data: CampaignData,getcharacter: (id,scene)=>any) {
        
        this._data = data;
 
        this.creatureTypes = [];
        for ( let creaturetype of this._data.creatureTypes ) {
            this.creatureTypes.push(new CreatureType(creaturetype));
        }

        this.scenes = [];
        for ( let scene of data.scenes ) {
            let sceneObject = new Scene(scene,this,getcharacter);
            this.scenes.push(sceneObject);
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

    get activeScene(): Scene {
        return this.scenes[this._data.activeScene];
    }

    getTraitList(traitType: string): string[] {
        return Object.keys(this._data.traitsDetails[traitType]);
    }

    getTraitDetails(traitName: string): TraitDetails {
        let result = {ipCost:0,prerequisites:{aspects:{},skills:{},specialties:{},traits:[],other:{}},description:""};
        this.traitTypes.forEach(traitType => {
            if(this._data.traitsDetails[traitType][traitName]) result = this._data.traitsDetails[traitType][traitName];
        });
        return result;
    }

    serialize(): string {
        return JSON.stringify(this._data);
    }

//    archiveCharacter(character: Character): void {
//        let index = this.characters.indexOf(character);
//        this.characters.splice(index,1);
//        this._data.characters.splice(index,1);
//        this._data.allCharacters[character.id].name = character.about.name;
//    }
//    deleteCharacter(character: Character): void {
//        this.archiveCharacter(character);
//
//    }

    nextCharacter(): number {
        return ++this._data.characterCount;
    }


}