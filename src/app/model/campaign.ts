import { Character } from './character'
import { CreatureType, CreatureTypeData } from './creaturetype';

export interface CampaignData {
    characters: {id:number,version:number}[];
    archivedCharacters: {id:number,name:string}[];
    now: number; // The current time
    creatureTypes: CreatureTypeData[];
}

export class Campaign {

    protected _data: CampaignData;

    characters: Character[];
    creatureTypes: CreatureType[];

    constructor(data: CampaignData,getCharacter: CallableFunction) {
        
        this._data = data;
 
        this.creatureTypes = [];
        for ( let creaturetype of this._data.creatureTypes ) {
            this.creatureTypes.push(new CreatureType(creaturetype));
        }

        this.characters = [];
        for ( let char of this._data.characters ) {
            let character = getCharacter(char.id,char.version);
            let creaturetype = this.creatureTypes[character.creatureType];
            this.characters.push(new Character(char.id,creaturetype,character));
        }
    }

    serialize(): string {
        return JSON.stringify(this._data);
    }

    deleteCharacter(character: Character): void {
        let index = this.characters.indexOf(character);
        this.characters.splice(index,1);
        this._data.characters.splice(index,1);
    
    }

    newCharacter(): Character {
        let character = new Character(this.characters.length,this.creatureTypes[0],this._data.now);
        this.characters.push(character);
        this._data.characters.push({id:character.id,version:character.createdAt});
        return character;
    }

}