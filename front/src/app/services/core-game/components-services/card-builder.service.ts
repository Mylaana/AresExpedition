import { Injectable } from "@angular/core"
import { BehaviorSubject, Subject } from "rxjs"
import { PlayableCard } from "../../../factory/playable-card.factory"
import { PlayableCardModel } from "../../../models/cards/project-card.model"
import { EventCardBuilderButton, NonEventButton } from "../../../models/core-game/button.model"
import { CardBuilder } from "../../../models/core-game/card-builder.model"
import { EventCardBuilder } from "../../../models/core-game/event.model"
import { PlayerStateModel } from "../../../models/player-info/player-state.model"
import { NonEventButtonNames } from "../../../types/global.type"
import { GameStateFacadeService } from "../../game-state/game-state-facade.service"
import { EventBuilderCommand } from "../../../interfaces/services.interface"

@Injectable({
    providedIn: 'root'
})
export class CardBuilderService{
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

    private builderButtonCommand$ = new Subject<EventBuilderCommand>()
    currentBuilderButtonCommand = this.builderButtonCommand$.asObservable()

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
        this.builderButtonCommand$.next({buttonName: button.name, commandType: 'base', builderIndex:nonCurrentBuilder?.getIndex()})
    }
    public onAlternativePayButtonClicked(button: NonEventButton){
        this.builderButtonCommand$.next({buttonName: button.name, commandType: 'alternativePay'})
        this.notifyRecalculateSelector$.next()
    }
    public onAlternativeOptionButtonClicked(button: NonEventButton, builder: CardBuilder){
        this.builderButtonCommand$.next({buttonName: button.name, builderIndex: builder.getIndex(), commandType: 'alternativeOption'})
    }
    /*
    private checkIfComplete() {
        if(!this._currentEvent){return}
        if(this._currentEvent.isComplete()){
            this.builderIsComplete$.next(true)
        } else {
            this.notifyRecalculateSelector$.next()
        }
    }
    */
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
    public notifyNewDiscount(discount: number){
        this.activeBuilderDiscount$.next(discount)
    }
}