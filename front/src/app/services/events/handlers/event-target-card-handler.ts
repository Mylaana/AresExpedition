import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventTargetCard } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";
import { AdvancedRessourceStock, CardRessourceStock } from "../../../interfaces/global.interface";

@Injectable()
export class EventTargetCardHandler implements GameEventHandler<EventTargetCard> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='targetCard'
    }
    onSwitchEvent(event: EventTargetCard){

    }
    onFinalizeEvent(event: EventTargetCard) {   
        Logger.logEventResolution('resolving event: ','EventTargetCard ', event.subType)
        
        switch(event.subType){
            case('addRessourceToCardId'):{
                if(event.advancedRessource===undefined){Logger.logError('event tried to add ressource, but variable was empty: ',event); break}
                let ressourceStock: AdvancedRessourceStock[] = []
                if(Array.isArray(event.advancedRessource)===true){
                    ressourceStock = event.advancedRessource
                } else {
                    ressourceStock.push(event.advancedRessource)
                }
                let cardStock: CardRessourceStock = {
                    cardCode:event.targetCardId,
                    stock:ressourceStock
                }
                this.gameStateFacade.addRessourceToClientCard(cardStock)
                break
            }
            case('deactivateTrigger'):{
                this.gameStateFacade.setClientTriggerAsInactive(event.targetCardId)
                break
            }
            case('addTagToCardId'):{
                this.gameStateFacade.addTagToTargetCard(event.targetCardId, event.addTag)
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventTargetCards: ', event)}
        }
    }
}