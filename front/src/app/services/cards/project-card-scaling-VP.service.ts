import { Injectable } from "@angular/core";
import { TagInfo } from "../../interfaces/global.interface";
import { TagType } from "../../types/global.type";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingVPService {
	public static getScalingVP(playedCards: PlayableCardModel[], clientState: PlayerStateModel): number{
		let totalScalingVp: number = 0
		for(let card of playedCards){
			switch(card.cardCode){
				//Physics Complex
				case("46"):{
					totalScalingVp += Math.floor(card.getStockValue('science') / 2)
					break
				}
				//Io Mining Industry
				case("153"):{
					totalScalingVp += clientState.getTagsOfType('jovian')
					break
				}
			}
		}
		return totalScalingVp
	}
}
