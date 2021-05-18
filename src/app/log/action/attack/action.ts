import { Character } from 'src/app/model/character';
import { DiceRoll } from 'src/app/model/diceroll';
import { ActionData } from 'src/app/model/character/actions';
import { ActionObject } from '../object';
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

export class AttackActionObject extends ActionObject {
    data: AttackActionData;

    static Build(character: Character,datainit: {time:number; target: {character:Character; location:string}; length:number; diameter: number;}): AttackActionObject {
        let enemy = datainit.target.character;
        let data = datainit as unknown as AttackActionData;
        data.target.character = enemy.id;
        data.type = 'attack';
        data.limb = 'rightArm';
        let penalty = character.generalPenalty(data.time);
        let dice = new DiceRoll(4,50);
        data.delayDice = dice.result;
        data.time += Math.round(1000 * character.aspects.getPhysicalReactionTime(data.time,penalty,dice.result,false));

        character.actions.add(data);

        return new this(character,data);
    }

    get enemy() {
        return this.character.scene.getCharacter(this.data.target.character);
    }

//    execute() {
//        if(!this.data.executed) {
//            this.data.attackduration = 1000*this.character.aspects.getPhysicalActionTime(this.data.time,1,{targetedPenalty:0,genericPenalty:0,incidentalPenalty:0});
//            this.data.nextExecution = this.data.time + this.data.attackduration;
//            this.data.executed = true;
//
//            this.data.fatigue = .02;
//            this.character.fatigue.AddMuscleRate(this.data.time,this.data.fatigue/6,this.data.limb);
//            this.character.fatigue.AddAerobicRate(this.data.time,this.data.fatigue);
//
//            return;
//        }  
//        if(typeof this.data.nextExecution === "undefined") {
//            return;
//        }
//            
//        this.attackroll = new DiceRoll();
//        this.data.attackdice = this.attackroll.result;
//        this.data.attackmodifier = this.character.aspects.getBaseResult(this.data.time,'agility') - this.character.generalPenalty(this.data.nextExecution);
//        this.attackroll.modifier = this.data.attackmodifier;
//        
//        this.character.fatigue.AddMuscleRate(this.data.nextExecution,-this.data.fatigue/6,this.data.limb);
//        this.character.fatigue.AddAerobicRate(this.data.nextExecution,-this.data.fatigue);
//
//        this.data.attacksuccess = this.attackroll.standardResult > this.enemy.PhysicalDefense(this.data.nextExecution);
//        if(this.data.attacksuccess) {
//            this.data.damagemodifier = this.character.aspects.getBaseResult(this.data.time,'brawn') - this.character.generalPenalty(this.data.nextExecution);
//            let roll = new DiceRoll();
//            this.data.damagedice = roll.result;
//            roll.modifier = this.data.damagemodifier;
//
//            let damage = 1000 * 10000 * (10 + roll.standardResult);
//            let wound = this.enemy.wounds.ReceiveImpactDamage(this.data.nextExecution,damage,this.data.length,this.data.diameter,this.data.target.location);
//
//            //if(wound.afflictions.length || wound.tap) {
//                this.wound = wound;
//            //}
//            
//            // apply fatigue
//            // apply bleed
//            // apply tap
//            // create new actions for healing
//        }
//
//        this.data.endTime = this.data.nextExecution;
//        this.data.nextExecution = undefined;
//    }

}