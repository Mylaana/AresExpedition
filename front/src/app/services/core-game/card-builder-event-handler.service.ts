import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventCardBuilder } from "../../models/core-game/event.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";

@Injectable({
    providedIn: 'root'
})
export class CardBuilderEventHandlerService{
    currentEvent!: EventCardBuilder | null

    constructor(
        private gameStateService: GameStateFacadeService
    ){
        this.gameStateService.currentEventBuilder.subscribe(event => this.onEventUpdate(event))
    }

    private onEventUpdate(event: EventCardBuilder | null){
        this.currentEvent = event
        if(!this.currentEvent){return}
    }
    public applySelection(card: PlayableCardModel){
        if(!this.currentEvent){return}
        this.currentEvent.
    }
}