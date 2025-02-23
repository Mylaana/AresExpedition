import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../../types/event.type";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, NonEventButton } from "../../models/core-game/button.model";
import { CardBuilderOptionType, EventCardBuilderButtonNames, NonEventButtonNames } from "../../types/global.type";


@Injectable({
    providedIn: 'root'
})
export class ButtonDesigner{
    private static getStartEnabled(buttonRule: EventUnionSubTypes | NonEventButtonNames) : boolean {
        let startEnabled: boolean

        switch(buttonRule){
			//events related rules
            case('default'):{startEnabled=true;break}
            case('upgradePhaseCards'):{startEnabled=true;break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{startEnabled=true;break}
            case('actionPhase'):{startEnabled=true;break}
            case('selectCardOptionalSell'):{startEnabled=false;break}

			//button name related rules
			case('sellOptionalCard'):{startEnabled=true;break}
			case('sellOptionalCardCancel'):{startEnabled=false;break}

            default:{startEnabled=false;break}
        }
        return startEnabled
    }
    private static getCaption(buttonRule: EventUnionSubTypes | NonEventButtonNames): string {
        let caption: string

        switch(buttonRule){
			//events related rules
            case('default'):{caption='default validation button';break}
            case('planificationPhase'):{caption='Select Phase';break}
            case('upgradePhaseCards'):{caption='End upgrades';break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{caption='End phase';break}
            case('addRessourceToSelectedCard'):{caption='Add ressources';break}
            case('actionPhase'):{caption='End phase';break}
            case('researchPhaseResult'):{caption='Research';break}
            case('selectCardForcedSell'):{caption='Sell selection';break}
            case('selectCardOptionalSell'):{caption='Sell selection';break}
            case('discardCards'):{caption='Discard selection';break}
            case('scanKeepResult'):{caption='Add selection to hand';break}

			//button name related rules
			case('sellOptionalCard'):{caption='$ressource_card$ $other_arrow$ $ressource_megacredit$';break}
			case('sellOptionalCardCancel'):{caption='Cancel selling cards';break}

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
                    case(1):{button.name='cancelSelectCard';button.caption='$other_cancel$';break}
                    case(2):{button.name='buildCard';button.caption='$other_validate$';break}
					case(3):{button.name='discardSelectedCard';button.caption='$other_cancel$';break}
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
            case('gain6MC'):{button.caption = '+ $ressource_megacreditvoid_6$';break}
            case('drawCard'):{button.caption = '+ $ressource_card$';break}
        }
        button.startEnabled=true
        button.name = option as EventCardBuilderButtonNames
        button.enabled = button.startEnabled
        buttons.push(button)

        return buttons
    }
	public static createNonEventButton(name: NonEventButtonNames){
		let button = new NonEventButton
		button.name = name
        button.startEnabled = this.getStartEnabled(name)
        button.enabled = button.startEnabled
        button.caption = this.getCaption(name)

        return button
	}
}
