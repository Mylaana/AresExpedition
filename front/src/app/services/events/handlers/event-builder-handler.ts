import { Injectable } from "@angular/core";
import { EventQueueService } from "../event-queue.service";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { EventBuilderCommand, GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventCardBuilder } from "../../../models/core-game/event.model";
import { EventFactory } from "../../../factory/event/event-factory";
import { Logger } from "../../../utils/utils";
import { PlayableCard } from "../../../factory/playable-card.factory";
import { CardBuilderService } from "../../core-game/components-services/card-builder.service";

@Injectable()
export class EventBuilderHandler implements GameEventHandler<EventCardBuilder> {
    constructor(
        private gameEventQueue: EventQueueService,
        private gameStateFacade: GameStateFacadeService,
        private builderService: CardBuilderService
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='cardSelectorCardBuilder'
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
        if(event.refreshSelectorOnSwitch){event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))}
        this.builderService.notifyRecalculateSelector()
    }
    onBuilderButtonCommand(event: EventCardBuilder, command: EventBuilderCommand){
        let newEvents: EventBaseModel[] = []
        switch(command.commandType){
            case('base'):{
                if(!event){return}
                switch(command.buttonName){
                    case('buildCard'):{
                        let card = event.getCardToBuild()
                        if(card===undefined){return}

                        event.lockCurrentBuilder()
                        event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))
                        newEvents = [EventFactory.createGeneric('buildCard', {card:card})]
                                
                        break
                    }
                    case('discardSelectedCard'):{break}
                    default:{Logger.logError('Non mapped command in handler.handleBuilderButtonCommand: ', command)}
                }

                event.cardBuilderButtonClicked(command.buttonName, command.builderIndex)
                break
            }

            case('alternativePay'):{
                if(!event){return}
                newEvents = PlayableCard.getAlternativePayButtonClickedEvents(command.buttonName)
                if(newEvents.length===0){return}

                event.resolveCurrentBuilderAlternativeCostUsed(command.buttonName)
                break
            }

            case('alternativeOption'):{
                if(!event){return}
                newEvents = PlayableCard.getBuilderAlternativeOptionButtonClickedEvents(command.buttonName)
                if(newEvents.length===0){return}

                event.resolveBuilderAlternativeOptionUsed(command.builderIndex??0, command.buttonName)
                break
            }
        }

        if(newEvents.length===0){return}
        this.gameEventQueue.addEventQueue(newEvents, 'first')
    }
}