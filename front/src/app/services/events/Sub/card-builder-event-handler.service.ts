import { Injectable } from "@angular/core"
import { BehaviorSubject, Subject } from "rxjs"
import { EventFactory } from "../../../factory/event/event-factory"
import { PlayableCard } from "../../../factory/playable-card.factory"
import { PlayableCardModel } from "../../../models/cards/project-card.model"
import { EventCardBuilderButton, NonEventButton } from "../../../models/core-game/button.model"
import { CardBuilder } from "../../../models/core-game/card-builder.model"
import { EventCardBuilder, EventBaseModel } from "../../../models/core-game/event.model"
import { PlayerStateModel } from "../../../models/player-info/player-state.model"
import { NonEventButtonNames } from "../../../types/global.type"
import { GameStateFacadeService } from "../../game-state/game-state-facade.service"
import { EventProcessor } from "../event-processor.service"

@Injectable({
    providedIn: 'root'
})
export class CardBuilderEventHandlerService{
    private _currentEvent$ = new BehaviorSubject<EventCardBuilder | null>(null)
    currentEventBuilder = this._currentEvent$.asObservable()
    _currentState!: PlayerStateModel

    _alternativeCostCodes: string[] = []

    private alternativeCostUnlocked$ = new BehaviorSubject<NonEventButtonNames[]>([])
    currentAlternativeCostUnlocked = this.alternativeCostUnlocked$.asObservable()

    private builderIsComplete$ = new BehaviorSubject<boolean>(false)
    currentBuilderIsComplete = this.builderIsComplete$.asObservable()

    private activeBuilderDiscount$ = new BehaviorSubject<number>(0)
    currentActiveBuilderDiscount = this.activeBuilderDiscount$.asObservable()

    private notifyRecalculateSelector$ = new Subject<void>()
    currentNotifyRecalculateSelector = this.notifyRecalculateSelector$.asObservable()

    private notifyRecalculateCardBuilder$ = new Subject<void>()
    currentNotifyRecalculateCardBuilder = this.notifyRecalculateCardBuilder$.asObservable()

    private cardBuilder$ = new BehaviorSubject<CardBuilder[]>([])
    currentCardBuilder = this.cardBuilder$.asObservable()

    constructor(
        private gameStateService: GameStateFacadeService,
    ){
        this.gameStateService.currentClientState.subscribe(state => this.onClientStateUpdate(state))
    }
    private onClientStateUpdate(state: PlayerStateModel){
        let alternativeCodes = PlayableCard.getAlternativePayActiveCodeList(state)
        if(alternativeCodes===this._alternativeCostCodes){return}
        this._alternativeCostCodes = alternativeCodes
        let names: NonEventButtonNames[] = []
        for(let code of this._alternativeCostCodes){
            let buttonName = PlayableCard.getAlternativePayCaption(code)
            if(!buttonName){continue}
            names.push(buttonName)
        }
        this.alternativeCostUnlocked$.next(names)
    }
    public getCurrentEvent(): EventCardBuilder | null{
        return this._currentEvent$.getValue()
    }
    public onEventUpdate(event: EventCardBuilder | null){
        this._currentEvent$.next(event)
        if(!event){return}
        this.builderIsComplete$.next(event.isComplete())
        this.activeBuilderDiscount$.next(event.getCurrentBuilderDiscount())
        this.notifyRecalculateCardBuilder$.next()
        this.cardBuilder$.next(event.cardBuilder)
    }
    public applySelection(card: PlayableCardModel){
        let currentEvent = this.getCurrentEvent()
        if(!currentEvent){return}
        currentEvent.applyCardSelected(card)
        this.notifyRecalculateSelector()
    }
    public onCardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder){
        let currentEvent = this.getCurrentEvent()
        if(!currentEvent){return}
        let newEvents: EventBaseModel[] = []
        switch(button.name){
            case('buildCard'):{
                let card = currentEvent.getCardToBuild()
                if(card===undefined){return}
                currentEvent.lockCurrentBuilder()
                currentEvent.setSelectorSelectFrom(this.gameStateService.getClientHandModelList(currentEvent.getSelectorFilter()))
                newEvents = [EventFactory.createGeneric('buildCard', {card:card})]
                break
            }
            case('discardSelectedCard'):{
            }
        }
        currentEvent.cardBuilderButtonClicked(button, nonCurrentBuilder)
        this.checkIfComplete()
        this.gameStateService.addEventQueue(newEvents, 'first')
    }
    public onAlternativePayButtonClicked(button: NonEventButton){
        /*
        if(!this._currentEvent){return}
		let events = PlayableCard.getAlternativePayButtonClickedEvents(button.name)
		if(events.length===0){return}
        this._currentEvent.resolveCurrentBuilderAlternativeCostUsed(button.name)
		this.gameStateService.addEventQueue(events, 'first')
        this.activeBuilderDiscount$.next(this._currentEvent.getCurrentBuilderDiscount())
        this.notifyRecalculateSelector$.next()
        */
    }
    public onAlternativeOptionButtonClicked(button: NonEventButton, builder: CardBuilder){
        /*
        if(!this._currentEvent){return}
		let events = PlayableCard.getBuilderAlternativeOptionButtonClickedEvents(button.name)
		if(events.length===0){return}
        this._currentEvent.resolveBuilderAlternativeOptionUsed(builder, button.name)
		this.gameStateService.addEventQueue(events, 'first')
        this.notifyRecalculateSelector$.next()
        this.checkIfComplete()
        */
    }
    private checkIfComplete() {
        /*
        if(!this._currentEvent){return}
        if(this._currentEvent.isComplete()){
            this.builderIsComplete$.next(true)
        } else {
            this.notifyRecalculateSelector$.next()
        }
            */
    }
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
}