import { Character } from 'src/app/model/character';
import { DiceRoll } from 'src/app/model/diceroll';
import { ActionData } from 'src/app/model/character/actions';
import { ActionFactory, ActionObject } from '../factory';
import { WoundSingle } from 'src/app/model/character/wounds';

interface AttackActionData extends ActionData {
    target: {
        character: number;
        location: string;
    }
    limb: string;
    length: number;
    diameter: number;
    delayDice: number[];
}

export interface AttackActionObject extends ActionObject {
    data: AttackActionData;
    enemy: Character;
}

interface AttackProcessActionData extends AttackActionData {
    attackdice?: number[];
    attackmodifier?: number;
    attacksuccess?: boolean;
    attackduration: number;
    fatigue: number;
    damagedice?: number[];
    damagemodifier?: number;
}

export interface AttackProcessActionObject extends AttackActionObject {
    attackroll: DiceRoll;
    wound?: WoundSingle;
    //damageroll: DiceRoll;
    data: AttackProcessActionData;
}

export class AttackActionFactory implements ActionFactory {

    build(character: Character,datainit: {time:number; target: {character:Character; location:string}; length:number; diameter: number;}): AttackActionObject {
        let enemy = datainit.target.character;
        let data = datainit as unknown as AttackActionData;
        data.target.character = enemy.id;
        data.type = 'attack';
        data.executed = false;
        data.limb = 'rightArm';
        let penalty = character.generalPenalty(data.time);
        let dice = new DiceRoll(4,50);
        data.delayDice = dice.result;
        data.time += Math.round(1000 * character.aspects.getPhysicalReactionTime(data.time,penalty,dice.result,false));

        character.actions.add(data);

        return {character, enemy, data};
    }

    buildFromStorage(character: Character,data: AttackActionData): AttackActionObject {
        let enemy = character.scene.getCharacter(data.target.character);
        return {character,enemy,data};
    }

    execute(action: AttackProcessActionObject) {
        if(!action.data.executed) {
            action.data.attackduration = 1000*action.character.aspects.getPhysicalActionTime(action.data.time,1,{targetedPenalty:0,genericPenalty:0,incidentalPenalty:0});
            action.data.nextExecution = action.data.time + action.data.attackduration;
            action.data.executed = true;

            action.data.fatigue = .02;
            action.character.fatigue.AddMuscleRate(action.data.time,action.data.fatigue/6,action.data.limb);
            action.character.fatigue.AddAerobicRate(action.data.time,action.data.fatigue);

            return;
        }  
        if(typeof action.data.nextExecution === "undefined") {
            return;
        }
            
        action.attackroll = new DiceRoll();
        action.data.attackdice = action.attackroll.result;
        action.data.attackmodifier = action.character.aspects.getBaseResult(action.data.time,'agility') - action.character.generalPenalty(action.data.nextExecution);
        action.attackroll.modifier = action.data.attackmodifier;
        
        action.character.fatigue.AddMuscleRate(action.data.nextExecution,-action.data.fatigue/6,action.data.limb);
        action.character.fatigue.AddAerobicRate(action.data.nextExecution,-action.data.fatigue);

        action.data.attacksuccess = action.attackroll.standardResult > action.enemy.PhysicalDefense(action.data.nextExecution);
        if(action.data.attacksuccess) {
            action.data.damagemodifier = action.character.aspects.getBaseResult(action.data.time,'brawn') - action.character.generalPenalty(action.data.nextExecution);
            let roll = new DiceRoll();
            action.data.damagedice = roll.result;
            roll.modifier = action.data.damagemodifier;

            let damage = 1000 * 10000 * (10 + roll.standardResult);
            let wound = action.enemy.wounds.ReceiveImpactDamage(action.data.nextExecution,damage,action.data.length,action.data.diameter,action.data.target.location);

            //if(wound.afflictions.length || wound.tap) {
                action.wound = wound;
            //}
            
            // apply fatigue
            // apply bleed
            // apply tap
            // create new actions for healing
        }

        action.data.endTime = action.data.nextExecution;
        action.data.nextExecution = undefined;
    }

}