import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../types/event.type";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, NonEventButton, ColorButton } from "../models/core-game/button.model";
import { CardBuilderOptionType, EventCardBuilderButtonNames, NonEventButtonNames, PlayerColor } from "../types/global.type";


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
            case('actionPhaseActivator'):{startEnabled=true;break}
            case('selectCardOptionalSell'):{startEnabled=false;break}
			case('planificationPhase'):{startEnabled=false;break}
			case('selectStartingHand'):{startEnabled=true;break}
			case('selectCorporation'):{startEnabled=false;break}
			case('scanKeepResult'):{startEnabled=false;break}

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
			case('upgradePhase'):{startEnabled=true;break}

			//global
			case('closeSettings'):{startEnabled=true;break}

			//router
			case('routeCreateGame'):{startEnabled=true; break}
			case('routeCardOverview'):{startEnabled=true; break}
			case('routeBuy'):{startEnabled=true; break}
			case('routeHome'):{startEnabled=true; break}
			case('routeCreateNewGameValidation'):{startEnabled=true; break}

			//create game
			case('createGamePlayerNumber'):{startEnabled=true; break}

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
            case('upgradePhaseCards'):{caption='$other_validate$';break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{caption='$other_validate$';break}
            case('addRessourceToSelectedCard'):{caption='$other_validate$';break}
            case('researchPhaseResult'):{caption='$other_validate$';break}
            case('selectCardForcedSell'):{caption='$other_validate$';break}
            case('selectCardOptionalSell'):{caption='$other_validate$';break}
            case('discardCards'):{caption='$other_validate$';break}
            case('scanKeepResult'):{caption='$other_validate$';break}
			case('selectStartingHand'):{caption='$other_validate$';break}
			case('selectCorporation'):{caption='$other_validate$';break}
			case('actionPhaseActivator'):{caption='$other_validate$';break}

			//button name related rules
			case('sellOptionalCard'):{caption='$other_sellcard$';break}
			case('sellOptionalCardCancel'):{caption='$other_cancel$';break}
			case('rollBack'):{caption='$other_rollback$';break}
			case('settings'):{caption='$other_settings$';break}

			case('buyForest'):{caption='$ressource_megacreditvoid_16$ $other_arrow$ $other_forest$';break}
			case('buyTemperature'):{caption='$ressource_megacreditvoid_14$ $other_arrow$$other_temperature$';break}
			case('convertTemperature'):{caption='$ressource_heat$ $other_arrow$ $other_temperature$';break}
			case('convertInfrastructure'):{caption='5$ressource_heat$ + 3$ressource_plant$ $skipline$$other_arrow$ $skipline$ $other_infrastructure$ + $other_card$';break}
			case('buyInfrastructure'):{caption='$ressource_megacreditvoid_15$ $other_arrow$ $skipline$ $other_infrastructure$ + $other_card$';break}
			case('buyOcean'):{caption='$ressource_megacreditvoid_16$ $other_arrow$ $other_ocean$';break}

			//cards
			case('activateProjectOnce'):{caption='$other_activate$'; break}
			case('activateProjectTwice'):{caption='$other_double_activate$'; break}
			case('upgradePhase'):{caption='Upgrade';break}

			//global
			case('closeSettings'):{caption='$other_cancel$';break}

			//router
			case('routeCreateGame'):{caption='NEW GAME'; break}
			case('routeCardOverview'):{caption='CARD OVERVIEW'; break}
			case('routeBuy'):{caption='BUY ARES EXPEDITION'; break}
			case('routeHome'):{caption='$other_home$'; break}
			case('routeCreateNewGameValidation'):{caption='CREATE GAME'; break}

			//create game
			case('createGamePlayerNumber'):{caption='123456'; break}

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
	public static createNonEventButton(name: NonEventButtonNames, caption?:string): NonEventButton {
		let button = new NonEventButton
		button.name = name
        button.startEnabled = this.getStartEnabled(name)
        button.enabled = button.startEnabled
        button.caption = caption??this.getCaption(name)

        return button
	}
	public static createColorButton(color: PlayerColor): ColorButton {
		let button = new ColorButton
		button.color = color
		return button
	}
}
