import { Character } from 'src/app/model/character';
import { DiceRoll } from 'src/app/model/diceroll';
import { ActionData } from 'src/app/model/character/actions';
import { ActionFactory, ActionObject } from '../factory';

export interface ActionPenalty {
    targetedPenalty: number;
    genericPenalty: number;
    incidentalPenalty: number;
}

interface AspectTestActionData extends ActionData {
    aspect: string;
    luck: string; // 'low' or 'high'
    dice: number[]; // the two dice
    modifier: number;
}

export interface AspectTestActionObject extends ActionObject {
    roll: DiceRoll;
    data: AspectTestActionData;
}

export class AspectTestActionFactory implements ActionFactory {

    build(character: Character,datainit: {time: number;aspect: string;luck?}): AspectTestActionObject {
        let data = datainit as AspectTestActionData;
        data.type = 'aspecttest';
        data.executed = true;
        data.luck = data.luck || 'high';

        let roll = new DiceRoll();
        data.dice = roll.result;
        data.modifier = roll.modifier = character.aspects.getBaseResult(data.time,data.aspect) - character.generalPenalty(data.time);

        character.actions.add(data);

        return {character: character,roll: roll,data: data};
    }

    buildFromStorage(character: Character,data: AspectTestActionData): AspectTestActionObject {
        let roll = new DiceRoll(data.dice);
        roll.modifier = data.modifier;
        return {character:character,roll:roll,data:data};
    }

    execute() { }
}