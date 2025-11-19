import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventCardActivator } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";

@Injectable()
export class EventCardActivatorHandler implements GameEventHandler<EventCardActivator> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='cardActivator'
    }
    onSwitchEvent(event: EventCardActivator){
		if(event.refreshSelectorOnSwitch){event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))}
		
		//check per subType special rules:
		switch(event.subType){
			case('actionPhaseActivator'):{
				event.setSelectorSelectFrom(this.gameStateFacade.getClientProjectPlayedModelList(event.getSelectorFilter()))
				break
			}
		}
    }
    onFinalizeEvent(event: EventCardActivator) {   
		Logger.logEventResolution('resolving event: ','EventCardActivator ', event.subType)
		event.finalized = true

		switch(event.subType){
			case('actionPhaseActivator'):{
				for(let card of event.getSelectorSelectFrom()){
					card.activated = 0
				}
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardActivator: ', event)}
		}
    }
}