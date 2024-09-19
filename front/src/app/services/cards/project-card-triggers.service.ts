import { Injectable } from "@angular/core";
import { CostMod } from "../../types/project-card.type";
import { GlobalTagInfoService } from "../global/global-tag-info.service";
import { EventModel } from "../../models/core-game/event.model";
import { ProjectCardModel } from "../../models/cards/project-card.model";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardTriggersService {
	constructor(private tagInfoService: GlobalTagInfoService){}

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
		}

		return costMod
	}
	getEventFromTrigger(playedCard: ProjectCardModel, triggerIdList: number[]): EventModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventFromTrigger(triggerId, playedCard.tagsId)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	generateEventFromTrigger(triggerId: number, playedCardTags: number[]): EventModel[] | undefined {
		let result: EventModel[] = []

		switch(triggerId){
			case(25):{
				if(playedCardTags.includes(this.tagInfoService.getTagIdFromType('power'))!=true){break}
				result.push(this.createEventDraw(1))
				break
			}
			default:{
				return
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
}
