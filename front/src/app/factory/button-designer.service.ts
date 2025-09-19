import { Injectable } from "@angular/core";
import { EventUnionSubTypes } from "../types/event.type";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, NonEventButton, ColorButton, EffectPortalButton, ToggleButton, CarouselButton } from "../models/core-game/button.model";
import { CarouselButtonNames, EventCardBuilderButtonNames, NonEventButtonNames, PlayerColor, ToggleButtonNames } from "../types/global.type";
import { BuilderOption, EffectPortalButtonEnum } from "../enum/global.enum";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { EFFECT_PORTAL_BUTTON_ACTIVATION_REQUIREMENTS, EFFECT_PORTAL_BUTTON_CAPTION, EFFECT_PORTAL_BUTTON_ENUM_LIST } from "../maps/playable-card-portal-maps";


@Injectable({
    providedIn: 'root'
})
export class ButtonDesigner{
    private static getStartEnabled(buttonRule: EventUnionSubTypes | NonEventButtonNames | CarouselButtonNames) : boolean {
        let startEnabled: boolean

        switch(buttonRule){
			//events related rules
            case('default'):{startEnabled=true;break}
            case('upgradePhaseCards'):{startEnabled=true;break}
            case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('productionPhase'):{startEnabled=true;break}
            case('actionPhaseActivator'):{startEnabled=false;break}
            case('selectCardOptionalSell'):{startEnabled=false;break}
			case('planificationPhase'):{startEnabled=false;break}
			case('selectStartingHand'):{startEnabled=true;break}
			case('selectCorporation'):{startEnabled=false;break}
			case('scanKeepResult'):{startEnabled=false;break}
			case('specialBuilder'):{startEnabled=true;break}
			case('tagSelector'):{startEnabled=false;break}
			case('waitingGroupReady'):{startEnabled=false;break}
			case('recallCardInHand'):{startEnabled=true;break}
			case('doubleProduction'):{startEnabled=true;break}
			case('effectPortal'):{startEnabled=true;break}
			case('resourceConversion'):{startEnabled=true;break}

			//button name related rules
			case('sellOptionalCard'):{startEnabled=true;break}
			case('sellOptionalCardCancel'):{startEnabled=false;break}
			case('rollBack'):{startEnabled=true;break}
			case('settings'):{startEnabled=true;break}
			case('displayUpgradedPhase'):{startEnabled=true;break}
			case('displayUpgradedPhaseCancel'):{startEnabled=true;break}
			case('killCard'):{startEnabled=true;break}
			case('lockBuilder'):{startEnabled=true;break}
			case('alternativePayAnaerobicMicroorganisms'):{startEnabled=true; break}
			case('carouselLeft'):{startEnabled=true; break}
			case('carouselRight'):{startEnabled=true; break}
			case('cardOverviewInvertTagSelection'):{startEnabled=true; break}
			case('cardOverviewResetTagSelection'):{startEnabled=true; break}
			case('cardOverviewNoneTag'):{startEnabled=true; break}
			case('cardOverviewDisplayAll'):{startEnabled=true; break}
			case('cardOverviewDisplayBalanced'):{startEnabled=true; break}

			case('buyForest'):{startEnabled=true;break}
			case('convertForest'):{startEnabled=true;break}
			case('buyTemperature'):{startEnabled=true;break}
			case('convertTemperature'):{startEnabled=true;break}
			case('buyInfrastructure'):{startEnabled=true;break}
			case('convertInfrastructure'):{startEnabled=true;break}
			case('buyOcean'):{startEnabled=true;break}
			case('tagGain'):{startEnabled=true;break}

			//cards
			case('activateProjectOnce'):{startEnabled=true; break}
			case('activateProjectTwice'):{startEnabled=false; break}
			case('upgradePhase'):{startEnabled=true;break}

			//global
			case('closeSettings'):{startEnabled=true;break}
			case('settingToggleDebug'):{startEnabled=true;break}
			case('settingToggleLanguage'):{startEnabled=true;break}

			//router
			case('routeCreateGame'):{startEnabled=true; break}
			case('routeCardOverview'):{startEnabled=true; break}
			case('routeBuy'):{startEnabled=true; break}
			case('routeHome'):{startEnabled=true; break}
			case('routeCreateNewGameValidation'):{startEnabled=true; break}
			case('routeDiscord'):{startEnabled=true; break}

			//create game
			case('createGamePlayerNumber'):{startEnabled=true; break}

            default:{startEnabled=false;break}
        }
        return startEnabled
    }
	private static getResetStartEnabledOnEventSwitch(buttonRule: EventUnionSubTypes | NonEventButtonNames | CarouselButtonNames) : boolean {
        let resetEnabled: boolean = true

        switch(buttonRule){
			//events related rules
            case('actionPhaseActivator'):{resetEnabled=false;break}

            default:{resetEnabled=true;break}
        }
        return resetEnabled
    }
    private static getCaption(buttonRule: EventUnionSubTypes | NonEventButtonNames | CarouselButtonNames): string {
        let caption: string

        switch(buttonRule){
			//events related rules
            case('default'):{caption='default validation button';break}

			//button name related rules
			case('sellOptionalCard'):{caption='$other_sellcard$';break}
			case('sellOptionalCardCancel'):{caption='$other_cancel$';break}
			case('rollBack'):{caption='$other_rollback$';break}
			case('displayUpgradedPhase'):{caption='$other_upgrade$';break}
			case('displayUpgradedPhaseCancel'):{caption='other_cancel';break}
			case('killCard'):{caption='kill cards';break}
			case('lockBuilder'):{caption='$other_cancel$';break}
			case('alternativePayAnaerobicMicroorganisms'):{caption='$ressource_microbe$$ressource_microbe$:  $ressource_megacreditvoid_-10$';break}
			case('alternativePayRestructuredResources'):{caption='$ressource_plant$: -5$ressource_megacredit$';break}
			case('carouselLeft'):{caption='';break}
			case('carouselRight'):{caption='';break}
			case('cardOverviewInvertTagSelection'):{caption='$other_invert$';break}
			case('cardOverviewResetTagSelection'):{caption='$other_rollback$';break}
			case('cardOverviewDisplayAll'):{caption='Display All';break}
			case('cardOverviewDisplayBalanced'):{caption='Display$skipline$Balanced$skipline$only';break}

			//settings
			case('settings'):{caption='$other_settings$';break}
			case('settingToggleDebug'):{caption='';break}
			case('settingToggleLanguage'):{caption='';break}

			case('convertTemperature'):{caption='8$ressource_heat$: $other_temperature$';break}
			case('convertInfrastructure'):{caption='5$ressource_heat$ + 3$ressource_plant$:$skipline$$other_infrastructure$ + $ressource_card$';break}


			//cards
			case('activateProjectOnce'):{caption='$other_activate$'; break}
			case('activateProjectTwice'):{caption='$other_double_activate$'; break}
			case('upgradePhase'):{caption='Upgrade';break}

			//global
			case('closeSettings'):{caption='$other_cancel$';break}

			//router
			case('routeCreateGame'):{caption='NEW GAME'; break}
			case('routeCardOverview'):{caption='CARD OVERVIEW'; break}
			case('routeBuy'):{caption='BUY ARES EXPEDITION FROM FRYXGAMES'; break}
			case('routeHome'):{caption='$other_home$'; break}
			case('routeCreateNewGameValidation'):{caption='CREATE GAME'; break}
			case('routeDiscord'):{caption='JOIN US ON DISCORD'; break}

			//create game
			case('createGamePlayerNumber'):{caption='123456'; break}

            default:{caption='$other_validate$';break}
        }
        return caption
    }
    public static createEventMainButton(eventSubType: EventUnionSubTypes, startEnabled?: boolean): EventMainButton {
        let button = new EventMainButton
		if(startEnabled!=undefined){
			button.startEnabled = startEnabled
		} else {
			button.startEnabled = this.getStartEnabled(eventSubType)
		}
        button.setEnabled(button.startEnabled)
        button.caption = this.getCaption(eventSubType)
        button.eventSubType = eventSubType
		button.resetEnabledOnEventSwitch = this.getResetStartEnabledOnEventSwitch(eventSubType)
        return button
    }
    public static createEventSelectorMainButton(eventSubType: EventUnionSubTypes): EventMainButtonSelector {
        let button = new EventMainButtonSelector
        button.startEnabled = this.getStartEnabled(eventSubType)
        button.setEnabled(button.startEnabled)
        button.caption = this.getCaption(eventSubType)
        button.eventSubType = eventSubType
		button.resetEnabledOnEventSwitch = this.getResetStartEnabledOnEventSwitch(eventSubType)
        return button
    }
    public static createEventCardBuilderButton(zoneId:number, option?: BuilderOption): EventCardBuilderButton[] {
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
            button.setEnabled(button.startEnabled)
            buttons.push(button)
        }

