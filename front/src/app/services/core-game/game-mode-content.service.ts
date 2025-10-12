import { Injectable } from "@angular/core";
import { GameModeContent, TagType } from "../../types/global.type";
import { GAME_TAG_LIST, GAME_TAG_LIST_VANILLA } from "../../global/global-const";

@Injectable({
    providedIn: 'root'
})
export class GameModeContentService{
    private options: Partial<Record<GameModeContent, boolean>> = {
        'expansionMoon': true,
    }
    isContentActive(content: GameModeContent): boolean {
        if(!(content in this.options) || !this.options[content]){return false}
        return this.options[content]
    }
    getTagListFromActiveContent(): TagType[]{
        let result = GAME_TAG_LIST_VANILLA
        if(this.isContentActive('expansionMoon')){result.push('moon')}
        return result
    }
}