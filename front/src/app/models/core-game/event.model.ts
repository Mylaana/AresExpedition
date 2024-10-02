import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardSelectorPlayZoneSubType, EventGenericSubType, EventDeckQuerySubType } from "../../types/event.type";
import { CardSelector, EventValue } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventPlayZoneButton, EventSecondaryButton } from "./button.model";
import { ButtonNames, EventPlayZoneButtonNames, EventSecondaryButtonNames } from "../../types/global.type";
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

    hasSelector(): boolean {return false}
    hasCardBuilder(): boolean {return false}
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedIdList: [],
        selectionQuantity: 0,
        selectionQuantityTreshold: 'equal'
    }
    private selectionActive: boolean = false

    updateCardSelection(selectionId:number[]): void {
        this.cardSelector.selectedIdList = selectionId
    }
    override hasSelector(): boolean {
        return true
    }
    /**
     * 
     * @param stateFromParent 
     * default state from parent {selectable:true}
     */
    activateSelection(stateFromParent?:CardState): void {
        this.selectionActive = true
        if(this.cardSelector.stateFromParent===undefined){
            this.cardSelector.stateFromParent = {}
        }
        if(!stateFromParent){
            this.cardSelector.stateFromParent.selectable = true
            this.cardSelector.stateFromParent.playable = true
        }
    }
        /**
     * 
     * @param stateFromParent 
     * default state from parent {selectable:true}
     */
    deactivateSelection(stateFromParent?:CardState): void {
        this.selectionActive = false
        if(this.cardSelector.stateFromParent===undefined){
            this.cardSelector.stateFromParent = {}
        }
        if(!stateFromParent){
            this.cardSelector.stateFromParent.selectable = false
            this.cardSelector.stateFromParent.playable = false
        }
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
    buttons: EventPlayZoneButton[] = []

    addButtons(buttons: EventPlayZoneButton[]): void {
        this.buttons = buttons
    }
    getButtonFromName(name: EventPlayZoneButtonNames): EventPlayZoneButton | undefined {
        for(let button of this.buttons){
            if(button.name===name){
                return button
            }
        }
        return
    }
    updateButtonEnabled(name: EventPlayZoneButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.enabled = enabled
    }
    updateButtonGroupState(buttonName: EventPlayZoneButtonNames): void {
        switch(buttonName){
            case('selectCard'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', true)
                this.updateButtonEnabled('cancelCard', true)
                this.updateButtonEnabled('alternative', false)
                break
            }
            case('cancelCard'):{
                this.updateButtonEnabled('selectCard', true)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', true)
                break
            }
            case('buildCard'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', false)
                break
            }
            case('alternative'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', false)
                break
            }
        }
    }
    secondaryButtonClicked(buttonName:EventPlayZoneButtonNames){
        console.log('play card zone button clicked: ', buttonName)
        switch(buttonName){
            case('selectCard'):{

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
    playCardZoneIdHavingFocus?: number
    override hasCardBuilder(): boolean {return true}
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
    