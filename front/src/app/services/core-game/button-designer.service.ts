import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, EventSecondaryButton } from "../../models/core-game/button.model";
import { CardBuilderOptionType } from "../../types/global.type";


@Injectable({
    providedIn: 'root'
})
export class ButtonDesigner{
    public static createEventMainButton(eventSubType: EventUnionSubTypes): EventMainButton {
        let button = new EventMainButton
        button.eventSubType = eventSubType

        switch(eventSubType){
            case('default'):{button.caption='default validation button';button.startEnabled=true;break}
            case('planificationPhase'):{button.caption='Select Phase';break}
            case('createEventOptionalSell'):{button.caption='Sell cards';button.startEnabled=true;break}
            case('cancelEventOptionalSell'):{button.caption='Cancel';button.startEnabled=true;break}
            case('upgradePhaseCards'):{button.caption='End upgrades';button.startEnabled=true;break}

            default:{button.caption='default validation';button.startEnabled=true;break}
        }
        
        button.enabled = button.startEnabled
        return button
    }
    public static createEventSelectorMainButton(eventSubType: EventUnionSubTypes): EventMainButtonSelector {
        let button = new EventMainButtonSelector
        button.eventSubType = eventSubType

        switch(eventSubType){
            case('addRessourceToSelectedCard'):{button.caption='Add ressources';break}
            case('developmentPhase'):case('constructionPhase'):case('actionPhase'):case('productionPhase'):{button.caption='End phase';button.startEnabled=true;break}
            case('researchPhaseResult'):{button.caption='Research';button.startEnabled=true;break}
            case('selectCardForcedSell'):{button.caption='Sell selection';break}
            case('selectCardOptionalSell'):{button.caption='Sell selection';button.startEnabled=true;break}
            case('discardCards'):{button.caption='Discard selection';break}
            case('scanKeepResult'):{button.caption='Add selection to hand';break}
            default:{button.caption='default validation';button.startEnabled=true;break}
        }

        button.enabled = button.startEnabled
        return button
    }
    public static createEventCardBuilderButton(zoneId:number, option?: CardBuilderOptionType): EventCardBuilderButton[] {
        let buttons: EventCardBuilderButton[] = []
        let buttonCount: number
        if(option!='alternative'){buttonCount = 3}else{buttonCount = 4}

        for(let i=0; i<buttonCount; i++){
            let button = new EventCardBuilderButton
                switch(i){
                    case(0):{button.name='selectCard';button.caption='Select a card';button.startEnabled=true;break}
                    case(1):{button.name='cancelCard';button.caption='Cancel <X>';break}
                    case(2):{button.name='buildCard';button.caption='Build';break}
                    case(3):{button.name='alternative';button.caption='Alternative';button.startEnabled=true;break}
                }
            button.parentCardBuilderId=zoneId
            button.enabled = button.startEnabled
            buttons.push(button)        
        }
        return buttons
    }
}