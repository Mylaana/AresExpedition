import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventCardBuilder } from "../../models/core-game/event.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventCardBuilderButton, NonEventButton } from "../../models/core-game/button.model";
import { CardBuilder } from "../../models/core-game/card-builder.model";

@Injectable({
    providedIn: 'root'
})
export class CardBuilderEventHandlerService{
    _currentEvent!: EventCardBuilder | null

    constructor(
        private gameStateService: GameStateFacadeService
    ){
        this.gameStateService.currentEventBuilder.subscribe(event => {this.onEventUpdate(event)})
    }
    public getCurrentEvent(): EventCardBuilder | null{
        return this._currentEvent
    }
    private onEventUpdate(event: EventCardBuilder | null){
        this._currentEvent = event
        console.log(this._currentEvent)
        if(!this._currentEvent){return}
    }
    public applySelection(card: PlayableCardModel){
        if(!this._currentEvent){return}
        this._currentEvent.applyCardSelected(card)
    }
    public onCardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder){
        if(!this._currentEvent){return}
        this._currentEvent.cardBuilderButtonClicked(button, nonCurrentBuilder)
    }
}