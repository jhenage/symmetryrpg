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
}