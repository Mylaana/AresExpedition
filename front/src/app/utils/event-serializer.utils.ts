import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum"
import { BuilderOption } from "../enum/global.enum"
import { EventStateDTO, BuilderStatusDTO, EventStateBuilderContentDTO, EventStateContentScanKeepUnqueriedDTO, EventStateContentTargetCardDTO, EventStateContentDiscardDTO, EventStateContentDrawQueryDTO, EventStateAddProduction, EventStateIncreaseResearchScanKeep, EventStateUpgradePhase, EventStateAddRessourceToPlayer, EventStateContentDrawQueryThenDiscardDTO } from "../interfaces/event-state.interface"
import { EventCardBuilder, EventCardActivator, EventDeckQuery, EventTargetCard, EventBaseModel, EventComplexCardSelector, EventGeneric } from "../models/core-game/event.model"
import { EventUnionSubTypes } from "../types/event.type"

function eventBuilderToJson(event: EventCardBuilder): EventStateDTO | undefined{
	let status: BuilderStatusDTO[] = []
	let specialBuilderOption!: BuilderOption
	let stateType!: EventStateTypeEnum
	let eventStateOperation: EventStateOriginEnum
	for(let builder of event.cardBuilder){
		let s: BuilderStatusDTO = {
			cc: builder.getBuitCardCode(),
			l: builder.getBuilderIsLocked()
		}
		status.push(s)
	}

	switch(event.subType){
		case('developmentPhaseBuilder'):{
			stateType = EventStateTypeEnum.builderDevelopemntLocked
			eventStateOperation = EventStateOriginEnum.load
			break
		}
		case('constructionPhaseBuilder'):{
			stateType = EventStateTypeEnum.builderConstructionLocked
			eventStateOperation = EventStateOriginEnum.load
			break
		}
		case('specialBuilder'):{
			stateType = EventStateTypeEnum.specialBuilder
			specialBuilderOption = event.cardBuilder[0].getOption()
			eventStateOperation = EventStateOriginEnum.create
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
function eventActivatorToJson(event: EventCardActivator): EventStateDTO | undefined {
	return {
		o: EventStateOriginEnum.load,
		t: EventStateTypeEnum.cardActivator,
		v: event.activationLog
	}
}
function eventDeckQueryToJson(event: EventDeckQuery): EventStateDTO | undefined {
	switch(event.subType){
		case('scanKeepQuery'):{
			let content: EventStateContentScanKeepUnqueriedDTO = {
				scanKeep: event.scanKeep,
				options: event.options
			}
			return {
				o: EventStateOriginEnum.create,
				t: EventStateTypeEnum.scanKeepUnQueried,
				v: content
			}
		}
		case('drawQuery'):{
			let content:  EventStateContentDrawQueryDTO = {
				d: event.drawDiscard?.draw??0,
			}
			if(content.d===0){return}
			return {
				o:EventStateOriginEnum.create,
				t:EventStateTypeEnum.drawCardsUnqueried,
				v: content
			}
		}
		case('drawThenDiscard'):{
			let content:  EventStateContentDrawQueryThenDiscardDTO = {
				dr: event.drawDiscard?.draw??0,
				di: event.drawDiscard?.discard??0
			}
			if(content.dr===0){return}
			return {
				o:EventStateOriginEnum.create,
				t:EventStateTypeEnum.drawThenDiscardUnqueried,
				v: content
			}
		}
		default:{return}
	}
}
function eventTargetCardToJson(event: EventTargetCard): EventStateDTO | undefined {
	let content: EventStateContentTargetCardDTO = {
		cardId: event.targetCardId,
		ressources: event.advancedRessource
	}
	return {
		o: EventStateOriginEnum.create,
		t: EventStateTypeEnum.targetCardAddRessource,
		v: content
	}
}
function eventComplexSelectorToJson(event: EventComplexCardSelector): EventStateDTO | undefined {
	switch(event.subType){
		case('discardCards'):{
			let content: EventStateContentDiscardDTO = {
				d: event.cardSelector.selectionQuantity
			}
			return {
				o: EventStateOriginEnum.create,
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
			let dto = toJson(e)
			if(dto){
				result.push(dto)
			}
		}
		return result
}
function eventGenericToJson(event: EventGeneric): EventStateDTO | undefined {
	switch(event.subType){
		case('addProduction'):{
			if(!event.baseRessource){return}
			let content: EventStateAddProduction = {
				p: event.baseRessource
			}
			return {
				o: EventStateOriginEnum.create,
				t: EventStateTypeEnum.addProduction,
				v: content
			}
		}
		case('increaseResearchScanKeep'):{
			if(!event.increaseResearchScanKeep){return}
			if(event.increaseResearchScanKeep.scan===0 && event.increaseResearchScanKeep.keep===0){return}
			let content: EventStateIncreaseResearchScanKeep = {
				s: {scan:event.increaseResearchScanKeep.scan??0, keep:event.increaseResearchScanKeep.keep??0}
			}
			return {
				o: EventStateOriginEnum.create,
				t: EventStateTypeEnum.increaseResearchScanKeep,
				v: content
			}
		}
		case('upgradePhaseCards'):{
			if(!event.phaseCardUpgradeQuantity || event.phaseCardUpgradeQuantity===0){return}
			let content: EventStateUpgradePhase = {
				u: event.phaseCardUpgradeQuantity??0,
				l: event.phaseCardUpgradeList
			}
			return {
				o: EventStateOriginEnum.create,
				t: EventStateTypeEnum.upgradePhase,
				v: content
			}
		}
		case('addRessourceToPlayer'):{
			if(!event.baseRessource){return}
			let content: EventStateAddRessourceToPlayer = {
				r: event.baseRessource
			}
			return {
				o: EventStateOriginEnum.create,
				t: EventStateTypeEnum.addRessourceToPlayer,
				v: content
			}
		}
	}
	return
}

function toJson(event: EventBaseModel): EventStateDTO | undefined {
	if(event.finalized){return}
	const excludedSubtypes : EventUnionSubTypes[] = [
		'endOfPhase', 'waitingGroupReady', 'selectCardForcedSell', 'deckWaiter',
		'planificationPhase'
	]
	if(excludedSubtypes.includes(event.subType)){return}
	let dto: EventStateDTO | undefined
	switch(event.type){
		case('cardSelectorCardBuilder'):{dto = eventBuilderToJson(event as EventCardBuilder); break}
		case('cardActivator'):{dto = eventActivatorToJson(event as EventCardActivator); break}
		case('deck'):{dto = eventDeckQueryToJson(event as EventDeckQuery); break}
		case('targetCard'):{dto = eventTargetCardToJson(event as EventTargetCard); break}
		case('ComplexSelector'):{dto = eventComplexSelectorToJson(event as EventComplexCardSelector); break}
		case('generic'):{dto = eventGenericToJson(event as EventGeneric); break}
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
