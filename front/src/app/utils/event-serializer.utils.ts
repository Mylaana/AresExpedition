import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum"
import { BuilderOption } from "../enum/global.enum"
import { EventStateDTO, BuilderStatusDTO, EventStateBuilderContentDTO, EventStateContentScanKeepUnqueriedDTO, EventStateContentTargetCardDTO, EventStateContentDiscardDTO, EventStateContentDrawQueryDTO } from "../interfaces/event-state.interface"
import { EventCardBuilder, EventCardActivator, EventDeckQuery, EventTargetCard, EventBaseModel, EventComplexCardSelector } from "../models/core-game/event.model"
import { EventUnionSubTypes } from "../types/event.type"

function eventBuilderToJson(event: EventCardBuilder, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined{
	let status: BuilderStatusDTO[] = []
	let specialBuilderOption!: BuilderOption
	let stateType!: EventStateTypeEnum
	for(let builder of event.cardBuilder){
		let s: BuilderStatusDTO = {
			cc: builder.getBuitCardCode(),
			l: builder.getBuilderIsLocked()
		}
		status.push(s)
	}

	switch(event.subType){
		case('developmentPhaseBuilder'):{stateType = EventStateTypeEnum.builderDevelopemntLocked; break}
		case('constructionPhaseBuilder'):{stateType = EventStateTypeEnum.builderConstructionLocked; break}
		case('specialBuilder'):{
			stateType = EventStateTypeEnum.specialBuilder
			specialBuilderOption = event.cardBuilder[0].getOption()
			break
		}
		default:{return}
	}

	let content: EventStateBuilderContentDTO = {
		s: status,
		o: specialBuilderOption??''
	}

	return {
		o: eventStateOperation,
		t: stateType,
		v: content
	}
}
function eventActivatorToJson(event: EventCardActivator, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined {
	return {
		o: eventStateOperation,
		t: EventStateTypeEnum.cardActivator,
		v: event.activationLog
	}
}
function eventDeckQueryToJson(event: EventDeckQuery, eventStateOperation: EventStateOriginEnum): EventStateDTO | undefined {
	switch(event.subType){
		case('scanKeepQuery'):{
			let content: EventStateContentScanKeepUnqueriedDTO = {
				scanKeep: event.scanKeep,
				options: event.options
			}
			return {
				o: eventStateOperation,
				t: EventStateTypeEnum.scanKeepUnQueried,
				v: content
			}
		}
		case('drawQuery'):{
			let content:  EventStateContentDrawQueryDTO = {
				d: event.drawDiscard?.draw??0
			}
			if(content.d===0){return}
			return {
				o:EventStateOriginEnum.create,
				t:EventStateTypeEnum.drawCardsUnqueried,
				v: content
			}
		}
		default:{return}
	}
}
function eventTargetCardToJson(event: EventTargetCard, eventStateOperation: EventStateOriginEnum): EventStateDTO | undefined {
	let content: EventStateContentTargetCardDTO = {
		cardId: event.targetCardId,
		ressources: event.advancedRessource
	}
	return {
		o: eventStateOperation,
		t: EventStateTypeEnum.targetCardAddRessource,
		v: content
	}
}
function eventComplexSelectorToJson(event: EventComplexCardSelector, eventStateOperation: EventStateOriginEnum): EventStateDTO | undefined {
	switch(event.subType){
		case('discardCards'):{
			let content: EventStateContentDiscardDTO = {
				d: event.cardSelector.selectionQuantity
			}
			return {
				o: eventStateOperation,
				t: EventStateTypeEnum.discard,
				v: content
			}
		}
	}
	return

}
function eventQueueToJson(events: EventBaseModel[]): EventStateDTO[] {
		let result: EventStateDTO[] = []
		for(let e of events){
			let dto = toJson(e, EventStateOriginEnum.load)
			if(dto){
				result.push(dto)
			}
		}
		return result
}

function toJson(event: EventBaseModel, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined {
	const excludedSubtypes : EventUnionSubTypes[] = ['endOfPhase', 'waitingGroupReady', 'selectCardForcedSell', 'deckWaiter']
	if(excludedSubtypes.includes(event.subType)){return}
	let dto: EventStateDTO | undefined
	switch(event.type){
		case('cardSelectorCardBuilder'):{dto = eventBuilderToJson(event as EventCardBuilder, eventStateOperation); break}
		case('cardActivator'):{dto = eventActivatorToJson(event as EventCardActivator, eventStateOperation); break}
		case('deck'):{dto = eventDeckQueryToJson(event as EventDeckQuery, eventStateOperation); break}
		case('targetCard'):{dto = eventTargetCardToJson(event as EventTargetCard, eventStateOperation); break}
		case('ComplexSelector'):{dto = eventComplexSelectorToJson(event as EventComplexCardSelector, eventStateOperation); break}
		default:{break}
	}
	if(dto){return dto}
	if(event.finalized===false){
		console.error('UNSAVED EVENTSTATE ON EVENT: ', event)
	}
	return
}
export const EventSerializer = {
	eventQueueToJson
}
