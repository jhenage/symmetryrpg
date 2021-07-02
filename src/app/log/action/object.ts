import { Character } from 'src/app/model/character';
import { ActionData } from 'src/app/model/character/actions';

export class ActionObject {
    character: Character;
    data: ActionData;

    constructor(character: Character,data: ActionData) {
        this.character = character;
        this.data = data;
    }

    execute() {
        if(typeof this.data.nextExecution != 'undefined') {
            this.data.nextExecution = undefined;
            let duration = this.data.endTime - this.data.time;
            if(duration>0) {
                this.data.body.forEach((body)=>{
                    if(body.effort) {
                        this.character.fatigue.addMuscleRate(this.data.time,body.effort/6,body.name);
                        this.character.fatigue.addMuscleRate(this.data.endTime,-body.effort/6,body.name);
                        this.character.fatigue.addAerobicRate(this.data.time,body.effort);                
                        this.character.fatigue.addAerobicRate(this.data.endTime,-body.effort);                
                    }
                })
            }
        }
    }

    protected getBaseReactionTime(symmetric:number): number { // return milliseconds
        if(symmetric < -1) return 26 + 16 * symmetric * symmetric;
        if(symmetric < 4) return 38 - 4 * symmetric;
        if(symmetric < 7) return 30 - 2 * symmetric;
        return Math.max(1,26.5 - 1.5 * symmetric);
    }
    getSurpriseMultiplier(symmetric: number): number {
        if(symmetric < 0) return 10 - symmetric;
        return Math.max(2, 10 - 0.4 * symmetric);
    }


    getPhysicalReactionTime(time: number, modifier: number, isSurprised: boolean): number { // return milliseconds
        let result = this.getBaseReactionTime(this.character.aspects.current(time,'awareness') + 5 + modifier) * this.character.creatureType.quickness.mental;
        result += this.getBaseReactionTime(this.character.aspects.current(time,'reflex') + modifier) * this.character.creatureType.quickness.physical;
        if(isSurprised) result *= this.getSurpriseMultiplier(this.character.aspects.current(time,'reflex') + modifier);
        return result;
    }
    

    getMentalReactionTime(time: number, modifier: number, isSurprised: boolean): number { // return milliseconds
        let result = this.getBaseReactionTime(this.character.aspects.current(time,'awareness') + modifier) * this.character.creatureType.quickness.mental;
        result += this.getBaseReactionTime(this.character.aspects.current(time,'reflex') + 5 + modifier) * this.character.creatureType.quickness.physical;
        if(isSurprised) result *= this.getSurpriseMultiplier(this.character.aspects.current(time,'awareness') + modifier);
        return result;
    }
}