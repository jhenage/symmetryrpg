import { Character } from 'src/app/model/character';
import { ActionData } from 'src/app/model/character/actions';

export interface ActionObject {
    character: Character;
    data: ActionData;
}

export interface ActionFactory {
    
    build(character: Character,datainit: {time: number}): ActionObject;

    buildFromStorage(character: Character,data: ActionData): ActionObject;

    execute(action: ActionObject): void;

}