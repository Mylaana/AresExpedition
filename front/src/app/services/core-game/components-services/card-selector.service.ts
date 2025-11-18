import { Injectable } from "@angular/core";
import { EventBaseCardSelector } from "../../../models/core-game/event.model";
import { PlayerStateModel } from "../../../models/player-info/player-state.model";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventSelectorHandlerService{
    private _currentEvent$ = new BehaviorSubject<EventBaseCardSelector | null>(null)
    currentEventSelector = this._currentEvent$.asObservable()

    _currentState!: PlayerStateModel

    _alternativeCostCodes: string[] = []

    private notifyRecalculateSelector$ = new Subject<void>()
    currentNotifyRecalculateSelector = this.notifyRecalculateSelector$.asObservable()

    public onEventUpdate(event: EventBaseCardSelector | null){
        this._currentEvent$.next(event)
    }
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
}