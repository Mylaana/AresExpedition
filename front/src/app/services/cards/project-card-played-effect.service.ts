import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { PlayableCardType, RessourceType } from "../../types/global.type";
import { ProjectCardScalingProductionsService } from "./project-card-scaling-productions.service";
import { EventBaseModel, EventCardSelector } from "../../models/core-game/event.model";
import { RessourceStock, GlobalParameterValue, ScanKeep, RessourceInfo } from "../../interfaces/global.interface";
import { CostMod } from "../../types/project-card.type";
import { AdvancedRessourceStock } from "../../interfaces/global.interface";
import { EventDesigner } from "../designers/event-designer.service";
import { GlobalInfo } from "../global/global-info.service";
import { GlobalParameterNameEnum } from "../../enum/global.enum";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPlayedEffectService {
	playedCardList: number [] = []
	clientPlayerState!: PlayerStateModel

	constructor(
		private scalingProductionService: ProjectCardScalingProductionsService
	){}
	addRessourceToCard(card: PlayableCardModel, ressource: AdvancedRessourceStock): void {
		card.addRessourceToStock(ressource)
	}
	addRessourceToPlayer(ressource: RessourceType, quantity:number):void{
		this.clientPlayerState.addRessource(ressource, quantity)
	}
	addProductionToPlayer(ressource: RessourceType, quantity:number):void{
		this.clientPlayerState.addProduction(ressource, quantity)
	}
	addTrToPlayer(quantity:number):void{
		this.clientPlayerState.addTR(quantity)
	}
	playCard(card: PlayableCardModel, playerState: PlayerStateModel, cardType: PlayableCardType): PlayerStateModel {
		this.clientPlayerState = playerState
		this.clientPlayerState.playCard(card, cardType)

		//add starting megacredits
		if(card.startingMegacredits){
			this.addRessourceToPlayer('megacredit', card.startingMegacredits)
		}

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
			//Imported Nitrogen
			case('81'):{
				this.addRessourceToPlayer("plant", 4)
				this.addTrToPlayer(1)
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
				if(this.clientPlayerState.getMilestoneCompleted()>0){
					this.addRessourceToPlayer('heat', 4)
				}
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
			//Innovative Technologies Award
			case('P26'):{
				this.addTrToPlayer(this.clientPlayerState.getPhaseCardUpgradedCount())
				break
			}
			//Tourism
			case('P30'):{
				this.addProductionToPlayer('megacredit',2)
				this.addTrToPlayer(this.clientPlayerState.getMilestoneCompleted())
				break
			}
		}

		let playerRessources: RessourceInfo[] = this.clientPlayerState.getRessources()
		for(let i=0 ;i<playerRessources.length; i++){
			let scalingProd =
				this.scalingProductionService.getScalingProduction(
					playerRessources[i].name,
					this.clientPlayerState.getProjectPlayedIdList(),
					this.clientPlayerState.getTags()
				)
			this.clientPlayerState.setScalingProduction(playerRessources[i].name, scalingProd)
		}

		return this.clientPlayerState
	}
	/**
	 *
	 * @param card
	 * @returns Event List

	* Events should be filled to the list according to their order of execution.
	 */
	getPlayedCardEvent(card: PlayableCardModel): EventBaseModel[] | undefined{
		let result: EventBaseModel[] = []
		switch(card.cardCode){
			//Interns
			case('36'):{
				result.push(this.createEventIncreaseResearchScanKeep({keep:0, scan:2}))
				break
			}
			//Artificial Lake
			case('66'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Convoy from Europa
			case('74'):{
				result.push(this.createEventDraw(1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Giant Ice Asteroid
			case('77'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				break
			}
			//Deimos Down
			case('76'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,3))
				break
			}
			//Imported Nitrogen
			case('81'):{
				result.push(this.createEventAddRessourceToSelectedCard({name:'animal', valueStock:2}))
				result.push(this.createEventAddRessourceToSelectedCard({name:'microbe', valueStock:3}))
				break
			}
			//Invention Contest
			case('83'):{
				result.push(this.createEventScanKeep({scan:3, keep:1}))
				break
			}
			//Permafrost Extraction
			case('92'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Phobos Falls
			case('93'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
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
				result.push(this.createEventDiscard(1))
				result.push(this.createEventDraw(2))
				break
			}
			//Smelting
			case('183'):{
				result.push(this.createEventDraw(2))
				break
			}
			//Soil Warming
			case('184'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				break
			}
			//Trapped Heat
			case('197'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
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
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				result.push(this.createEventDraw(2))
				result.push(this.createEventDiscard(1))
				break
			}
			//Bedrock Wellbore
			case('F10'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				break
			}
			//CHP Combustion Turbines
			case('F12'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				break
			}
			//Grain Silos
			case('F14'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,2))
				break
			}
			//Low-Atmosphere Planes
			case('F17'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,3))
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
				if(mod.tagList.includes(GlobalInfo.getIdFromType('power','tag'))!=true){break}
				costMod += 4
				break
			}
			//Interplanetary Conference
			case(37):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))===true){costMod += 3}
				if(mod.tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))===true){costMod += 3}
				break
			}
		}

		return costMod
	}
	getEventTriggerByPlayedCard(playedCard: PlayableCardModel, triggerIdList: number[], state: PlayerStateModel): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByPlayedCard(triggerId, playedCard, state)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	generateEventTriggerByPlayedCard(triggerId: number, playedCard: PlayableCardModel, state: PlayerStateModel): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []

		switch(triggerId){

			default:{
				return
			}
		}

		return result
	}
	getTriggerByTagGained(playedCard: PlayableCardModel, triggerIdList: number[]): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByTagGained(triggerId, playedCard)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	generateEventTriggerByTagGained(triggerId: number, playedCard: PlayableCardModel): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []
		let playedCardTags = playedCard.tagsId
		let cardPlayedIsTheTrigger = triggerId===playedCard.id

		switch(triggerId){
			//Energy Subsidies
			case(25):{
				if(playedCardTags.includes(GlobalInfo.getIdFromType('power','tag'))!=true){break}
				result.push(this.createEventDraw(1))
				break
			}
			//Interplanetary Conference
			case(37):{
				//self triggering excluded
				if(cardPlayedIsTheTrigger===true){break}
				if(
					playedCardTags.includes(GlobalInfo.getIdFromType('earth','tag'))!=true
					&& playedCardTags.includes(GlobalInfo.getIdFromType('jovian','tag'))!=true
				){break}
				result.push(this.createEventDraw(1))
				break
			}
			//Optimal Aerobraking
			case(45):{
				if(playedCardTags.includes(GlobalInfo.getIdFromType('event','tag'))!=true){break}
				result.push(
					this.createEventAddRessource([
					{name: 'plant', valueStock: 2},
					{name: 'heat', valueStock: 2}])
				)
				break
			}
			//Bacterial Aggregate
			case(222):{
				if(playedCardTags.includes(GlobalInfo.getIdFromType('earth','tag'))!=true){break}
				result.push(this.createEventAddRessourceToCardId({name:'microbe', valueStock: 1},triggerId))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	getEventTriggerByRessourceAddedToCard(targetCard: PlayableCardModel, triggerIdList: number[], ressource: AdvancedRessourceStock): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByRessourceAddedToCard(triggerId, targetCard, ressource)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}

	generateEventTriggerByRessourceAddedToCard(triggerId: number, targetCard: PlayableCardModel, ressource: AdvancedRessourceStock): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []

		switch(triggerId){
			//Bacterial Aggregate
			case(222):{
				if(ressource.name!!='microbe'||ressource.valueStock<1){break}

				let stock = targetCard.getStockValue('microbe')
				if(stock>=5){
					result.push(this.createEventDeactivateTrigger(triggerId))
				}

				let limit = targetCard.getCardTriggerLimit()
				if(limit===undefined){break}

				let addValue = Math.min(ressource.valueStock, limit?.limit - limit.value)
				if(addValue<=0){break}

				result.push(this.createEventIncreaseResearchScanKeep({keep:0, scan:addValue}))
				targetCard.triggerLimit.value += addValue
				break
			}
			default:{
				return
			}
		}

		return result
	}
	getEventTriggerByGlobalParameterIncrease(triggerIdList: number[], parameter: GlobalParameterValue): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByGlobalParameterIncrease(triggerId, parameter)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}

	generateEventTriggerByGlobalParameterIncrease(triggerId: number, parameter: GlobalParameterValue): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []

		switch(triggerId){
			//Physiscs Complex
			case(46):{
				if(parameter.name!=GlobalParameterNameEnum.infrastructure){break}
				result.push(this.createEventAddRessourceToCardId({name:"science", valueStock:parameter.steps}, triggerId))
				break
			}
			//Pets
			case(279):{
				if(parameter.name!=GlobalParameterNameEnum.infrastructure){break}
				result.push(this.createEventAddRessourceToCardId({name:"science", valueStock:parameter.steps}, triggerId))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	createEventDraw(drawNumber: number): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber,discard:0}})
	}
	createEventDiscard(discardNumber: number): EventCardSelector {
		return EventDesigner.createCardSelector("discardCards", {cardSelector: {selectionQuantity: discardNumber}})
	}
	createEventUpgradePhaseCard(phaseCardUpgradeCount: number, phaseCardList?: number[]): EventBaseModel {
		return EventDesigner.createGeneric('upgradePhaseCards', {phaseCardUpgradeList:phaseCardList, phaseCardUpgradeNumber:phaseCardUpgradeCount})
	}
	createEventIncreaseGlobalParameter(parameterName: GlobalParameterNameEnum, steps:number): EventBaseModel {
		return EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter:{name:parameterName,steps: steps}})
	}
	createEventAddRessource(gain: RessourceStock | RessourceStock[]): EventBaseModel {
		return EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource:gain})
	}
	createEventAddRessourceToCardId(gain: AdvancedRessourceStock, cardId: number): EventBaseModel {
		return EventDesigner.createTargetCard('addRessourceToCardId', cardId, {advancedRessource:gain})
	}
	createEventIncreaseResearchScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createGeneric('increaseResearchScanKeep', {scanKeep:scanKeep})
	}
	createEventAddRessourceToSelectedCard(ressource: AdvancedRessourceStock, cardSelectionQuantity:number=1): EventBaseModel {
		return EventDesigner.createCardSelectorRessource(ressource, {cardSelector:{selectionQuantity:cardSelectionQuantity}})
	}
	createEventDeactivateTrigger(triggerId: number): EventBaseModel {
		return EventDesigner.createTargetCard('deactivateTrigger', triggerId)
	}
	createEventScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('scanKeepQuery', {scanKeep:scanKeep})
	}
}
