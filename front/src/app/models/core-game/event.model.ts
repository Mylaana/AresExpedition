import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardSelectorPlayZoneSubType, EventGenericSubType, EventDeckQuerySubType } from "../../types/event.type";
import { CardSelector, EventValue } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventSecondaryButton } from "./button.model";
import { ButtonNames, EventSecondaryButtonNames } from "../../types/global.type";
import { ProjectCardModel } from "../cards/project-card.model";
import { CardState } from "../cards/card-cost.model";

/**
 * isFinalized should become true when object should go to garbage
 */
export abstract class EventBaseModel {
    readonly type!: EventType
    readonly subType!: any
    readonly locksEventpile: boolean = false
    finalized: boolean = false
    autoFinalize: boolean = false
    id!: number
    button?: EventMainButton
    readonly value!: any
    readonly title?: string

    hasSelector(): boolean {
        return false
    }
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedIdList: [],
        selectionQuantity: 0,
        selectionQuantityTreshold: 'equal'
    }
    selectionActive: boolean = false
    updateCardSelection(selectionId:number[]): void {
        this.cardSelector.selectedIdList = selectionId
    }
    override hasSelector(): boolean {
        return true
    }
}

export class EventCardSelector extends EventBaseCardSelector{
    override readonly type: EventType = 'cardSelector'
    override subType!: EventCardSelectorSubType
    override button?: EventMainButtonSelector

    override updateCardSelection(selectionId: number[]): void {
        super.updateCardSelection(selectionId)
        this.button?.updateEnabledTreshold({
            treshold: this.cardSelector.selectionQuantityTreshold,
            tresholdValue: this.cardSelector.selectionQuantity,
            value: this.cardSelector.selectedIdList.length
        })
    }
}

export class EventCardSelectorRessource extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorRessource'
    override subType!: EventCardSelectorRessourceSubType;
    override value!:EventValue
}

export class PlayableCardZone {
	cardList: ProjectCardModel[] = []
	cardInitialState?: CardState
    buttons: EventSecondaryButton[] = []

