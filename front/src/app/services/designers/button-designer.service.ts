import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, EventButtonBase } from "../../models/core-game/button.model";
import { CardBuilderOptionType, EventCardBuilderButtonNames } from "../../types/global.type";


@Injectable({
    providedIn: 'root'
})
export class ButtonDesigner{
    private static getStartEnabled(eventSubType: EventUnionSubTypes) : boolean {
        let startEnabled: boolean

        switch(eventSubType){
            case('default'):{startEnabled=true;break}
            case('createEventOptionalSell'):{startEnabled=true;break}
            case('cancelEventOptionalSell'):{startEnabled=true;break}
            case('upgradePhaseCards'):{startEnabled=true;break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{startEnabled=true;break}
            case('actionPhase'):{startEnabled=true;break}
            case('selectCardOptionalSell'):{startEnabled=true;break}
            default:{startEnabled=false;break}
        }
        return startEnabled
    }
    private static getCaption(eventSubType: EventUnionSubTypes): string {
        let caption: string

        switch(eventSubType){
            case('default'):{caption='default validation button';break}
            case('planificationPhase'):{caption='Select Phase';break}
            case('createEventOptionalSell'):{caption='Sell cards';break}
            case('cancelEventOptionalSell'):{caption='Cancel';break}
            case('upgradePhaseCards'):{caption='End upgrades';break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{caption='End phase';break}
            case('addRessourceToSelectedCard'):{caption='Add ressources';break}
            case('actionPhase'):{caption='End phase';break}
            case('researchPhaseResult'):{caption='Research';break}
            case('selectCardForcedSell'):{caption='Sell selection';break}
            case('selectCardOptionalSell'):{caption='Sell selection';break}
            case('discardCards'):{caption='Discard selection';break}
            case('scanKeepResult'):{caption='Add selection to hand';break}
            default:{caption='default validation';break}
        }
        return caption
    }
    public static createEventMainButton(eventSubType: EventUnionSubTypes): EventMainButton {
        let button = new EventMainButton
        button.startEnabled = this.getStartEnabled(eventSubType)
        button.enabled = button.startEnabled
        button.caption = this.getCaption(eventSubType)
        button.eventSubType = eventSubType
        return button
    }
    public static createEventSelectorMainButton(eventSubType: EventUnionSubTypes): EventMainButtonSelector {
        let button = new EventMainButtonSelector
        button.startEnabled = this.getStartEnabled(eventSubType)
        button.enabled = button.startEnabled
        button.caption = this.getCaption(eventSubType)
        button.eventSubType = eventSubType
        return button
    }
    public static createEventCardBuilderButton(zoneId:number, option?: CardBuilderOptionType): EventCardBuilderButton[] {
        let buttons: EventCardBuilderButton[] = []
        let buttonCount: number = 4

        for(let i=0; i<buttonCount; i++){
            let button = new EventCardBuilderButton
                switch(i){
                    case(0):{button.name='selectCard';button.caption='Select a card';button.startEnabled=true;break}
                    case(1):{button.name='cancelSelectCard';button.caption='Deactivate selection';break}
                    case(2):{button.name='buildCard';button.caption='Build';break}
					case(3):{button.name='discardSelectedCard';button.caption='Discard selection <X>';break}
                }
            button.parentCardBuilderId=zoneId
            button.enabled = button.startEnabled
            buttons.push(button)
        }

        if(option===undefined){return buttons}
        let button = new EventCardBuilderButton

        button.parentCardBuilderId=zoneId
        button.enabled = button.startEnabled
        switch(option){
            case('gain6MC'):{button.caption = 'Gain 6 MC';break}
            case('drawCard'):{button.caption = 'Draw a card';break}
        }
        button.startEnabled=true
        button.name = option as EventCardBuilderButtonNames
        button.enabled = button.startEnabled
        buttons.push(button)

        return buttons
    }
}
