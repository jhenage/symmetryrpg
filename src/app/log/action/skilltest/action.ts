import { Character } from 'src/app/model/character';
import { DiceRoll } from 'src/app/model/diceroll';
import { ActionData } from 'src/app/model/character/actions';
import { ActionFactory, ActionObject } from '../factory';

interface SkillTestActionData extends ActionData {
    aspect: string;
    skill: string;
    luck: string; // 'low' or 'high'
    dice: number[]; // the two dice
    modifierBySpecialty: number[];
    missingSpecialty: number;
}

export interface SkillTestActionObject extends ActionObject {
    roll: DiceRoll;
    data: SkillTestActionData;
}

export class SkillTestActionFactory implements ActionFactory {

    build(character: Character,datainit: {time: number;aspect: string;skill: string;luck?}): SkillTestActionObject {
        let data = datainit as SkillTestActionData;
        data.type = 'skilltest';
        data.executed = true;
        data.luck = data.luck || 'standard';
        data.missingSpecialty = 0;
        data.endTime = data.time;

        let roll = new DiceRoll();
        data.dice = roll.result;
        data.modifierBySpecialty = character.skills.getTestModifiers(character.aspects.Current(data.time,data.aspect),data.skill);
        for ( let i = 0; i < data.modifierBySpecialty.length; i++ ) {
            data.modifierBySpecialty[i] -= character.generalPenalty(data.time);
        }

        character.actions.add(data);

        return {character: character,roll: roll,data: data};
    }

    buildFromStorage(character: Character,data: SkillTestActionData): SkillTestActionObject {
        let roll = new DiceRoll(data.dice);
        return {character:character,roll:roll,data:data};
    }

    execute() {}
}