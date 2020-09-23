import { Character } from 'src/app/model/character';
import { ActionData } from 'src/app/model/character/actions';
import { ActionFactory, ActionObject } from '../factory';

interface MoveActionData extends ActionData {
    path: {
        x: number; // destination
        y: number;
        speed: number; // fraction of max speed
        state?: string; // how much of this path has been processed. 
    }[];
}

export interface MoveActionObject extends ActionObject {
    data: MoveActionData;
}

interface MoveProcessActionData extends MoveActionData {
    fatigue: number;
    limbs: string[];
}

export interface MoveProcessActionObject extends MoveActionObject {
    data: MoveProcessActionData;
}

export class MoveActionFactory implements ActionFactory {

    build(character: Character,datainit: {time: number;path: {x: number;y: number;speed: number}[]}): MoveActionObject {
        let data = datainit as MoveActionData;
        data.type = 'move';
        data.executed = false;

        character.actions.add(data);

        return {character: character,data: data};
    }

    buildFromStorage(character: Character,data: MoveActionData): MoveActionObject {
        return {character:character,data:data};
    }

    execute(action: MoveProcessActionObject) {
        if(!action.data.executed) {
            action.data.fatigue = 0;
            action.data.executed = true;
            action.data.nextExecution = action.data.time;
            action.data.limbs = ["leftLeg","rightLeg"];
        }  
        if(typeof action.data.nextExecution === "undefined") {
            return;
        }
            
        for(let i = 0; i < action.data.path.length; i++) {
            if(action.data.path[i].state=="done") continue;
            if(!action.data.path[i].state) {
                let location = action.character.location(action.data.nextExecution);
                let speed = action.character.MaxSpeed(action.data.nextExecution,action.data.limbs,0) * action.data.path[i].speed;
                let distance = ((location.x-action.data.path[i].x)**2 + (location.y-action.data.path[i].y)**2)**.5;
                let duration = distance / speed; // in sec
                location.velx = (action.data.path[i].x - location.x) / duration;
                location.vely = (action.data.path[i].y - location.y) / duration;
                action.character.setLocation(location);
                action.data.fatigue = .08 * action.data.path[i].speed ** 2;
                action.character.fatigue.AddMuscleRate(action.data.nextExecution,action.data.fatigue/6,"leftLeg");
                action.character.fatigue.AddMuscleRate(action.data.nextExecution,action.data.fatigue/6,"rightLeg");
                action.character.fatigue.AddAerobicRate(action.data.nextExecution,action.data.fatigue);
                
            
                action.data.nextExecution += Math.round(1000*duration);
                action.data.path[i].state = "max";

                break;
            }
            if (action.data.path[i].state=="max") {
                action.data.path[i].state = "done";
                action.character.fatigue.AddMuscleRate(action.data.nextExecution,-action.data.fatigue/6,"leftLeg");
                action.character.fatigue.AddMuscleRate(action.data.nextExecution,-action.data.fatigue/6,"rightLeg");
                action.character.fatigue.AddAerobicRate(action.data.nextExecution,-action.data.fatigue);

               if(i == action.data.path.length-1) {
                    let location = {time:action.data.nextExecution,x:action.data.path[i].x,y:action.data.path[i].y,velx:0,vely:0};
                    action.character.setLocation(location);
                    action.data.endTime = action.data.nextExecution;
                    action.data.nextExecution = undefined;
                }
            }
        }
        
    }
}