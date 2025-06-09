import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../types/event.type";
import { EventStateDTO } from "../interfaces/dto/event-state-dto.interface";
import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum";
import { EventBaseModel, EventCardActivator, EventCardBuilder, EventCardSelector, EventComplexCardSelector, EventDeckQuery, EventTargetCard } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { OceanBonus } from "../interfaces/global.interface";
import { EventFactory } from "./event factory/event-factory";
import { ProjectCardInfoService } from "../services/cards/project-card-info.service";

const EventSubTypeToStateMap = new Map<EventUnionSubTypes, EventStateTypeEnum>([
	['developmentPhaseBuilder', EventStateTypeEnum.builderDevelopemntLocked],
	['constructionPhaseBuilder', EventStateTypeEnum.builderConstructionLocked],
])

@Injectable({
	providedIn: 'root'
})
export class EventStateFactory{
	constructor(private projectCardInfoService: ProjectCardInfoService){
	}
	public static toJson(event: EventBaseModel, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined {
		switch(event.type){
			case('cardSelectorCardBuilder'):{return this.eventBuilderToJson(event as EventCardBuilder, eventStateOperation)}
			case('cardActivator'):{return this.eventActivatorToJson(event as EventCardActivator, eventStateOperation)}
			case('deck'):{return this.eventDeckQueryToJson(event as EventDeckQuery, eventStateOperation)}
			case('targetCard'):{return this.eventTargetCardToJson(event as EventTargetCard, eventStateOperation)}
			default:{
				const excludedSubtypes : EventUnionSubTypes[] = ['endOfPhase', 'waitingGroupReady', 'selectCardForcedSell']
				if(excludedSubtypes.includes(event.subType)){break}
				console.error('UNSAVED EVENTSTATE ON EVENT: ', event)
				break
			}
		}
		return
	}
	private static eventBuilderToJson(event: EventCardBuilder, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined{
		let builderLocked: boolean[] = []
		for(let builder of event.cardBuilder){
			builderLocked.push(builder.getbuilderIsLocked())
		}

		let stateType = EventSubTypeToStateMap.get(event.subType)
		if(!stateType){return}
		switch(event.subType){
			case('developmentPhaseBuilder'):{stateType = EventStateTypeEnum.builderDevelopemntLocked; break}
			case('constructionPhaseBuilder'):{stateType = EventStateTypeEnum.builderConstructionLocked; break}
			default:{return}
		}
		return {
			o: eventStateOperation,
			t: stateType,
			v: builderLocked
		}
	}
	private static eventActivatorToJson(event: EventCardActivator, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined {
		return {
			o: eventStateOperation,
			t: EventStateTypeEnum.cardActivator,
			v: event.activationLog
		}
	}
	private static eventDeckQueryToJson(event: EventDeckQuery, eventStateOperation: EventStateOriginEnum): EventStateDTO | undefined {
		switch(event.subType){
			case('scanKeepQuery'):{
				return {
					o: eventStateOperation,
					t: EventStateTypeEnum.scanKeepUnQueried,
					v: {
						'scanKeep': event.scanKeep,
						'options': event.options
					}
				}
			}
			default:{
				return
			}
		}
	}
	private static eventTargetCardToJson(event: EventTargetCard, eventStateOperation: EventStateOriginEnum): EventStateDTO | undefined {
		return {
			o: eventStateOperation,
			t: EventStateTypeEnum.targetCardAddRessource,
			v: {
				'cardId': event.targetCardId,
				'ressources': event.advancedRessource
			}
		}
	}
	public static shouldLoadEventFromThisSavedState(event: EventBaseModel, eventState: EventStateDTO) : boolean {
		switch(true){
			case(event.subType==='actionPhaseActivator' && eventState.t===EventStateTypeEnum.cardActivator):{break}
			case(event.subType==='developmentPhaseBuilder'  && eventState.t===EventStateTypeEnum.builderDevelopemntLocked):{break}
			case(event.subType==='constructionPhaseBuilder'  && eventState.t===EventStateTypeEnum.builderConstructionLocked):{break}
			case(event.subType==='productionPhase' && eventState.t===EventStateTypeEnum.productionCards):{break}
			default:{return false}
		}
		return true
	}
	public createEventsFromJson(eventStateList: EventStateDTO[], clientState: PlayerStateModel): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		let treated: boolean
		for (let i = eventStateList.length - 1; i >= 0; i--) {
			let state = eventStateList[i]
			treated = true
			switch (state.t){
				case(EventStateTypeEnum.oceanFlipped):{
					let oceanBonus: OceanBonus = {
						megacredit: 0,
						plant: 0,
						card: 0
					}
					if (state.v['MEGACREDIT']) {
						newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'megacredit', valueStock: state.v['MEGACREDIT'] ?? 0 } }))
						oceanBonus.megacredit = state.v['MEGACREDIT']??0
					}
					if (state.v['PLANT']) {
						newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'plant', valueStock: state.v['PLANT'] ?? 0 } })) // probablement une erreur dans ton code initial (tu remets MEGACREDIT au lieu de PLANT)
						oceanBonus.plant = state.v['PLANT']??0
					}
					if (state.v['CARD']) {
						oceanBonus.card = state.v['CARD']??0
					}

					clientState.addOceanFlippedBonus(oceanBonus)

					//CARDS is treated separatly
					eventStateList.splice(i, 1)
					break
				}
				case(EventStateTypeEnum.drawCards):{
					newEvents.push(EventFactory.createGeneric('drawResult', {drawEventResult:state.v}))
					break
				}
				case(EventStateTypeEnum.discard):{
					newEvents.push(EventFactory.simple.discard( state.v))
					break
				}
				case(EventStateTypeEnum.researchCardsQueried):{
					newEvents.push(EventFactory.createCardSelector('researchPhaseResult', {cardSelector:{
						selectFrom: this.projectCardInfoService.getProjectCardList(state.v['cards']),
						selectionQuantity: state.v['keep']
					}}))
					break
				}
				case(EventStateTypeEnum.scanKeepQueried):{
					newEvents.push(EventFactory.simple.scanKeepResult(
						this.projectCardInfoService.getProjectCardList(state.v['cards']),
						state.v['keep'],
						state.v['options']))
					break
				}
				case(EventStateTypeEnum.scanKeepUnQueried):{
					newEvents.push(EventFactory.createDeckQueryEvent('scanKeepQuery', {
						scanKeep: state.v['scanKeep'],
						scanKeepOptions: state.v['options']
					}))
					break
				}
				case(EventStateTypeEnum.targetCardAddRessource):{
					newEvents.push(EventFactory.createTargetCard('addRessourceToCardId',
						state.v['cardId'],
						{advancedRessource: state.v['ressources']}
					))
					console.log(newEvents, state)
					break
				}
				default:{treated = false}
			}
			if(treated){eventStateList.splice(i, 1)}
		}
		return newEvents
	}
}
