import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { RessourceStock, TagInfo } from "../../interfaces/global.interface";
import { TagType } from "../../types/global.type";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPrerequisiteEffectService {
	constructor(){}
	static isPrerequisiteOk(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		switch(card.cardCode){
			//AI Central
			case('4'):{
				console.log(card.title, this.hasEnoughTags('science', 5, clientState))
				return this.hasEnoughTags('science', 5, clientState)
			}
			default:{
				return true
			}
		}
	}
	private static hasEnoughRessources(ressource: RessourceStock, clientState: PlayerStateModel): boolean {
		return false
	}
	private static hasEnoughTags(tagType: TagType, tagNumber: number, clientState: PlayerStateModel): boolean {
		let tags = clientState.getTags()
		for(let tag of tags){
			if(tag.name!=tagType){continue}
			return tag.valueCount>=tagNumber
		}
		return false
	}
}
