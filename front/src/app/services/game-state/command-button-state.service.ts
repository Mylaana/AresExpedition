import { Injectable } from "@angular/core";
import { EventQueueService } from "../events/event-queue.service";
import { EventBaseCardSelector, EventBaseModel } from "../../models/core-game/event.model";
import { EventMainButton } from "../../models/core-game/button.model";
import { BehaviorSubject } from "rxjs";
import { EventProcessor } from "../events/event-processor.service";

@Injectable({
    providedIn: 'root'
})
export class CommandButtonStateService {
    private _eventMainButtonUpdated$ = new BehaviorSubject<EventMainButton | null>(null)
    currentEventMainButtonUpdated$ = this._eventMainButtonUpdated$.asObservable()
    
    private currentEvent!: EventBaseModel | null

    
    public onEventWithMainButtonUpdate(event: EventBaseModel | null){
        this.currentEvent = event
        this.updateCurrentEventMainButton()
    }

    public updateCurrentEventMainButton(){
        if(!this.currentEvent){return}
        let button = this.currentEvent.button
        if(!button){return}
        if(this.currentEvent.hasCardActivator()){
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