import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventCardSelector, EventCardSelectorRessource } from "../../../models/core-game/event.model";
import { Logger, Utils } from "../../../utils/utils";
import { EventCardSelectorSubType, EventCardSelectorRessourceSubType } from "../../../types/event.type";
import { CardBuilderService } from "../../core-game/components-services/card-builder.service";
import { CardSelectorService } from "../../core-game/components-services/card-selector.service";
import { ProjectCardInfoService } from "../../cards/project-card-info.service";
import { EventFactory } from "../../../factory/event/event-factory";
import { EventQueueService } from "../event-queue.service";

@Injectable()
export class EventSelectorHandler implements GameEventHandler<EventCardSelector | EventCardSelectorRessource> {
    constructor(
        private eventQueue: EventQueueService,
        private gameStateFacade: GameStateFacadeService,
        private selectorService: CardSelectorService
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='cardSelector'
    }
    onSwitchEvent(event: EventCardSelector | EventCardSelectorRessource){
        if(event.refreshSelectorOnSwitch){event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))}

        //check per subType special rules:
        switch(event.subType){
            case('selectCardForcedSell'):{
                Logger.logEventResolution('resolving event: ','EventCardSelector ', event.subType)
                let clientState = this.gameStateFacade.getClientState()
                let currentSize = clientState.getHandCurrentSize()
                let maximumSize = clientState.getHandMaximumSize()
                if(currentSize <= maximumSize){
                    event.finalized = true
                    break
                }
                event.setSelectorQuantity(currentSize - maximumSize)
                event.activateSelection()
                event.titleKey = 'eventForcedSell'
                event.titleInterpolation = [event.getSelectorQuantity().toString()]
                break
            }
            case('selectCardOptionalSell'):{
                event.activateSelection()
                break
            }
            case('addRessourceToSelectedCard'):{
                let selectFrom = this.gameStateFacade.getClientProjectPlayedModelList(event.getSelectorFilter())
                if(selectFrom.length===0){event.finalized=true;break}
                event.activateSelection()
                event.setSelectorSelectFrom(selectFrom)
                break
            }
            case('recallCardInHand'):case('doubleProduction'):{
                event.setSelectorSelectFrom(this.gameStateFacade.getClientState().getProjectPlayedModelList(event.getSelectorFilter()))
                break
            }
        }
        this.selectorService.notifyRecalculateSelector()
    }
    onFinalizeEvent(event: EventCardSelector | EventCardSelectorRessource) {   
        Logger.logEventResolution('resolving event: ','EventCardSelector ', event.subType)
        event.finalized = true

        switch(event.subType){
            case('selectCardForcedSell'):case('selectCardOptionalSell'):{
                event.finalized = true
                this.gameStateFacade.removeCardsFromClientHandById(Utils.toCardsIdList(event.getSelectorSelectedList()), 'project')
                this.gameStateFacade.sellCardsFromClientHand(event.getSelectorSelectedQuantity())
                break
            }
            case('researchPhaseResult'):{
                this.gameStateFacade.addCardsSelectedFromListAndDiscardTheRest(
                    ProjectCardInfoService.getProjectCardIdListFromModel(event.getSelectorSelectedList()),
                    ProjectCardInfoService.getProjectCardIdListFromModel(event.getSelectorSelectFrom())
                )
                break
            }
            case('selectStartingHand'):{
                let drawNumber = event.getSelectorSelectedQuantity()
                event.finalized = true
                this.gameStateFacade.removeCardsFromClientHandByModel(event.getSelectorSelectedList(), 'project')
                this.eventQueue.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber}}), 'first')
                break
            }
            case('selectCorporation'):{
                event.finalized = true
                this.gameStateFacade.playCorporation(event.getSelectorSelectedList()[0])
                break
            }
            case('selectMerger'):{
                event.finalized = true
                this.gameStateFacade.playCorporation(event.getSelectorSelectedList()[0], true)
                this.gameStateFacade.applyAverageStartingMegacredits()
                break
            }
            case('recallCardInHand'):{
                event.finalized = true
                if(event.hasSelectorCardSelected()===false){break}
                this.gameStateFacade.recallCardFromPlayed(event.getSelectorSelectedList()[0])
                break
            }
            case('doubleProduction'):{
                event.finalized = true
                this.gameStateFacade.applyDoubleProduction(event.getSelectorSelectedList()[0])
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventCardSelector: ', event)}
        }
        event.activateSelection()
    }
}