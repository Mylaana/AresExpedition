import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { EventStateOriginEnum, EventStateTypeEnum } from "../../enum/eventstate.enum";
import { EventBaseModel, EventCardActivator, EventCardBuilder, EventCardSelector } from "../../models/core-game/event.model";
import { EventDesigner } from "./event-designer.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";

const EventSubTypeToStateMap = new Map<EventUnionSubTypes, EventStateTypeEnum>([
	['developmentPhaseBuilder', EventStateTypeEnum.builderDevelopemntLocked],
	['constructionPhaseBuilder', EventStateTypeEnum.builderConstructionLocked],
])

@Injectable({
	providedIn: 'root'
})
export class EventStateFactory{
	public static toJson(event: EventBaseModel, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined {
		switch(event.type){
			case('cardSelectorCardBuilder'):{return this.eventBuilderToJson(event as EventCardBuilder, eventStateOperation)}
			case('cardActivator'):{return this.eventActivatorToJson(event as EventCardActivator, eventStateOperation)}
			case('cardSelector'):{return this.eventCardSelectorToJson(event as EventCardSelector, eventStateOperation)}
			default:{return}
		}
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
	private static eventCardSelectorToJson(event: EventCardSelector, eventStateOperation : EventStateOriginEnum): EventStateDTO | undefined{
		switch(event.subType){
			case('discardCards'):{
				return {
					o: eventStateOperation,
					t: EventStateTypeEnum.discard,
					v: event.cardSelector.selectionQuantity
				}
			}
			default:{return}
		}
	}
	public static shouldLoadEventFromThisSavedState(event: EventBaseModel, eventState: EventStateDTO) : boolean {
		if(event.subType==='actionPhaseActivator' && eventState.t===EventStateTypeEnum.cardActivator){return true}
		return false
	}
	public static createEventsFromJson(eventStateList: EventStateDTO[], clientState: PlayerStateModel): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		let treated: boolean
		for (let i = eventStateList.length - 1; i >= 0; i--) {
			let state = eventStateList[i]
			treated = true
			switch (state.t){
				case(EventStateTypeEnum.oceanFlipped):{
					if (state.v['MEGACREDIT']) {
						newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'megacredit', valueStock: state.v['MEGACREDIT'] ?? 0 } }))
					}
					if (state.v['PLANT']) {
						newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'plant', valueStock: state.v['PLANT'] ?? 0 } })) // probablement une erreur dans ton code initial (tu remets MEGACREDIT au lieu de PLANT)
					}

					//CARDS is treated separatly
					eventStateList.splice(i, 1)
					break
				}
				case(EventStateTypeEnum.drawCards):{
					//newEvents.push(EventDesigner.createDeckQueryEvent('drawQuery', { drawDiscard: { draw: state.v['CARD'] } }))
					console.log('draw cards : ')
					newEvents.push(EventDesigner.createGeneric('drawResult', {drawEventResult:state.v}))
					break
				}
				default:{treated = false}
			}
			if(treated){eventStateList.splice(i, 1)}
		}
		return newEvents
	}
}
