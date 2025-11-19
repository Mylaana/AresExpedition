import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventWaiter } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";

@Injectable()
export class EventWaiterHandler implements GameEventHandler<EventWaiter> {

    supports(event: EventBaseModel): boolean {
        return event.type==='waiter'
    }
    onSwitchEvent(event: EventWaiter){

    }
    onFinalizeEvent(event: EventWaiter) {   
        Logger.logEventResolution('resolving event: ','EventWaiter ', event.subType)
		switch(event.subType){
			case('deckWaiter'):{
				return
			}
			default:{Logger.logError('Non mapped event in handler.EventWaiter: ', event)}
		}
    }
}