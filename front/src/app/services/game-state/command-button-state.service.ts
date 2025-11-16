import { Injectable } from "@angular/core";
import { GameEventQueueService } from "./sub-service/game-event-queue.service";
import { EventBaseCardSelector, EventBaseModel } from "../../models/core-game/event.model";
import { EventMainButton } from "../../models/core-game/button.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommandButtonStateService {
    private _eventMainButtonUpdated$ = new BehaviorSubject<EventMainButton | null>(null)
    currentEventMainButtonUpdated$ = this._eventMainButtonUpdated$.asObservable()
    
    private currentEvent!: EventBaseModel | null

    constructor(
        private gameEventQueueService: GameEventQueueService
    ){
        this.gameEventQueueService._eventWithMainButton$.subscribe(event => this.onEventWithMainButtonUpdate(event))
    }
    
    private onEventWithMainButtonUpdate(event: EventBaseModel | null){
        this.currentEvent = event
        this.updateCurrentEventMainButton()
    }

    public updateCurrentEventMainButton(){
        if(!this.currentEvent){return}
        let button = this.currentEvent.button
        if(!button){return}
        if(this.currentEvent.hasCardActivator()){
            //handled directly by dedicated service
            this._eventMainButtonUpdated$.next(button)
            return
        }
        if(!this.currentEvent.hasSelector()){
            this._eventMainButtonUpdated$.next(button)
            return
        }
        this.updateEventMainButtonStateIfHasSelector(this.currentEvent as EventBaseCardSelector)
    }
    private updateEventMainButtonStateIfHasSelector(event: EventBaseCardSelector){
        let selector = event.getCardSelector()
        let button = event.button
        if(!button){return}
        button.updateEnabledTreshold({
            treshold: selector.selectionQuantityTreshold,
            tresholdValue: selector.selectionQuantity,
            value: selector.selectedList.length
        })
        this._eventMainButtonUpdated$.next(button)
    }
}