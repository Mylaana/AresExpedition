import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventCardSelectorRessource } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";
import { AdvancedRessourceStock } from "../../../interfaces/global.interface";

@Injectable()
export class EventCardSelectorResourceHandler implements GameEventHandler<EventCardSelectorRessource> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='cardSelectorRessource'
    }
    onSwitchEvent(event: EventCardSelectorRessource){
        let selection = this.gameStateFacade.getClientProjectPlayedModelList(event.getSelectorFilter())
        if(selection.length===0){
            //set event as finalized if no valid target
            event.finalized = true
            return
        }
        event.setSelectorSelectFrom(selection)
    }
    onFinalizeEvent(event: EventCardSelectorRessource) {   
        Logger.logEventResolution('resolving event: ','EventCardSelectorRessource ', event.subType)
        switch(event.subType){
            case('addRessourceToSelectedCard'):{
                event.finalized = true
                let stock: AdvancedRessourceStock[] = event.advancedRessource?[event.advancedRessource]:[]
                if(stock.length===0){break}

                this.gameStateFacade.addRessourceToClientCard({cardCode: event.getSelectorSelectedList()[0].cardCode,stock: stock})
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventCardSelectorRessource: ', event)}
        }
    }
}