import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { EventStateOriginEnum, EventStateTypeEnum } from "../../enum/eventstate.enum";
import { EventBaseModel, EventCardActivator, EventCardBuilder, EventCardSelector } from "../../models/core-game/event.model";
import { EventDesigner } from "./event-designer.service";

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
		return EventSubTypeToStateMap.get(event.subType) === eventState.t
	}
	public static createEventsFromJson(eventState: EventStateDTO[]): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		console.log('creating events :)', eventState)
		for(let event of eventState){
			switch(event.t){
				case(EventStateTypeEnum.oceanFlipped):{
					console.log(event)
					for(let ressource of event.v){
						console.log(ressource)
						switch(ressource){
							case('CARD'):{;break}
							//case('MEGACREDIT'):{newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource:{name:'megacredit', }})); break}
						}
					}
				}
			}
		}
		return newEvents
	}
}
