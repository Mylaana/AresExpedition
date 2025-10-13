import { Injectable } from "@angular/core";
import { GameModeContent, TagType } from "../../types/global.type";
import { GAME_TAG_GROUP_VANILLA_BIO, GAME_TAG_GROUP_VANILLA_BUILD, GAME_TAG_GROUP_VANILLA_EVENT, GAME_TAG_GROUP_VANILLA_OTHER, GAME_TAG_GROUP_VANILLA_PLANET, GAME_TAG_GROUP_VANILLA_TECH } from "../../global/global-const";

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
        let build = GAME_TAG_GROUP_VANILLA_BUILD
        let tech = GAME_TAG_GROUP_VANILLA_TECH
        let planet = GAME_TAG_GROUP_VANILLA_PLANET
        let bio = GAME_TAG_GROUP_VANILLA_BIO
        let other = GAME_TAG_GROUP_VANILLA_OTHER
        let event = GAME_TAG_GROUP_VANILLA_EVENT

        if(this.isContentActive('expansionMoon')){planet.push('moon')}
        return build.concat(tech, planet, bio, other, event)
    }
}
