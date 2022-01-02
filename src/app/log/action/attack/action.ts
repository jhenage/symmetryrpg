import { Character, Strike } from 'src/app/model/character';
import { DiceRoll } from 'src/app/model/diceroll';
import { ActionData } from 'src/app/model/character/actions';
import { ActionObject } from '../object';
import { WoundSingle } from 'src/app/model/character/wounds';

interface AttackActionData extends ActionData {
    target: {
        character: number;
        location: string;
    }
    strike: number;
    buildup: number; // Buildup is the distance of the attack path, 0 for quickest and 100 for maximum power.
}

export class AttackActionObject extends ActionObject {
    data: AttackActionData;

    static Build(character: Character,datainit: {time:number; target: {character:Character; location:string}; strike: number, buildup: number}, effort: number): AttackActionObject {
        let enemy = datainit.target.character;
        let data = datainit as unknown as AttackActionData;
        data.target.character = enemy.id;
        data.type = 'attack';
        let strike = character.strikes[data.strike];
        data.body = strike.location.map((name) => {return {name,effort};});
        //let penalty = character.generalPenalty(data.time);
        //let dice = new DiceRoll(4,50);
        //data.delayDice = dice.result;
        //data.time += Math.round(1000 * character.aspects.getPhysicalReactionTime(data.time,penalty,dice.result,false));

        character.actions.add(data);

        return new this(character,data);
    }

    get enemy(): Character {
        return this.character.scene.getCharacter(this.data.target.character);
    }

    get strike(): Strike {
        return this.character.strikes[this.data.strike];
    }

    createAttackRoll() {
        let start = this.data.time;
        let distance = 1 //this.strike.timing.average;
        if(this.data.buildup < 50) {
            // average - minimum = 50 - buildup
        }
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