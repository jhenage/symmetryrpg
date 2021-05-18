import { Character } from 'src/app/model/character';
import { ActionData } from 'src/app/model/character/actions';
import { ActionObject } from '../object';
//import { ActionFactory, ActionObject } from '../factory';

interface MoveActionData extends ActionData {
    path: {
        x: number; // destination
        y: number;
        speed: number; // fraction of max speed
        state?: string; // how much of this path has been processed. 
    }[];
}

export class MoveActionObject extends ActionObject {
    data: MoveActionData;

    static Build(character: Character,datainit: {time: number;path: {x: number;y: number;speed: number}[]}): MoveActionObject {
        let data = datainit as MoveActionData;
        data.type = 'move';
        data.nextExecution = data.time;
        data.body = [{name:'leftLeg',intensity:0},{name:'rightLeg',intensity:0}];

       character.actions.add(data);

        return new this(character,data);
    }

    execute() {
        if(typeof this.data.nextExecution === "undefined") {
            return;
        }
            
        for(let i = 0; i < this.data.path.length; i++) {
            if(this.data.path[i].state=="done") continue;
            if(!this.data.path[i].state) {
                let location = this.character.location(this.data.nextExecution);
                let speed = this.character.MaxSpeed(this.data.nextExecution,this.data.body.map(x => x.name),0) * this.data.path[i].speed;
                let distance = ((location.x-this.data.path[i].x)**2 + (location.y-this.data.path[i].y)**2)**.5;
                let duration = distance / speed; // in sec
                location.velx = (this.data.path[i].x - location.x) / duration;
                location.vely = (this.data.path[i].y - location.y) / duration;
                this.character.setLocation(location);
                this.data.body.forEach(body => {
                    body.intensity = .08 * this.data.path[i].speed ** 2;
                    this.character.fatigue.AddMuscleRate(this.data.nextExecution,body.intensity,body.name);
                    this.character.fatigue.AddAerobicRate(this.data.nextExecution,body.intensity*3);
                });
                
            
                this.data.nextExecution += Math.round(1000*duration);
                this.data.path[i].state = "max";

                break;
            }
            if (this.data.path[i].state=="max") {
                this.data.path[i].state = "done";
                this.data.body.forEach(body => {
                    this.character.fatigue.AddMuscleRate(this.data.nextExecution,-body.intensity,body.name);
                    this.character.fatigue.AddAerobicRate(this.data.nextExecution,-body.intensity*3);
                });

               if(i == this.data.path.length-1) {
                    let location = {time:this.data.nextExecution,x:this.data.path[i].x,y:this.data.path[i].y,velx:0,vely:0};
                    this.character.setLocation(location);
                    this.data.endTime = this.data.nextExecution;
                    this.data.nextExecution = undefined;
                }
            }
        }
        
    }
}