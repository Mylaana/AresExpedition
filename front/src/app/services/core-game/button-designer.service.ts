import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventMainButton, EventSecondaryButton } from "../../models/core-game/button.model";

@Injectable({
    providedIn: 'root'
})
export class ButtonDesigner{
    public static createEventMainButton(eventSubType: EventUnionSubTypes): EventMainButton {
        let button = new EventMainButton
        button.eventSubType = eventSubType

        switch(eventSubType){
            case('default'):{button.caption='default validation button';button.startEnabled=true;break}
            case('planification'):{button.caption='Select Phase';break}
            case('developmentPhase'):case('constructionPhase'):case('actionPhase'):case('productionPhase'):{button.caption='End phase';button.startEnabled=true;break}
            case('researchPhaseResult'):{button.caption='Research';button.startEnabled=true;break}
            case('selectCardForcedSell'):{button.caption='Sell selection';break}
            case('selectCardOptionalSell'):{button.caption='Sell selection';button.startEnabled=true;break}
            case('createEeventOptionalSell'):{button.caption='Sell cards';button.startEnabled=true;break}
            case('cancelEventOptionalSell'):{button.caption='Cancel';button.startEnabled=true;break}
            case('upgradePhaseCards'):{button.caption='End upgrades';break}
            case('addRessourceToSelectedCard'):{button.caption='Add ressources';break}
            case('discardCards'):{button.caption='Discard selection';break}
            case('scanKeepResult'):{button.caption='Add selection to hand';break}

            default:{button.caption='default validation';button.startEnabled=true;break}
        }

        return button
    }
    public static createEventSecondaryButton(eventSubType:EventUnionSubTypes, args: {zoneId?: number}): EventSecondaryButton[] {
        let buttons: EventSecondaryButton[] = []
        switch(eventSubType){
            case('developmentPhase'):case('constructionPhase'):{
                for(let i=0; i<3; i++){
                    let button = new EventSecondaryButton
                    if(args?.zoneId===0){
                        switch(i){
                            case(0):{button.name='selectFirstCard';button.caption='Select a card';button.startEnabled=true;break}
                            case(1):{button.name='cancelFirstCard';button.caption='Cancel <X>';break}
                            case(2):{button.name='buildFirstCard';button.caption='Build';break}
                        }
                    } else {
                        switch(i){
                            case(0):{button.name='selectSecondCard';button.caption='Select a card';button.startEnabled=true;break}
                            case(1):{button.name='cancelSecondCard';button.caption='Cancel <X>';break}
                            case(2):{button.name='buildSecondCard';button.caption='Build';break}
                        }
                    }
                    buttons.push(button)
                }
            }
        }
        return buttons
    }
}