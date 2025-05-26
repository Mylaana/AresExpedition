import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { MinMaxEqualTreshold, RessourceStock } from "../../interfaces/global.interface";
import { MinMaxEqualType, TagType } from "../../types/global.type";
import { Utils } from "../../utils/utils";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPrerequisiteEffectService {
	constructor(){}
	static isPrerequisiteOk(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		switch(card.cardCode){
			//AI Central
			case('4'):{
				return this.isTagNumberOk('science', 5, clientState, 'min')
			}
			//Physics Complex
			case('46'):{
				return this.isTagNumberOk('science', 4, clientState, 'min')
			}
			default:{
				return true
			}
		}
	}
	private static isRessourcesNumberOk(ressource: RessourceStock, clientState: PlayerStateModel, treshold: MinMaxEqualTreshold): boolean {
		return false
	}
	private static isTagNumberOk(tagType: TagType, requiredTagNumber: number, clientState: PlayerStateModel, treshold: MinMaxEqualType): boolean {
		let tags = clientState.getTags()
		for(let tag of tags){
			if(tag.name!=tagType){continue}
			return Utils.getValueVsTreshold({treshold: treshold, tresholdValue: requiredTagNumber, value: tag.valueCount})
		}
		return false
	}
}
