import { Character } from './character';
import { Scene, SceneData } from './scene';
import { CreatureType, CreatureTypeData } from './creaturetype';
import { SpecialtyCategories } from './character/specialties';
import { TraitDetails } from './character/traits';
import { CurrencyInterval } from './character/equipment';
import { SpellsDetails } from './character/spells';

export interface CampaignData {
    scenes: SceneData[];
    characterCount: number;
    now: number; // The current time
    characterEditMode: boolean;
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
    spellsDetails: {[propName:string]: SpellsDetails};
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
        this.activeScene.load();
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
    
    get activeScene(): Scene {
        return this.scenes[this._data.activeScene];
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


    nextCharacter(): number {
        return ++this._data.characterCount;
    }


}