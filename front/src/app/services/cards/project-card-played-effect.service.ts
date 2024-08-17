import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { RessourceType } from "../../types/global.type";
import { PlayerStateModel } from "../../models/player-info/player-state.model";

const language = 'en'

@Injectable({
    providedIn: 'root'
})
export class ProjectCardPlayedEffectService {
	playedCardList: number [] = []
	clientPlayerState!: PlayerStateModel
	ressourceIndex = new  Map<RessourceType, number>(
		[
			['megacredit', 0],
			['heat', 1],
			['plant', 2],
			['steel', 3],
			['titanium', 4],
			['card', 5],
		]
	)
	payCardCost(card: ProjectCardModel):void{
		this.addRessource('megacredit', -card.cost)
	}
	addProduction(ressource: RessourceType, quantity: number){
		this.clientPlayerState.ressource[Number(this.ressourceIndex.get(ressource))].valueProd += quantity
	}
	addRessource(ressource: RessourceType, quantity: number){
		this.clientPlayerState.ressource[Number(this.ressourceIndex.get(ressource))].valueStock += quantity
	}
	playCard(card: ProjectCardModel, newPlayedCardList: number[], playerState: PlayerStateModel): PlayerStateModel {
		this.playedCardList = newPlayedCardList
		this.clientPlayerState = playerState

		this.payCardCost(card)

		switch(card.cardCode){
			case('135'):{
				this.addProduction('megacredit', 1)
				this.addProduction('titanium', 1)
				this.addRessource('heat', -3)
			}
		}

		return this.clientPlayerState
	}
}
