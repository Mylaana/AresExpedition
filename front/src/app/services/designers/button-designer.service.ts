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
			case('rollBack'):{startEnabled=true;break}
			case('settings'):{startEnabled=true;break}

			case('buyForest'):{startEnabled=true;break}
			case('convertForest'):{startEnabled=true;break}
			case('buyTemperature'):{startEnabled=true;break}
			case('convertTemperature'):{startEnabled=true;break}
			case('buyInfrastructure'):{startEnabled=true;break}
			case('convertInfrastructure'):{startEnabled=true;break}
			case('buyOcean'):{startEnabled=true;break}

			//cards
			case('activateProjectOnce'):{startEnabled=true; break}
			case('activateProjectTwice'):{startEnabled=false; break}

			//global
			case('closeSettings'):{startEnabled=true;break}

            default:{startEnabled=false;break}
        }
        return startEnabled
    }
    private static getCaption(buttonRule: EventUnionSubTypes | NonEventButtonNames): string {
        let caption: string

        switch(buttonRule){
			//events related rules
            case('default'):{caption='default validation button';break}
            case('planificationPhase'):{caption='$other_validate$';break}
            case('upgradePhaseCards'):{caption='End upgrades';break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{caption='$other_validate$';break}
            case('addRessourceToSelectedCard'):{caption='Add ressources';break}
            case('actionPhase'):{caption='$other_validate$';break}
            case('researchPhaseResult'):{caption='$other_validate$';break}
            case('selectCardForcedSell'):{caption='$other_validate$';break}
            case('selectCardOptionalSell'):{caption='$other_validate$';break}
            case('discardCards'):{caption='$other_validate$';break}
            case('scanKeepResult'):{caption='Add selection to hand';break}

			//button name related rules
			case('sellOptionalCard'):{caption='$other_sell_card$';break}
			case('sellOptionalCardCancel'):{caption='$other_cancel$';break}
			case('rollBack'):{caption='$other_rollback$';break}
			case('settings'):{caption='$other_settings$';break}

			case('convertForest'):{caption='8$ressource_plant$ $other_arrow$ $other_forest$';break}
			case('buyForest'):{caption='$ressource_megacreditvoid_16$ $other_arrow$ $other_forest$';break}
			case('buyTemperature'):{caption='$ressource_megacreditvoid_14$ $other_arrow$$other_temperature$';break}
			case('convertTemperature'):{caption='$ressource_heat$ $other_arrow$ $other_temperature$';break}
			case('convertInfrastructure'):{caption='5$ressource_heat$ + 3$ressource_plant$ $skipline$$other_arrow$ $skipline$ $other_infrastructure$ + $other_card$';break}
			case('buyInfrastructure'):{caption='$ressource_megacreditvoid_15$ $other_arrow$ $skipline$ $other_infrastructure$ + $other_card$';break}
			case('buyOcean'):{caption='$ressource_megacreditvoid_16$ $other_arrow$ $other_ocean$';break}


			//cards
			case('activateProjectOnce'):{caption='$other_activate$'; break}
			case('activateProjectTwice'):{caption='$other_double_activate$'; break}

			//global
			case('closeSettings'):{caption='$other_cancel$';break}

            default:{caption='';break}
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
            case('drawCard'):{button.caption = '$ressource_card$';break}
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
