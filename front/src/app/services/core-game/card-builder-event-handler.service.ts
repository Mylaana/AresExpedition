import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventCardBuilder } from "../../models/core-game/event.model";
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
    //_alternativeCostButtonNames: string[] = []
    //_alternativeCostButtons!: NonEventButton[]

    private alternativeCostUnlocked$ = new BehaviorSubject<NonEventButtonNames[]>([])
    currentAlternativeCostUnlocked = this.alternativeCostUnlocked$.asObservable()

    private builderIsComplete$ = new BehaviorSubject<boolean>(false)
    currentBuilderIsComplete = this.builderIsComplete$.asObservable()

    private activeBuilderDiscount$ = new BehaviorSubject<number>(0)
    currentActiveBuilderDiscount = this.activeBuilderDiscount$.asObservable()

    private notifyRecalculateSelector$ = new Subject<void>()
    currentNotifyRecalculateSelector = this.notifyRecalculateSelector$.asObservable()

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
    }
    public applySelection(card: PlayableCardModel){
        if(!this._currentEvent){return}
        this._currentEvent.applyCardSelected(card)
        this.notifyRecalculateSelector$.next()
    }
    public onCardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder){
        if(!this._currentEvent){return}
        switch(button.name){
            case('buildCard'):{
                let card = this._currentEvent.getCardToBuild()
                if(card===undefined){return}
                this._currentEvent.lockCurrentBuilder()
                this.gameStateService.addEventQueue(EventFactory.createGeneric('buildCard', {card:card}), 'first')
                this._currentEvent.setSelectorSelectFrom(this.gameStateService.getClientHandModelList(this._currentEvent.getSelectorFilter()))
                break
            }
            /*
            case(BuilderOption.drawCard):{
                this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}), 'first')
                break
            }
            case(BuilderOption.gain6MC):{
                this.gameStateService.addEventQueue(EventFactory.createGeneric('addRessourceToPlayer',{baseRessource:{name:"megacredit",valueStock:6}}), 'first')
                break
            }
            */
        }
        this._currentEvent.cardBuilderButtonClicked(button, nonCurrentBuilder)
        if(this._currentEvent.isComplete()){
            this.builderIsComplete$.next(true)
        }
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
    public onAlternativeOptionButtonClicked(button: NonEventButton){
        
        console.log(button)
        return
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
}