    addButtons(buttons: EventSecondaryButton[]): void {
        this.buttons = buttons
    }
    getButtonFromName(name: EventSecondaryButtonNames): EventSecondaryButton | undefined {
        for(let button of this.buttons){
            if(button.name===name){
                return button
            }
        }
        return
    }
    updateButtonEnabled(name: EventSecondaryButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.enabled = enabled
    }
    updateButtonGroupState(buttonName: EventSecondaryButtonNames): void {
        switch(buttonName){
            case('selectFirstCard'):{
                this.updateButtonEnabled('selectFirstCard', false)
                this.updateButtonEnabled('buildFirstCard', true)
                this.updateButtonEnabled('cancelFirstCard', true)
                break
            }
            case('cancelFirstCard'):{
                this.updateButtonEnabled('selectFirstCard', true)
                this.updateButtonEnabled('buildFirstCard', false)
                this.updateButtonEnabled('cancelFirstCard', false)
                break
            }
            case('buildFirstCard'):{
                this.updateButtonEnabled('selectFirstCard', false)
                this.updateButtonEnabled('buildFirstCard', false)
                this.updateButtonEnabled('cancelFirstCard', false)
                break
            }
            case('selectSecondCard'):{
                this.updateButtonEnabled('selectSecondCard', false)
                this.updateButtonEnabled('buildSecondCard', true)
                this.updateButtonEnabled('cancelSecondCard', true)
                break
            }
            case('cancelSecondCard'):{
                this.updateButtonEnabled('selectSecondCard', true)
                this.updateButtonEnabled('buildSecondCard', false)
                this.updateButtonEnabled('cancelSecondCard', false)
                break
            }
            case('buildSecondCard'):{
                this.updateButtonEnabled('selectFirstCard', false)
                this.updateButtonEnabled('buildSecondCard', false)
                this.updateButtonEnabled('cancelSecondCard', false)
                break
            }
        }
    }
    secondaryButtonClicked(buttonName:EventSecondaryButtonNames){
        console.log('play card zone button clicked: ', buttonName)
        switch(buttonName){
            case('selectFirstCard'):case('selectSecondCard'):{

                break
            }
            default:{
                return
            }
        }
        this.updateButtonGroupState(buttonName)

        //this.selectPlayableCard(zoneId, event.cardSelector.selectedIdList[0])
    }
    /**
	selectPlayableCard(playCardListId: number, playedCardId: number): void {
		let event = this.currentEvent as EventCardSelectorPlayZone
		let newList: ProjectCardModel[] = []
		let selectedCardIndex: number = 0

		for(let i=0; i< event.cardSelector.selectFrom.length; i++){
			if(event.cardSelector.selectFrom[i].id===playedCardId){
				selectedCardIndex = i
			} else {
				newList.push(event.cardSelector.selectFrom[i])
			}
		}
		event.playCardZone[playCardListId].cardList = event.cardSelector.selectFrom.splice(selectedCardIndex, 1)

		//update card selector state
		event.cardSelector.selectFrom = newList
		event.cardSelector.cardInitialState = {selectable: false}
	}

	buildCard(playableCardListId: number): void {
		let event = this.currentEvent as EventCardSelectorPlayZone
		let buttonCancel: ButtonNames
		let buttonSelect: ButtonNames
		let buttonBuild: ButtonNames
		let card: ProjectCardModel

		if(playableCardListId===0){
			buttonBuild = 'buildFirstCard'
			buttonSelect = 'selectFirstCard'
			buttonCancel = 'cancelFirstCard'
		} else {
			buttonBuild = 'buildSecondCard'
			buttonSelect = 'selectSecondCard'
			buttonCancel = 'cancelSecondCard'
			this.buttonHandler.updateButtonState('selectAlternative', false)
		}

		this.buttonHandler.updateButtonState(buttonBuild, false)
		this.buttonHandler.updateButtonState(buttonSelect, false)
		this.buttonHandler.updateButtonState(buttonCancel, false)

		card = event.playCardZone[playableCardListId].cardList[0]

		event.playCardZone[playableCardListId].cardList = []
		this.gameStateService.playCardFromClientHand(card)
	}

	cancelBuildCardSelection(playableCardListId: number): void {
		let event = this.currentEvent as EventCardSelectorPlayZone
		let buttonCancel: ButtonNames
		let buttonSelect: ButtonNames
		let buttonBuild: ButtonNames

		if(playableCardListId===0){
			buttonBuild = 'buildFirstCard'
			buttonSelect = 'selectFirstCard'
			buttonCancel = 'cancelFirstCard'
		} else {
			buttonBuild = 'buildSecondCard'
			buttonSelect = 'selectSecondCard'
			buttonCancel = 'cancelSecondCard'
			this.buttonHandler.updateButtonState('selectAlternative', false)
		}

		this.buttonHandler.updateButtonState(buttonBuild, false)
		this.buttonHandler.updateButtonState(buttonSelect, true)
		this.buttonHandler.updateButtonState(buttonCancel, false)

		let newList: ProjectCardModel[] = []
		for(let c of event.cardSelector.selectFrom){
			newList.push(c)
		}
		newList.push(event.playCardZone[playableCardListId].cardList[0])
		event.cardSelector.selectFrom = newList
		event.playCardZone[playableCardListId].cardList = []
	}

	resetPlayable():void{
		this.buttonHandler.updateButtonState('selectFirstCard', true)
		this.buttonHandler.updateButtonState('selectSecondCard', true)
		this.buttonHandler.updateButtonState('selectAlternative', true)
	}
    */
}

export class EventCardSelectorPlayZone extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorPlayZone'
    override subType!: EventCardSelectorPlayZoneSubType;
    playCardZone: PlayableCardZone [] = []
    playCardActive?: number
}

export class EventTargetCard extends EventBaseModel {
    override readonly type: EventType = 'targetCard'
    override subType!: EventTargetCardSubType;
    override value!: EventValue
    targetCardId!: number
    override autoFinalize: boolean = true
}

export class EventGeneric extends EventBaseModel {
    override readonly type: EventType = 'generic'
    override subType!: EventGenericSubType;
    override value!: EventValue
    override autoFinalize: boolean = true
    override title!: string
}

export class EventDeckQuery extends EventBaseModel {
    override readonly type: EventType = 'deck'
    override subType!: EventDeckQuerySubType;
    override value!: EventValue
    override autoFinalize: boolean = true
}
    