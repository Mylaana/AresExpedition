import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingVPService {
	public static getScalingVP(clientState: PlayerStateModel): number{
		let totalScalingVp: number = 0
		for(let card of clientState.getProjectPlayedModelList()){
			switch(card.cardCode){
				//Birds
				case("12"):{
					totalScalingVp += card.getStockValue('animal')
					break
				}
				//Fish
				case("30"):{
					totalScalingVp += card.getStockValue('animal')
					break
				}
				//Herbivore
				case("33"):{
					totalScalingVp += Math.floor(card.getStockValue('animal') / 2)
					break
				}
				//Interplanetary Relations
				case("35"):{
					let cardList = clientState.getProjectPlayedModelList()
					let valid: number = 0
					for(let c of cardList){
						if(c.cardType!='corporation'){valid++}
					}
					totalScalingVp += Math.floor(valid/4)
					break
				}
				//Livestock
				case("39"):{
					totalScalingVp += card.getStockValue('animal')
					break
				}
				//Physics Complex
				case("46"):{
					totalScalingVp += Math.floor(card.getStockValue('science') / 2)
					break
				}
				//Tardigrades
				case("58"):{
					totalScalingVp += Math.floor(card.getStockValue('microbe') / 3)
					break
				}
				//Think Tank
				case("59"):{
					totalScalingVp += Math.floor(clientState.getProjectPlayedIdList({type:'blueProject'}).length / 3)
					break
				}
				//Io Mining Industry
				case("153"):{
					totalScalingVp += clientState.getTagsOfType('jovian')
					break
				}
				//Pets
				case("F07"):{
					totalScalingVp += Math.floor(card.getStockValue('animal') / 2)
					break
				}
			}
		}
		return totalScalingVp
	}
}
