import { Character } from 'src/app/model/character';
import { ActionData, RollData } from 'src/app/model/character/actions';
import { ActionObject } from '../object';

export class GenericActionObject extends ActionObject {

    static Build(character: Character,datainit: {time: number;aspect: string;skill?: string;}): ActionObject {
        let rolldata = {
            time:datainit.time,
            modifier:{
                aspect:datainit.aspect,
                skill:datainit.skill
            },
            dice: [],
        } as RollData;
        let data = {time:datainit.time,rolls:[rolldata]} as ActionData;
        data.type = 'generic';
        data.endTime = data.nextExecution = data.time;

        if(character.aspects.getAspectDescriptors(datainit.aspect)[0] == "body") {
            data.body = [{name:'full',intensity:0}];
        } else {
            data.body = [{name:'mental',intensity:0}];
        }

        character.actions.add(data);

        return new this(character,data);
    }

}