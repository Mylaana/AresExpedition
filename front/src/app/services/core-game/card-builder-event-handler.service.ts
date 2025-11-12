import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EventCardBuilder } from "../../models/core-game/event.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventCardBuilderButton } from "../../models/core-game/button.model";
import { CardBuilder } from "../../models/core-game/card-builder.model";
import { EventFactory } from "../../factory/event/event-factory";

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
        if(!this._currentEvent){return}
    }
    public applySelection(card: PlayableCardModel){
        if(!this._currentEvent){return}
        this._currentEvent.applyCardSelected(card)
    }
    public onCardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder){
        if(!this._currentEvent){return}
        this._currentEvent.cardBuilderButtonClicked(button, nonCurrentBuilder)
        switch(button.name){
                case('buildCard'):{
                    let card = this._currentEvent.getCardToBuildId()
                    if(card===undefined){return}
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
    }
}