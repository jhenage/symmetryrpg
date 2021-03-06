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
    private getcharacterdata: (id,scene)=>any; // callback function to the data service

    characters: Character[];

    constructor(data: SceneData,campaign: Campaign,getcharacter: (id,scene)=>any) {
        
        this._data = data;
        this.campaign = campaign;
        this.getcharacterdata = getcharacter;
    }

    load(): void {
        if(this.characters && this.characters.length) {
            return;
        }
 
        this.characters = [];
        for ( let char of this._data.characters ) {
            let charData = this.getcharacterdata(char.id,this.id);
            let charObject = new Character(char.id,charData.specie,charData,this);
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
        let character = new Character(this.campaign.nextCharacter(),this.id,null,this);
        this.characters.push(character);
        this._data.characters.push({id:character.id,name:character.about.name});
        return character;
    }

    // take a character from an old scene and clone it into this scene
    addCharacter(character: Character): Character {
        let newchar = new Character(character.id,character.specieIndex,character.serialize(),this);
        newchar.resetHistory(this.start);
        this.characters.push(newchar);
        this._data.characters.push({id:newchar.id,name:newchar.about.name});
        return newchar;
    }

    getCharacter(id: number): Character {
        return this.characters.filter((char: Character) => {return char.id==id}).pop();
    }

    archiveCharacter(character: Character): void {
        let index = this.characters.indexOf(character);
        this.characters.splice(index,1);
        this._data.characters.splice(index,1);
        //this._data.allCharacters[character.id].name = character.about.name;
    }
    deleteCharacter(character: Character): void {
        this.archiveCharacter(character);

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