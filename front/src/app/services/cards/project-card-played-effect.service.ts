import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AdvancedRessourceType, GlobalParameterName, RessourceType } from "../../types/global.type";
import { ProjectCardScalingProductionsService } from "./project-card-scaling-productions.service";
import { EventModel } from "../../models/core-game/event.model";
import { GlobalParameter, RessourceStock, RessourceState, CardRessourceStock } from "../../interfaces/global.interface";
import { CostMod } from "../../types/project-card.type";
import { GlobalTagInfoService } from "../global/global-tag-info.service";
import { AdvancedRessourceStock } from "../../interfaces/global.interface";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPlayedEffectService {
	playedCardList: number [] = []
	clientPlayerState!: PlayerStateModel

	constructor(
		private scalingProductionService: ProjectCardScalingProductionsService,
		private tagInfoService: GlobalTagInfoService
	){}
	addRessourceToCard(card: ProjectCardModel, ressource: AdvancedRessourceStock): void {
		card.addRessourceToStock(ressource)
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
				this.addRessourceToCard(card, {name: 'microbe',valueStock: 2})
				break
			}
			//Farming Co-ops
			case('29'):{
				//this.clientPlayerState.addRessource('plant', 3)
				break
			}
			//Physics Complex
			case('46'):{
				//this.setCardStockableRessource(card,'science')
				break
			}
			//Tardigrades
			case('58'):{
				//this.setCardStockableRessource(card, 'microbe')
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
			//Soil Warming
			case('184'):{
				this.addProductionToPlayer('plant',2)
				break
			}
			//Sponsor
			case('190'):{
				this.addProductionToPlayer('megacredit',2)
				break
			}
			//Trapped Heat
			case('197'):{
				this.addProductionToPlayer('heat',2)
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
			//Hematite Mining
			case('D29'):{
				this.addProductionToPlayer('card',2)
				this.addProductionToPlayer('steel',1)
				break
			}
			//Industrial Complex
			case('D32'):{
				this.addProductionToPlayer('heat',4)
				break
			}
			//Award Winning Reflector Material
			case('D35'):{
				this.addProductionToPlayer('heat',3)
				//TO DO : ADD OBJECTIVE BONUS
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
			//Grain Silos
			case('F14'):{
				this.addRessourceToPlayer('plant',4)
				break
			}
		}

		for(let i=0 ;i<this.clientPlayerState.ressource.length; i++){
			let scalingProd =
				this.scalingProductionService.getScalingProduction(
					this.clientPlayerState.ressource[i].name,
					this.clientPlayerState.cards.getProjectIdList(),
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
			//Artificial Lake
			case('66'):{
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
				break
			}
			//Convoy from Europa
			case('74'):{
				result.push(this.createEventDraw(1))
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
				break
			}
			//Giant Ice Asteroid
			case('77'):{
				result.push(this.createEventIncreaseGlobalParameter("temperature",2))
				result.push(this.createEventIncreaseGlobalParameter("ocean",2))
				break
			}
			//Deimos Down
			case('76'):{
				result.push(this.createEventIncreaseGlobalParameter("temperature",3))
				break
			}
			//Permafrost Extraction
			case('92'):{
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
				break
			}
			//Phobos Falls
			case('93'):{
				result.push(this.createEventIncreaseGlobalParameter("temperature",1))
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
				result.push(this.createEventDraw(2))
				break
			}
			//Research
			case('96'):{
				result.push(this.createEventDraw(2))
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
			//Soil Warming
			case('184'):{
				result.push(this.createEventIncreaseGlobalParameter("temperature",1))
				break
			}
			//Trapped Heat
			case('197'):{
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
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
			//Architecture Blueprints
			case('F09'):{
				result.push(this.createEventIncreaseGlobalParameter("infrastructure",1))
				result.push(this.createEventDraw(2))
				result.push(this.createEventDiscard(1))
				break
			}
			//Bedrock Wellbore
			case('F10'):{
				result.push(this.createEventIncreaseGlobalParameter("ocean",1))
				result.push(this.createEventIncreaseGlobalParameter("infrastructure",1))
				break
			}
			//CHP Combustion Turbines
			case('F12'):{
				result.push(this.createEventIncreaseGlobalParameter("infrastructure",1))
				result.push(this.createEventIncreaseGlobalParameter("oxygen",1))
				result.push(this.createEventIncreaseGlobalParameter("temperature",1))
				break
			}
			//Grain Silos
			case('F14'):{
				result.push(this.createEventIncreaseGlobalParameter("infrastructure",2))
				break
			}
			//Low-Atmosphere Planes
			case('F17'):{
				result.push(this.createEventIncreaseGlobalParameter("infrastructure",3))
				break
			}
			default:{
				return undefined
			}
		}
		return result
	}
	
	getCostModFromTriggers(mod: CostMod): number {
		if(!mod || !mod.playedTriggersList){return 0}
		let newMod: number = 0
		let tags: number[] = []
		
		if(mod.tagList!=undefined){
			tags = mod.tagList.filter((e, i) => e !== -1); 
		}
		for(let triggerId of mod.playedTriggersList){
			newMod += this.calculateCostModFromTrigger(triggerId, mod)
		}

		return newMod
	}
	calculateCostModFromTrigger(triggerId: number, mod:CostMod): number {
		if(!mod || !mod.tagList){return 0}
		let costMod: number = 0

		switch(triggerId){
			//Energy Subsidies
			case(25):{
				if(mod.tagList.includes(this.tagInfoService.getTagIdFromType('power'))!=true){break}
				costMod += 4
				break
			}
			//Interplanetary Conference
			case(37):{
				if(mod.tagList.includes(this.tagInfoService.getTagIdFromType('earth'))===true){costMod += 3}
				if(mod.tagList.includes(this.tagInfoService.getTagIdFromType('jovian'))===true){costMod += 3}
				break
			}
		}

		return costMod
	}
	getEventTriggerByPlayedCard(playedCard: ProjectCardModel, triggerIdList: number[]): EventModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByPlayedCard(triggerId, playedCard.tagsId, triggerId===playedCard.id)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	generateEventTriggerByPlayedCard(triggerId: number, playedCardTags: number[], cardPlayedIsTheTrigger: boolean): EventModel[] | undefined {
		let result: EventModel[] = []

		switch(triggerId){
			//Energy Subsidies
			case(25):{
				if(playedCardTags.includes(this.tagInfoService.getTagIdFromType('power'))!=true){break}
				result.push(this.createEventDraw(1))
				break
			}
			//Interplanetary Conference
			case(37):{
				//self triggering excluded
				if(cardPlayedIsTheTrigger===true){break}
				if(
					playedCardTags.includes(this.tagInfoService.getTagIdFromType('earth'))!=true
					&& playedCardTags.includes(this.tagInfoService.getTagIdFromType('jovian'))!=true
				){break}
				result.push(this.createEventDraw(1))
				break
			}
			//Optimal Aerobraking
			case(45):{
				if(playedCardTags.includes(this.tagInfoService.getTagIdFromType('event'))!=true){break}
				result.push(
					this.createEventAddRessource([
					{name: 'plant', valueStock: 2},
					{name: 'heat', valueStock: 2}])
				)
				break
			}
			//Bacterial Aggregate
			case(222):{
				if(playedCardTags.includes(this.tagInfoService.getTagIdFromType('earth'))!=true){break}
				result.push(this.createEventAddRessourceToCard({name:'microbe', valueStock: 1},triggerId))
				break
			}
			default:{
				return
			}
		}

		return result
	}

	getEventTriggerByRessourceAddedToCard(targetCard: ProjectCardModel, triggerIdList: number[], ressource: AdvancedRessourceStock): EventModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByRessourceAddedToCard(triggerId, targetCard, ressource)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}

	generateEventTriggerByRessourceAddedToCard(triggerId: number, targetCard: ProjectCardModel, ressource: AdvancedRessourceStock): EventModel[] | undefined {
		let result: EventModel[] = []

		switch(triggerId){
			//Bacterial Aggregate
			case(222):{
				if(ressource.name!!='microbe'||ressource.valueStock<1){break}
				if(targetCard.getStockValue('microbe')>5){break}
				result.push(this.createEventIncreaseResearchScan(1))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	getTriggerListToDeactivate(state: PlayerStateModel): number[] {
		let result: number[] = []
		for(let trigger of state.cards.getTriggersIdList()){
			if(this.checkTriggerShouldDeactivate(trigger, state)===true){
				result.push(trigger)
			}
		}
		return result
	}
	checkTriggerShouldDeactivate(triggerId:number, state: PlayerStateModel): boolean {
		switch(triggerId){
			//Bacterial Aggregate
			case(222):{
				return state.cards.getCardStockValue(triggerId, 'microbe') >= 5
			}
			default:{
				return false
			}
		}
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
	createEventIncreaseGlobalParameter(parameterName: GlobalParameterName, steps:number): EventModel {
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
			addEndOfPhase: steps,
			value: 0
		}
		newEvent.value = parameter

		this.addTrToPlayer(steps)

		return newEvent
	}
	createEventAddRessource(gain: RessourceStock | RessourceStock[]): EventModel {
		let newEvent = new EventModel

		newEvent.type = 'ressourceGain'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			title: 'Increase Global parameter',
			selectedIdList: [],
		}
		newEvent.value = gain

		return newEvent
	}
	createEventAddRessourceToCard(gain: AdvancedRessourceStock | AdvancedRessourceStock[], cardId: number): EventModel {
		let newEvent = new EventModel
		let newGain: AdvancedRessourceStock[] = []

		newEvent.type = 'cardRessourceGain'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			title: 'Increase Global parameter',
			selectedIdList: [],
		}		

		if(Array.isArray(gain)){
			newGain = gain
		} else {
			newGain = []
			newGain.push(gain)
		}

		newEvent.value = {cardId: cardId,stock: newGain}

		return newEvent
	}
	createEventIncreaseResearchScan(scan: number): EventModel {
		let newEvent = new EventModel
		let newGain: AdvancedRessourceStock[] = []

		newEvent.type = 'increaseResearchScanValue'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			title: 'Increase Global parameter',
			selectedIdList: [],
		}		

		newEvent.value = scan

		return newEvent
	}
}