        if(option===undefined){return buttons}
        let button = new EventCardBuilderButton

        button.parentCardBuilderId=zoneId
        button.setEnabled(button.startEnabled)
        switch(option){
            case(BuilderOption.gain6MC):{button.caption = '+ $ressource_megacreditvoid_6$';break}
            case(BuilderOption.drawCard):{button.caption = '$ressource_card$';break}
        }
        button.startEnabled=true
        button.name = option as EventCardBuilderButtonNames
        button.setEnabled(button.startEnabled)
        buttons.push(button)

        return buttons
    }
	public static createNonEventButton(name: NonEventButtonNames, caption?:string): NonEventButton {
		let button = new NonEventButton
		button.name = name
        button.startEnabled = this.getStartEnabled(name)
		button.setEnabled(button.startEnabled)
        button.caption = caption??this.getCaption(name)

        return button
	}
	public static createColorButton(color: PlayerColor): ColorButton {
		let button = new ColorButton
		button.color = color
		return button
	}
	private static createPortalButton(portalCode: string, effectButton: EffectPortalButtonEnum, clientState: PlayerStateModel): EffectPortalButton {
		let button = new EffectPortalButton
		let enabledRule= EFFECT_PORTAL_BUTTON_ACTIVATION_REQUIREMENTS[portalCode]? EFFECT_PORTAL_BUTTON_ACTIVATION_REQUIREMENTS[portalCode](clientState, effectButton):true
		button.name = 'portalEffect'
		button.startEnabled = enabledRule
		button.setEnabled(button.startEnabled)
		button.caption = EFFECT_PORTAL_BUTTON_CAPTION[portalCode](effectButton)
		button.effect = effectButton

		return button
	}
	public static createPortalButtonSet(cardCode: string, clientState: PlayerStateModel): EffectPortalButton[] {
		let buttons: EffectPortalButton[] = []
		let buttonEnumList: EffectPortalButtonEnum[] = EFFECT_PORTAL_BUTTON_ENUM_LIST[cardCode]()

		for(let b of buttonEnumList){
			buttons.push(this.createPortalButton(cardCode, b, clientState))
		}
		return buttons
	}
	public static createToggleButton(name: ToggleButtonNames){
		let button = new ToggleButton
		button.name = name
		return button
	}
	public static createCarouselButton(name: CarouselButtonNames, valueList: string[], startingValue?: string): CarouselButton {
		let button = new CarouselButton
		button.name = name
        button.startEnabled = this.getStartEnabled(name)
		button.setEnabled(button.startEnabled)
        button.valueList = valueList
		button.value = startingValue??(valueList[0]??'')

        return button
	}
}
