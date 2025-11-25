import { Injectable } from "@angular/core";
import { EventBaseCardSelector } from "../../../models/core-game/event.model";
import { PlayerStateModel } from "../../../models/player-info/player-state.model";
import { BehaviorSubject, Subject } from "rxjs";
import { EventOrigin } from "../../../interfaces/global.interface";

@Injectable({
    providedIn: 'root'
})
export class CardSelectorService{
    private _currentEvent$ = new BehaviorSubject<EventBaseCardSelector | null>(null)
    currentEventSelector = this._currentEvent$.asObservable()

    _currentState!: PlayerStateModel

    _alternativeCostCodes: string[] = []

    private notifyRecalculateSelector$ = new Subject<void>()
    currentNotifyRecalculateSelector = this.notifyRecalculateSelector$.asObservable()

    private eventOrigin = new BehaviorSubject<EventOrigin | null>(null)
    currentEventOrigin = this.eventOrigin.asObservable()

    public onEventUpdate(event: EventBaseCardSelector | null){
        this._currentEvent$.next(event)
        this.eventOrigin.next((!event || !event.eventOrigin)?
            null:
            event.eventOrigin
        )       
    }
    public notifyRecalculateSelector(){
        this.notifyRecalculateSelector$.next()
    }
}