import { Injectable } from "@angular/core";
import { GameState } from "./game-state.service";
import { EventBaseModel, EventCardSelector } from "../../models/core-game/event.model";


@Injectable({
    providedIn: 'root'
})
export class EventCardSelectorService {

    private currentEventCardSelector!: EventCardSelector
    constructor(private gameStateService: GameState){
        this.gameStateService.currentEventQueue.subscribe((queue) => {this.onEventQueueUpdate(queue); console.log('pouet')})
    }

    onEventQueueUpdate(queue: EventBaseModel[]){
        console.log('updated queue:', queue)
        if(queue.length){return}
        let event = queue[0]
        console.log(event)
        if(event.hasSelector()===false){return}
        this.currentEventCardSelector = event as EventCardSelector
        console.log(this.currentEventCardSelector)
    }
}