import { Character } from './character'
import { CreatureType, CreatureTypeData } from './creaturetype';
import { DataService } from '../data.service';

export interface CampaignData {
    characters: {id:number,version:number}[];
    allCharacters: {name:string,versions:number[]}[];
    now: number; // The current time
    creatureTypes: CreatureTypeData[];
}

export class Campaign {

    protected _data: CampaignData;

    characters: Character[];
    creatureTypes: CreatureType[];

    constructor(data: CampaignData,getcharacters: (id,version)=>any) {
        
        this._data = data;
 
        this.creatureTypes = [];
        for ( let creaturetype of this._data.creatureTypes ) {
            this.creatureTypes.push(new CreatureType(creaturetype));
        }

        this.characters = [];
        for ( let char of data.characters ) {
            let character = getcharacters(char.id,char.version);
            let creaturetype = this.creatureTypes[character.creatureType];
            this.characters.push(new Character(char.id,creaturetype,character));
        }
    }

    get now(): number {
        return this._data.now;
    }

    set now(time:number) {
        this._data.now = time;
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
        let character = new Character(this._data.allCharacters.length,this.creatureTypes[0],this._data.now);
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