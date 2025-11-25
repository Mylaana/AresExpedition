import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventComplexCardSelector, EventDeckQuery } from "../../../models/core-game/event.model";
import { DeckQueryOptionsEnum, DiscardOptionsEnum } from "../../../enum/global.enum";
import { Logger, Utils } from "../../../utils/utils";
import { EventFactory } from "../../../factory/event/event-factory";
import { PlayableCard } from "../../../factory/playable-card.factory";
import { ProjectCardInfoService } from "../../cards/project-card-info.service";
import { DrawEventFactory } from "../../../factory/draw-event-designer.service";
import { ScanKeep } from "../../../interfaces/global.interface";
import { EventUnionSubTypes } from "../../../types/event.type";

@Injectable()
export class EventDeckQueryHandler implements GameEventHandler<EventDeckQuery> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    
    supports(event: EventBaseModel): boolean {
        return event.type==='deck'
    }
    onSwitchEvent(event: EventDeckQuery){

    }
    onFinalizeEvent(event: EventDeckQuery) {   
        Logger.logEventResolution('resolving event: ','EventDeckQuery ', event.subType)
        let resolveType!: EventUnionSubTypes
        event.waiterId = event.id
        switch(event.subType){
            case('drawQuery'):{
                resolveType = 'drawResult'
                break
            }
            case('researchPhaseQuery'):{
                resolveType = 'researchPhaseResult'
                break
            }
            case('scanKeepQuery'):{
                resolveType = 'scanKeepResult'
                break
            }
            case('drawThenDiscard'):{
                resolveType = 'drawResultThenDiscard'
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventDeckQuery: ', event)}
        }

        if((event.drawDiscard===undefined && event.scanKeep===undefined) || event.waiterId===undefined || resolveType===undefined){return}

        //adding a deck waiter event until drawEvent resolution if deck event will draw something
        if((event.drawDiscard?.draw?event.drawDiscard.draw:0)>0 || (event.scanKeep?.scan!=undefined && event.scanKeep.scan>0)){
            this.gameStateFacade.addEventQueue(EventFactory.createWaiter('deckWaiter', event.id), 'second')
        }

        let drawNumber = event.drawDiscard?.draw
        if(drawNumber!=undefined && drawNumber>0){
            this.gameStateFacade.addDrawQueue(
                DrawEventFactory.createDrawEvent(
                    resolveType,
                    drawNumber,
                    event.id,
                    event.isCardProduction,
                    event.drawThenDiscard?event.drawDiscard?.discard:0,
                    event.eventOrigin?.originValue??''
                )
            )
        }
        if(event.scanKeep!==undefined){
            let scanKeep: ScanKeep = {scan:event.scanKeep?.scan?event.scanKeep?.scan:0, keep:event.scanKeep?.keep?event.scanKeep?.keep:0}
            this.gameStateFacade.addDrawQueue(DrawEventFactory.createScanKeepEvent(resolveType, scanKeep, event.waiterId, event.options))
        }
        this.gameStateFacade.cleanAndNextEventQueue()
    }
}