import { Injectable } from "@angular/core";
import { GameContentName, TagType } from "../../types/global.type";
import { GAME_TAG_GROUP_VANILLA_BIO, GAME_TAG_GROUP_VANILLA_BUILD, GAME_TAG_GROUP_VANILLA_EVENT, GAME_TAG_GROUP_VANILLA_OTHER, GAME_TAG_GROUP_VANILLA_PLANET, GAME_TAG_GROUP_VANILLA_TECH } from "../../global/global-const";
import { GAME_OPTIONS_TEMPLATE } from "../../maps/const-maps";

@Injectable({
    providedIn: 'root'
})
export class GameActiveContentService{

	private gameOptionsLoaded = false
	private activeContent: TagType[] = []

    private options: Record<GameContentName, boolean> = {...GAME_OPTIONS_TEMPLATE}

	setGameOptions(options: Partial<Record<GameContentName, boolean>>){
		if(this.gameOptionsLoaded){return}
		for(let k in options){
			let key = k as GameContentName
			let v = options[key]
			if(v){
				this.options[key] = v
			}
		}
		let build = GAME_TAG_GROUP_VANILLA_BUILD
        let tech = GAME_TAG_GROUP_VANILLA_TECH
        let planet = GAME_TAG_GROUP_VANILLA_PLANET
        let bio = GAME_TAG_GROUP_VANILLA_BIO
        let other = GAME_TAG_GROUP_VANILLA_OTHER
        let event = GAME_TAG_GROUP_VANILLA_EVENT

        if(this.isContentActive('expansionMoon')){planet.push('moon')}
		this.activeContent = build.concat(tech, planet, bio, other, event)
		this.gameOptionsLoaded = true
	}
    isContentActive(content: GameContentName): boolean {
        if(!(content in this.options) || !this.options[content]){return false}
        return this.options[content]
    }
    getTagListFromActiveContent(): TagType[]{
        return this.activeContent
    }
	getActiveContentList(): GameContentName[] {
		return (Object.keys(this.options) as GameContentName[])
			.filter(key => this.options[key])
	}
}
