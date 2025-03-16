import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel, EventCardSelector } from "../../models/core-game/event.model";
import { ProjectFilter, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { AdvancedRessourceStock } from "../../interfaces/global.interface";
import { EventDesigner } from "../designers/event-designer.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { GlobalParameterNameEnum } from "../../enum/global.enum";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardActivatedEffectService {
	constructor(){}
	/**
	 *
	 * @param card
	 * @returns Event List

	* Events should be filled to the list according to their order of execution.
	 */
	static getActivateCardEvent(card: ProjectCardModel): EventBaseModel[] | undefined{
		let result: EventBaseModel[] = []
		switch(card.cardCode){
			//AI Central
			case('4'):{
				result.push(this.createEventDraw(2))
				break
			}
			//Artificial Jungle
			case('9'):{
				result.push(this.createEventAddRessource({name: "plant", valueStock: -1}))
				result.push(this.createEventDraw(1))
				break
			}
			//Decomposing Fungus
			case('20'):{
				//add new event type removing any ressource on card
				result.push(this.createEventAddRessource({name: "plant", valueStock: 3}))
				break
			}
			default:{
				return undefined
			}
		}
		return result
	}

	static isActivationCostPayable(card: ProjectCardModel, clientState: PlayerStateModel): boolean {
		switch(card.cardCode){
			//AI Central
			case('4'):{break}
			//Artificial Jungle
			case('9'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'plant', valueStock: 1})){return false}
				break
			}
			//Decomposing Fungus
			case('20'):{
				return false
				if(!this.checkCardsWithRessourcesStock(clientState, [{name:'animal', valueStock:1}, {name:'microbe', valueStock:1}], 'any')){return false}
				break
			}
			default:{
				return false
			}
		}
		return true
	}
	private static checkPlayerHasBaseRessourceStock(state: PlayerStateModel, ressource: RessourceStock): boolean {
		return (state.getRessourceInfoFromType(ressource.name)?.valueStock??0) >= ressource.valueStock
	}
	private static checkCardsWithRessourcesStock(state: PlayerStateModel, ressource: AdvancedRessourceStock | AdvancedRessourceStock[], anyOrAll: 'any' | 'all'): boolean {
		let ressources: AdvancedRessourceStock[] = []
		let hasStock : number = 0
		if(Array.isArray(ressource)){
			ressources = ressource
		} else {
			ressources = [ressource]
		}

		for(let r of ressources){
			let filter: ProjectFilter = {type: 'stockable', value: r.name}
			hasStock += Math.min(state.getProjectPlayedModelList(filter).length, 1)
		}

		switch(anyOrAll){
			case('all'):{return hasStock === ressources.length}
			case('any'):{return hasStock >= 1}
		}
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
		//this.addTrToPlayer(steps)
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
}
