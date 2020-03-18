import { Character } from './character'

interface CampaignData {
    characters: number[];
    archivedCharacters: number[];
    now: number; // The current time
}

export class Campaign {

    protected _data: CampaignData;

    characters: Character[];

    constructor(data: CampaignData) {
        this._data = data;
    }


}