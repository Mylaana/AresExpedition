import { Injectable } from "@angular/core";
import { EventQueueService } from "../event-queue.service";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { EventBuilderCommand, GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventCardBuilder } from "../../../models/core-game/event.model";
import { EventFactory } from "../../../factory/event/event-factory";
import { Logger } from "../../../utils/utils";
import { PlayableCard } from "../../../factory/playable-card.factory";

@Injectable()
export class EventBuilderHandler implements GameEventHandler<EventCardBuilder> {
    constructor(
        private gameEventQueue: EventQueueService,
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventCardBuilder): boolean {
        return true
    }
    onFinalizeEvent(event: EventCardBuilder) {   
        Logger.logEventResolution('resolving event: ','EventCardBuilder ', event.subType)
        switch(event.subType){
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('specialBuilder'):{
                event.finalized = true
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventCardBuilder: ', event)}
        }
    }
    onSwitchEvent(event: EventCardBuilder){
    }
    onBuilderButtonCommand(event: EventCardBuilder, command: EventBuilderCommand){
        console.log(command, event)
        switch(command.commandType){
            case('base'):{
                if(!event){return}
                switch(command.buttonName){
                    case('buildCard'):{
                        let newEvents: EventBaseModel[] = []
                        let card = event.getCardToBuild()
                        if(card===undefined){return}
                        event.lockCurrentBuilder()
                        event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))
                        newEvents = [EventFactory.createGeneric('buildCard', {card:card})]
        
                        event.cardBuilderButtonClicked(command.buttonName, command.builderIndex)
                        this.gameStateFacade.addEventQueue(newEvents, 'first')
                                
                        break
                    }
                    default:{Logger.logError('Non mapped command in handler.handleBuilderButtonCommand: ', command)}
                }
                break
            }
            
            case('alternativePay'):{
                if(!event){return}
                let newEvents = PlayableCard.getAlternativePayButtonClickedEvents(command.buttonName)
                if(newEvents.length===0){return}
                event.resolveCurrentBuilderAlternativeCostUsed(command.buttonName)
                this.gameStateFacade.addEventQueue(newEvents, 'first')
                break
            }

            case('alternativeOption'):{
                if(!event){return}
                let newEvents = PlayableCard.getBuilderAlternativeOptionButtonClickedEvents(command.buttonName)
                if(newEvents.length===0){return}
                event.resolveBuilderAlternativeOptionUsed(command.builderIndex??0, command.buttonName)
                this.gameStateFacade.addEventQueue(newEvents, 'first')
                break
            }

        }
    }
}