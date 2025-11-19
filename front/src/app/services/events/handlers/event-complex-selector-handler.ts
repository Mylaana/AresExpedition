import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventComplexCardSelector } from "../../../models/core-game/event.model";
import { DeckQueryOptionsEnum, DiscardOptionsEnum } from "../../../enum/global.enum";
import { Logger, Utils } from "../../../utils/utils";
import { EventFactory } from "../../../factory/event/event-factory";
import { PlayableCard } from "../../../factory/playable-card.factory";
import { ProjectCardInfoService } from "../../cards/project-card-info.service";

@Injectable()
export class EventComplexSelectorHandler implements GameEventHandler<EventComplexCardSelector> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='ComplexSelector'
    }
    onSwitchEvent(event: EventComplexCardSelector){
        if(event.refreshSelectorOnSwitch){event.setSelectorSelectFrom(this.gameStateFacade.getClientHandModelList(event.getSelectorFilter()))}
        switch(event.subType){
            case('discardCards'):{
                event.activateSelection()
                event.setSelectorStateFromParent(Utils.toFullCardState({selectable:true, ignoreCost:true}))
                break
            }
            case('scanKeepResult'):{
                switch(event.scanKeepOptions){
                    case(DeckQueryOptionsEnum.modPro):{
                        let card = this.gameStateFacade.getClientProjectPlayedModelList().filter((el)=>el.cardCode==='P32')[0]
                        if(!card){break}
                        let tag = Utils.toTagType(card.tagsId[0])
                        if(!event.getSelectorFilter()){break}
                        event.setSelectorFilterAuthorizedTag([tag])
                        event.title = `Modpro : add one card to hand with an ${tag[0].toUpperCase() + tag.slice(1)} tag`
                        break
                    }
                }
            }
        }
    }
    onFinalizeEvent(event: EventComplexCardSelector) {   
        Logger.logEventResolution('resolving event: ','EventScanKeepCardSelector ', event.subType)
        event.finalized = true
        switch(event.subType){
            case('discardCards'):{
                event.finalized = true
                let discardedList = event.getSelectorSelectedList()
                this.gameStateFacade.removeCardsFromClientHandById(Utils.toCardsIdList(discardedList), 'project')

                switch(event.discardOptions){
                    case(DiscardOptionsEnum.marsUniversity):{
                        if(event.hasSelectorCardSelected()===false){break}
                        let clientState = this.gameStateFacade.getClientState()
                        let newEvents = PlayableCard.getOnTriggerredEvents(
                                'ON_TRIGGER_RESOLUTION',
                                clientState.getTriggersIdActive(),
                                clientState,
                                {discardedCard:discardedList[0]}
                            )
                        this.gameStateFacade.addEventQueue(
                            newEvents,
                            'first'
                        )
                        break
                    }
                    case(DiscardOptionsEnum.redraftedContracts):{
                        if(event.hasSelectorCardSelected()===false){break}
                        this.gameStateFacade.addEventQueue(
                            EventFactory.simple.draw(event.getSelectorSelectedQuantity()),
                            'first'
                        )
                        break
                    }
                    case(DiscardOptionsEnum.matterGenerator):{
                        if(event.hasSelectorCardSelected()===false){break}
                        this.gameStateFacade.addEventQueue(EventFactory.simple.addRessource({name:'megacredit', valueStock:6}), 'first')
                        break
                    }
                    case(DiscardOptionsEnum.clm):{
                        if(event.hasSelectorCardSelected()===false){break}
                        this.gameStateFacade.addEventQueue(EventFactory.simple.addRessource({name:'megacredit', valueStock:10}), 'first')
                        break
                    }
                }
                break
            }
            case('scanKeepResult'):{
                switch(event.scanKeepOptions){
                    case(DeckQueryOptionsEnum.brainstormingSession):{
                        let card = event.getSelectorSelectFrom()[0]
                        switch(card.cardType){
                            case ('greenProject'):{
                                this.gameStateFacade.addEventQueue(EventFactory.simple.addRessource({name:'megacredit', valueStock:1}), 'first')
                                break
                            }
                            case('blueProject'):case('redProject'):{
                                this.gameStateFacade.addCardsToClientHand(card.cardCode)
                            }
                        }
                    }
                }
                if(event.hasSelectorCardSelected()){
                    this.gameStateFacade.addCardsSelectedFromListAndDiscardTheRest(
                        ProjectCardInfoService.getProjectCardIdListFromModel(event.getSelectorSelectedList()),
                        ProjectCardInfoService.getProjectCardIdListFromModel(event.getSelectorSelectFrom())
                    )
                }
            }
        }
    }
}