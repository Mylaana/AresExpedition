import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventBaseCardSelector } from "../../models/core-game/event.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CardSelectorEventHandlerService{
    _currentEvent!: EventBaseCardSelector | null
    _currentState!: PlayerStateModel

    _alternativeCostCodes: string[] = []

    private notifyRecalculateSelector$ = new Subject<void>()
    currentNotifyRecalculateSelector = this.notifyRecalculateSelector$.asObservable()

    constructor(
        private gameStateService: GameStateFacadeService,
    ){
        //this.gameStateService.currentClientState.subscribe(state => this.onClientStateUpdate(state))
        this.gameStateService.currentEventSelector.subscribe(event => {this.onEventUpdate(event)})
    }

    private onEventUpdate(event: EventBaseCardSelector | null){
        this._currentEvent = event
        if(!this._currentEvent){return}
        //this.notifyRecalculateSelector$.next()
    }
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
}