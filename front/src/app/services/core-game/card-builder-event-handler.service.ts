import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventBaseModel, EventCardBuilder } from "../../models/core-game/event.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventCardBuilderButton, NonEventButton } from "../../models/core-game/button.model";
import { CardBuilder } from "../../models/core-game/card-builder.model";
import { EventFactory } from "../../factory/event/event-factory";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { BehaviorSubject, Subject } from "rxjs";
import { NonEventButtonNames } from "../../types/global.type";
import { PlayableCard } from "../../factory/playable-card.factory";

@Injectable({
    providedIn: 'root'
})
export class CardBuilderEventHandlerService{
    _currentEvent!: EventCardBuilder | null
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
        this.gameStateService.currentEventBuilder.subscribe(event => {this.onEventUpdate(event)})
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
        return this._currentEvent
    }
    private onEventUpdate(event: EventCardBuilder | null){
        this._currentEvent = event
        if(!this._currentEvent){return}
        this.builderIsComplete$.next(this._currentEvent.isComplete())
        this.activeBuilderDiscount$.next(this._currentEvent.getCurrentBuilderDiscount())
        this.notifyRecalculateCardBuilder$.next()
        this.cardBuilder$.next(this._currentEvent.cardBuilder)
    }
    public applySelection(card: PlayableCardModel){
        if(!this._currentEvent){return}
        this._currentEvent.applyCardSelected(card)
        this.notifyRecalculateSelector()
    }
    public onCardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder){
        if(!this._currentEvent){return}
        let newEvents: EventBaseModel[] = []
        switch(button.name){
            case('buildCard'):{
                let card = this._currentEvent.getCardToBuild()
                if(card===undefined){return}
                this._currentEvent.lockCurrentBuilder()
                this._currentEvent.setSelectorSelectFrom(this.gameStateService.getClientHandModelList(this._currentEvent.getSelectorFilter()))
                newEvents = [EventFactory.createGeneric('buildCard', {card:card})]
                break
            }
            case('discardSelectedCard'):{
            }
        }
        this._currentEvent.cardBuilderButtonClicked(button, nonCurrentBuilder)
        this.checkIfComplete()
        this.gameStateService.addEventQueue(newEvents, 'first')
    }
    public onAlternativePayButtonClicked(button: NonEventButton){
        if(!this._currentEvent){return}
		let events = PlayableCard.getAlternativePayButtonClickedEvents(button.name)
		if(events.length===0){return}
        this._currentEvent.resolveCurrentBuilderAlternativeCostUsed(button.name)
		this.gameStateService.addEventQueue(events, 'first')
        this.activeBuilderDiscount$.next(this._currentEvent.getCurrentBuilderDiscount())
        this.notifyRecalculateSelector$.next()
    }
    public onAlternativeOptionButtonClicked(button: NonEventButton, builder: CardBuilder){
        if(!this._currentEvent){return}
		let events = PlayableCard.getBuilderAlternativeOptionButtonClickedEvents(button.name)
		if(events.length===0){return}
        this._currentEvent.resolveBuilderAlternativeOptionUsed(builder, button.name)
		this.gameStateService.addEventQueue(events, 'first')
        this.notifyRecalculateSelector$.next()
        this.checkIfComplete()
    }
    private checkIfComplete() {
        if(!this._currentEvent){return}
        if(this._currentEvent.isComplete()){
            this.builderIsComplete$.next(true)
        } else {
            this.notifyRecalculateSelector$.next()
        }
    }
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
}