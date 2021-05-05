import { Character } from './character'
import { Campaign } from './campaign';

export interface SceneData {
    id: number;
    name: string;
    start: number;
    characters: {
        id:number; 
        name:string;
    }[];
}

export class Scene {

    private _data: SceneData;
    campaign: Campaign;
    private getcharacter: (id,scene)=>any; // callback function to the data service

    characters: Character[];

    constructor(data: SceneData,campaign: Campaign,getcharacter: (id,scene)=>any) {
        
        this._data = data;
        this.campaign = campaign;
        this.getcharacter = getcharacter;
    }

    load(): void {
        if(this.characters && this.characters.length) {
            return;
        }
 
        this.characters = [];
        for ( let char of this._data.characters ) {
            let charData = this.getcharacter(char.id,this.id);
            let charObject = new Character(char.id,charData.creatureType,charData,this);
            // charObject.resetAll(); // For Debugging
            this.characters.push(charObject);
        }
    }

    get id(): number { 
        return this._data.id;
    }

    get start(): number {
        return this._data.start;
    }

    newCharacter(): Character {
        let character = new Character(this.campaign.nextCharacter(),0,null,this);
        this.characters.push(character);
        this._data.characters.push({id:character.id,name:character.about.name});
        return character;
    }

    // take a character from an old scene and clone it into this scene
    addCharacter(character: Character): Character {
        let newchar = new Character(character.id,character.creatureTypeIndex,character.serialize(),this);
        newchar.resetHistory(this.start);
        this.characters.push(newchar);
        this._data.characters.push({id:newchar.id,name:newchar.about.name});
        return newchar;
    }

    nextActions(): any[] {
        let actions = [];
        let current = 0;
        this.characters.forEach((char) => {
            char.actions.nextActions(this.campaign.now).forEach((action) => {
                if ( current == 0 || current > action.time ) {
                    current = action.time;
                }
                actions.push(action);
            });
        });
        
        return actions.filter((action) => { return action.time == current; });
    }


}