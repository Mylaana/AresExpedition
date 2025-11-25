import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventTagSelector } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";
import { EventFactory } from "../../../factory/event/event-factory";

@Injectable()
export class EventTagSelectorHandler implements GameEventHandler<EventTagSelector> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='tagSelector'
    }
    onSwitchEvent(event: EventTagSelector){

    }
    onFinalizeEvent(event: EventTagSelector) {   
        Logger.logEventResolution('resolving event: ','finishEventTagSelector', event.subType)
		switch(event.subType){
			case('tagSelector'):{
				event.finalized=true
				this.gameStateFacade.addEventQueue(EventFactory.simple.addTagToCard(event.targetCardId, event.selectedTag), 'first')
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventPhase: ', event)}
		}
    }
}