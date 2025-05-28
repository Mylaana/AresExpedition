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
	/**
	 *
	 * @param card
	 * @returns Event List

	* Events should be filled to the list according to their order of execution.
	 */
	public static getPlayedCardEvent(cardCode: string, clientstate: PlayerStateModel): EventBaseModel[] | undefined{
		let result: EventBaseModel[] = []
		switch(cardCode){
			//Decomposing Fungus
			case('20'):{
				ProjectCardPlayedEffectService.createEventAddRessourceToSelectedCard({name: 'microbe',valueStock: 2})
				break
			}
			//Farming Co-ops
			case('29'):{
				result.push(this.createEventAddRessource({name: 'plant',valueStock: 3}))
				break
			}
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
			//Bribed Commitee
			case('69'):{
				result.push(this.createEventAddTR(2))
				break
			}
			//Convoy from Europa
			case('74'):{
				result.push(this.createEventDraw(1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Deimos Down
			case('76'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,3))
				result.push(this.createEventAddRessource({name: 'megacredit',valueStock: 7}))
				break
			}
			//Giant Ice Asteroid
			case('77'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				break
			}
			//Imported Nitrogen
			case('81'):{
				result.push(this.createEventAddRessourceToSelectedCard({name:'animal', valueStock:2}))
				result.push(this.createEventAddRessourceToSelectedCard({name:'microbe', valueStock:3}))
				result.push(this.createEventAddRessource({name: 'plant',valueStock: 4}))
				result.push(this.createEventAddTR(1))
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
			//Acquired Company
			case('103'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Adaptated Lichen
			case('104'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Aerated Magma
			case('105'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:2}
				]))
				break
			}
			//Airborne Radiation
			case('106'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
				break
			}
			//Acquired Company
			case('107'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Archaebacteria
			case('108'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Artificial Photosynthesis
			case('109'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Asteroid Mining
			case('110'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:2}))
				break
			}
			//Asteroid Mining Consortium
			case('111'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Astrofarm
			case('112'):{
				result.push(this.createEventAddRessourceToSelectedCard({name:'microbe', valueStock:2}))
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Beam from a Thorium Asteroid
			case('116'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Biomass Combustors
			case('117'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:5}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:-2}))
				break
			}
			//BioThermal Power
			case('118'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventAddForestAndOxygen(1))
				break
			}
			//Blueprints
			case('119'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Building Industries
			case('120'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:2}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-4}))
				break
			}
			//Building Industries
			case('120'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:2}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-4}))
				break
			}
			//Bushes
			case('121'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Callisto Penal Mines
			case('122'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Coal Imports
			case('124'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Commercial Districts
			case('125'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:4}))
				break
			}
			//Deep Well Heating
			case('126'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature, 1))
				break
			}
			//Designed Microorganisms
			case('127'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Diversified Interests
			case('128'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource([
					{name:'plant', valueStock:3},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Dust Quarry
			case('129'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:1}))
				break
			}
			//Economic Growth
			case('130'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:3}))
				break
			}
			//Energy Storage
			case('131'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:2}))
				break
			}
			//Eos Chasma National Park
			case('132'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:3}))
				result.push(this.createEventAddRessourceToSelectedCard({name:'animal', valueStock:1}))
				break
			}
			//Farming
			case('133'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'plant', valueStock:2}
				]))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Food Factory
			case('134'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:4}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:-2}))
				break
			}
			//Fuel factory
			case('135'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'titanium', valueStock:1}
				]))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-3}))
				break
			}
			//Fuel Generators
			case('136'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Fusion Power
			case('137'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Ganymede Shipyard
			case('138'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:2}))
				break
			}
			//Gene Repair
			case('139'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//Geothermal Power
			case('140'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Giant Space Mirror
			case('141'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Grass
			case('142'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:3}))
				break
			}
			//Great Dam
			case('143'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Great Escarpment Consortium
			case('144'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:1}))
				break
			}
			//Heater
			case('145'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:1}))
				break
			}
			//Lichen
			case('155'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Methane from Titan
			case('161'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:2},
					{name:'heat', valueStock:2}
				]))
				break
			}
			//Microprocessor
			case('163'):{
				result.push(this.createEventDiscard(1))
				result.push(this.createEventDraw(2))
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Nitrophilic Moss
			case('171'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Power plant
			case('175'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				break
			}
			//Slash and Burn Agriculture
			case('182'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Smelting
			case('183'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:5}))
				result.push(this.createEventDraw(2))
				break
			}
			//Soil Warming
			case('184'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Sponsor
			case('190'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//Trapped Heat
			case('197'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Trees
			case('198'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:3}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:1}))
				break
			}
			//Underground City
			case('201'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Underseas Vents
			case('202'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:4}
				]))
				break
			}
			//Vesta Shipyard
			case('204'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Biofoundries
			case('D22'):{
				result.push(this.createEventUpgradePhaseCard(1))
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Hematite Mining
			case('D29'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:2},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Industrial Complex
			case('D32'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				result.push(this.createEventUpgradePhaseCard(1))
				break
			}
			//Award Winning Reflector Material
			case('D35'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				if(clientstate.getMilestoneCompleted()>0){
					result.push(this.createEventAddRessource({name:'heat', valueStock:4}))
				}
				break
			}
			//Perfluorocarbon Production
			case('D37'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventUpgradePhaseCard(1, [0]))
				break
			}
			//Biological Factories
			case('D40'):{
				result.push(this.createEventUpgradePhaseCard(1, [3]))
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
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
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
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
				result.push(this.createEventAddRessource({name:'plant', valueStock:4}))
				break
			}
			//Low-Atmosphere Planes
			case('F17'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,3))
				break
			}
			//Innovative Technologies Award
			case('P26'):{
				result.push(this.createEventAddTR(clientstate.getPhaseCardUpgradedCount()))
				break
			}
			//Glacial Evaporation
			case('P29'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				break
			}
			//Tourism
			case('P30'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddTR(clientstate.getMilestoneCompleted()))
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
				if(mod.tagList.includes(GlobalInfo.getIdFromType('power','tag'))===false){break}
				costMod += 4
				break
			}
			//Interplanetary Conference
			case(37):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))){costMod += 3}
				if(mod.tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))){costMod += 3}
				break
			}
			//Media Group
			case(42):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('event','tag'))){costMod += 5}
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
				result.push(ProjectCardPlayedEffectService.createEventDraw(1))
				break
			}
			//Interplanetary Conference
			case(37):{
				//self triggering excluded
				if(cardPlayedIsTheTrigger===true){break}
				if(playedCardTags.includes(GlobalInfo.getIdFromType('earth','tag'))!=true
					&& playedCardTags.includes(GlobalInfo.getIdFromType('jovian','tag'))!=true
				){break}
				//triggers for each tag in the played card
				let draw = 0
				for(let tag of playedCardTags){
					if(tag === GlobalInfo.getIdFromType('earth','tag') || tag === GlobalInfo.getIdFromType('jovian','tag')){
						draw += 1
					}
				}
				result.push(ProjectCardPlayedEffectService.createEventDraw(draw))
				break
			}
			//Optimal Aerobraking
			case(45):{
				if(playedCardTags.includes(GlobalInfo.getIdFromType('event','tag'))!=true){break}
				result.push(
					ProjectCardPlayedEffectService.createEventAddRessource([
					{name: 'plant', valueStock: 2},
					{name: 'heat', valueStock: 2}])
				)
				break
			}
			//Bacterial Aggregate
			case(222):{
				if(playedCardTags.includes(GlobalInfo.getIdFromType('earth','tag'))!=true){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:'microbe', valueStock: 1},triggerId))
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
					result.push(ProjectCardPlayedEffectService.createEventDeactivateTrigger(triggerId))
				}

				let limit = targetCard.getCardTriggerLimit()
				if(limit===undefined){break}

				let addValue = Math.min(ressource.valueStock, limit?.limit - limit.value)
				if(addValue<=0){break}

				result.push(ProjectCardPlayedEffectService.createEventIncreaseResearchScanKeep({keep:0, scan:addValue}))
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
				if(parameter.name!=GlobalParameterNameEnum.temperature){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"science", valueStock:parameter.steps}, triggerId))
				break
			}
			//Pets
			case(279):{
				if(parameter.name!=GlobalParameterNameEnum.infrastructure){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"science", valueStock:parameter.steps}, triggerId))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	private static createEventDraw(drawNumber: number): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber,discard:0}})
	}
	private static createEventDiscard(discardNumber: number): EventCardSelector {
		return EventDesigner.createCardSelector("discardCards", {cardSelector: {selectionQuantity: discardNumber}})
	}
	private static createEventUpgradePhaseCard(phaseCardUpgradeCount: number, phaseCardList?: number[]): EventBaseModel {
		return EventDesigner.createGeneric('upgradePhaseCards', {phaseCardUpgradeList:phaseCardList, phaseCardUpgradeNumber:phaseCardUpgradeCount})
	}
	private static createEventIncreaseGlobalParameter(parameterName: GlobalParameterNameEnum, steps:number): EventBaseModel {
		return EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter:{name:parameterName,steps: steps}})
	}
	private static createEventAddRessource(gain: RessourceStock | RessourceStock[]): EventBaseModel {
		return EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource:gain})
	}
	private static createEventAddRessourceToCardId(gain: AdvancedRessourceStock, cardId: number): EventBaseModel {
		return EventDesigner.createTargetCard('addRessourceToCardId', cardId, {advancedRessource:gain})
	}
	private static createEventIncreaseResearchScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createGeneric('increaseResearchScanKeep', {scanKeep:scanKeep})
	}
	private static createEventAddRessourceToSelectedCard(ressource: AdvancedRessourceStock, cardSelectionQuantity:number=1): EventBaseModel {
		return EventDesigner.createCardSelectorRessource(ressource, {cardSelector:{selectionQuantity:cardSelectionQuantity}})
	}
	private static createEventDeactivateTrigger(triggerId: number): EventBaseModel {
		return EventDesigner.createTargetCard('deactivateTrigger', triggerId)
	}
	private static createEventScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('scanKeepQuery', {scanKeep:scanKeep})
	}
	private static createEventAddProduction(gain: RessourceStock | RessourceStock[]): EventBaseModel {
		return EventDesigner.createGeneric('addProduction', {baseRessource:gain})
	}
	private static createEventAddTR(quantity: number): EventBaseModel {
		return EventDesigner.createGeneric('addTr', {increaseTr: quantity})
	}
	private static createEventAddForestAndOxygen(quantity: number): EventBaseModel {
		return EventDesigner.createGeneric('addForestPointAndOxygen', {addForestPoint:quantity})
	}
}
