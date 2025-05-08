import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { EventStateOperationEnum, EventStateTypeEnum } from "../../enum/eventstate.enum";

@Injectable({
	providedIn: 'root'
})
export class EventStateFactory{
	public static toJson(subType: EventUnionSubTypes, value: any): EventStateDTO | undefined {
		let stateType: EventStateTypeEnum

		switch(subType){
			case('actionPhaseActivator'):{stateType = EventStateTypeEnum.cardActivator; break}
			case('developmentPhaseBuilder'):{stateType = EventStateTypeEnum.builderDevelopemntLocked; break}
			case('constructionPhaseBuilder'):{stateType = EventStateTypeEnum.builderConstructionLocked; break}
			default:{stateType = EventStateTypeEnum.undefined}
		}
		return {
			o: EventStateOperationEnum.loadEvent,
			t: stateType,
			v: value
		}
	}
}
