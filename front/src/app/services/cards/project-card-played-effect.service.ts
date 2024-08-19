import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AdvancedRessourceType, RessourceType } from "../../types/global.type";
import { ProjectCardScalingProductionsService } from "./project-card-scaling-productions.service";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardPlayedEffectService {
	playedCardList: number [] = []
	clientPlayerState!: PlayerStateModel

	constructor(private scalingProductionService: ProjectCardScalingProductionsService){}

	setCardStockableRessource(card:ProjectCardModel, ressource: AdvancedRessourceType):void{
		if(!card.stock){
			card.stock = new Object()
		}
		card.stock[ressource]=0
	}
	addRessourceToCard(card:ProjectCardModel, ressource:AdvancedRessourceType, quantity:number):void{
		if(!card.stock || !card.stock.ressource){this.setCardStockableRessource(card, ressource)}
		card.stock[ressource] =  Number(card.stock[ressource]) + quantity
	}
	addRessourceToPlayer(ressource: RessourceType, quantity:number):void{
		this.clientPlayerState.addRessource(ressource, quantity)
	}
	addProductionToPlayer(ressource: RessourceType, quantity:number):void{
		this.clientPlayerState.addProduction(ressource, quantity)
	}
	addTrToPlayer(quantity:number):void{
		this.clientPlayerState.terraformingRating += quantity
	}
	playCard(card: ProjectCardModel, playerState: PlayerStateModel): PlayerStateModel {
		this.clientPlayerState = playerState
		this.clientPlayerState.playCard(card)

		switch(card.cardCode){
			//Decomposing Fungus
			case('20'):{
				this.addRessourceToCard(card, 'microbe', 2)
				break
			}
			//Farming Co-ops
			case('29'):{
				this.clientPlayerState.addRessource('plant', 3)
				break
			}
			//Physics Complex
			case('46'):{
				this.setCardStockableRessource(card,'science')
				break
			}
			//Tardigrades
			case('58'):{
				this.setCardStockableRessource(card, 'microbe')
				break
			}
			//Bribed Commitee
			case('69'):{
				this.addTrToPlayer(2)
				break
			}
			//Archaebacteria
			case('108'):{
				this.addProductionToPlayer('plant',1)
				break
			}
			//Dust Quarry
			case('129'):{
				this.addProductionToPlayer('steel',1)
				break
			}
			//Fuel factory
			case('135'):{
				this.addProductionToPlayer('megacredit', 1)
				this.addProductionToPlayer('titanium', 1)
				this.addRessourceToPlayer('heat', -3)
				break
			}
			//Giant Space Mirror
			case('141'):{
				this.addProductionToPlayer('heat',3)
				break
			}
			//Great Escarpment Consortium
			case('144'):{
				this.addProductionToPlayer('steel',1)
				break
			}
			//Heater
			case('145'):{
				this.addProductionToPlayer('plant',1)
				this.addRessourceToPlayer('plant',1)
				break
			}
			//Lichen
			case('155'):{
				this.addProductionToPlayer('plant',1)
				break
			}
			//Methane from Titan
			case('161'):{
				this.addProductionToPlayer('plant',2)
				this.addProductionToPlayer('heat',2)
				break
			}
			//Nitrophilic Moss
			case('171'):{
				this.addProductionToPlayer('plant',2)
				break
			}
			//Power plant
			case('175'):{
				this.addProductionToPlayer('heat',1)
				break
			}
			//Slash and Burn Agriculture
			case('182'):{
				this.addProductionToPlayer('plant',2)
				break
			}
			//Sponsor
			case('190'):{
				this.addProductionToPlayer('megacredit',2)
				break
			}
			//Trees
			case('198'):{
				this.addProductionToPlayer('plant',3)
				this.addRessourceToPlayer('plant',1)
				break
			}
			//Underground City
			case('201'):{
				this.addProductionToPlayer('megacredit',1)
				this.addProductionToPlayer('steel',1)
				break
			}
			//Undersees Vents
			case('202'):{
				this.addProductionToPlayer('card',1)
				this.addProductionToPlayer('heat',4)
				break
			}
			//Vesta Shipyard
			case('204'):{
				this.addProductionToPlayer('titanium',1)
				break
			}
			//Glacial Evaporation
			case('P29'):{
				this.addProductionToPlayer('heat',4)
				break
			}
			//Hematite Mining
			case('D29'):{
				this.addProductionToPlayer('card',2)
				this.addProductionToPlayer('steel',1)
				break
			}
		}

		for(let i=0 ;i<this.clientPlayerState.ressource.length; i++){
			let scalingProd =
				this.scalingProductionService.getScalingProduction(
					this.clientPlayerState.ressource[i].name,
					this.clientPlayerState.cards.played,
					this.clientPlayerState.tag
				)
			this.clientPlayerState.updateProductions(this.clientPlayerState.ressource[i].name, scalingProd)
		}

		return this.clientPlayerState
	}
}
