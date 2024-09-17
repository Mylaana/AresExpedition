import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AdvancedRessourceType, GlobalParameterName, RessourceType } from "../../types/global.type";
import { ProjectCardScalingProductionsService } from "./project-card-scaling-productions.service";
import { EventModel } from "../../models/core-game/event.model";
import { GlobalParameter } from "../../interfaces/global.interface";


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
			//Deimos Down
			case('76'):{
				this.addRessourceToPlayer("megacredit", 7)
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
			//Microprocessor
			case('163'):{
				this.addProductionToPlayer('heat',3)
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
			//Smelting
			case('183'):{
				this.addProductionToPlayer('heat',5)
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
			//Biofoundries
			case('D22'):{
				this.addProductionToPlayer('plant',2)
				break
			}
			//Industrial Complex
			case('D32'):{
				this.addProductionToPlayer('heat',4)
				break
			}
			//Hematite Mining
			case('D29'):{
				this.addProductionToPlayer('card',2)
				this.addProductionToPlayer('steel',1)
				break
			}
			//Perfluorocarbon Production
			case('D37'):{
				this.addProductionToPlayer('heat',1)
				break
			}
			//Biological Factories
			case('D40'):{
				this.addProductionToPlayer('plant',1)
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
	/**
	 * 
	 * @param card 
	 * @returns Event List
	 
	* Events should be filled to the list according to their order of execution.
	 */
	getPlayedCardEvent(card: ProjectCardModel): EventModel[] | undefined{
		let result: EventModel[] = []
		switch(card.cardCode){
			//Deimos Down
			case('76'):{
				result.push(this.createEventIncreaseGlobalParameter("temperature",3))
				break
			}
			//Microprocessor
			case('163'):{
				result.push(this.createEventDraw(2))
				break
			}
			//Smelting
			case('183'):{
				result.push(this.createEventDraw(2))
				result.push(this.createEventDiscard(1))
				break
			}
			//Biofoundries
			case('D22'):{
				result.push(this.createEventUpgradePhaseCard(1))
				break
			}
			//Industrial Complex
			case('D32'):{
				result.push(this.createEventUpgradePhaseCard(1))
				break
			}
			//Perfluorocarbon Production
			case('D37'):{
				result.push(this.createEventUpgradePhaseCard(1, [0]))
				break
			}
			//Biological Factories
			case('D40'):{
				result.push(this.createEventUpgradePhaseCard(1, [3]))
				break
			}
			default:{
				return undefined
			}
		}
		return result
	}
	createEventDraw(drawNumber: number): EventModel {
		let newEvent = new EventModel
		newEvent.type = 'drawCards'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			title: 'Draw cards',
			selectedIdList: [],
		}
		newEvent.value = drawNumber
		
		return newEvent
	}
	createEventDiscard(discardNumber: number): EventModel {
		let newEvent = new EventModel
		newEvent.type = 'discardCards'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: discardNumber,
			selectionQuantityTreshold: 'equal',
			title: `Select ${discardNumber} card(s) to discard.`,
			selectedIdList: [],
			cardInitialState: {selectable: true, ignoreCost: true},
		}	
		newEvent.value = discardNumber
		
		return newEvent
	}
	/**
	 * 
	 * @param phaseCardList 
	 * @returns newEvent
	 * 
	 * undefined phaseCardList will be treated as all phase cards being upgradable
	 */
	createEventUpgradePhaseCard(phaseCardUpgradeNumber: number, phaseCardList?: number[]): EventModel {
		let newEvent = new EventModel
		newEvent.type = 'upgradePhase'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: phaseCardUpgradeNumber,
			selectionQuantityTreshold: 'equal',
			title: 'Select a phase card to upgrade',
			selectedIdList: [],
		}
		if(phaseCardList){
			newEvent.value = phaseCardList
		}
		
		return newEvent
	}

	createEventIncreaseGlobalParameter(parameterName: GlobalParameterName, value:number): EventModel {
		let newEvent = new EventModel
		let parameter: GlobalParameter

		newEvent.type = 'increaseGlobalParameter'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			title: 'Increase Global parameter',
			selectedIdList: [],
		}
		parameter = {
			name: parameterName,
			addEndOfPhase: value,
			value: 0
		}
		newEvent.value = parameter

		return newEvent
	}
}
