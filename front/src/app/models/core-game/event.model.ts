import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardSelectorPlayZoneSubType, EventGenericSubType, EventDeckQuerySubType } from "../../types/event.type";
import { CardSelector, EventValue } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventSecondaryButton } from "./button.model";
import { ButtonNames } from "../../types/global.type";
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
    id?: number
    button?: EventMainButton
    readonly value!: any
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    title: string = 'no title provided'
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedIdList: [],
        selectionQuantity: 0,
    }
    selectionActive: boolean = false
    updateCardSelection(selectionId:number[]): void {
        this.cardSelector.selectedIdList = selectionId
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
}

export class EventCardSelectorPlayZone extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorPlayZone'
    override subType!: EventCardSelectorPlayZoneSubType;
    playCardZone: PlayableCardZone [] = []
    playCardActive?: number

    public secondaryButtonClicked(name:ButtonNames){
        if(this.playCardActive===undefined){return}

        let zoneId = this.playCardActive

        switch(zoneId){
            case(0):{
                this.updateButtonState('selectFirstCard', false)
                this.updateButtonState('buildFirstCard', true)
                this.updateButtonState('cancelFirstCard', true)
                break
            }
            case(1):{
                this.updateButtonState('selectSecondCard', false)
                this.updateButtonState('buildSecondCard', true)
                this.updateButtonState('cancelSecondCard', true)
                break
            }
            default:{
                return
            }
        }

        this.selectionActive = false
        this.selectPlayableCard(zoneId, event.cardSelector.selectedIdList[0])
        event.playCardActive = undefined
    }
    
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
}



/** 
switch(subType){
    case('selectCardForcedSell'):{
        this.currentEvent.updateButtonState(
            'sellCardsEndPhase',
            this.compareValueToTreshold(
                event.cardSelector.selectionQuantity,
                event.cardSelector.selectedIdList.length,
                event.cardSelector.selectionQuantityTreshold)
        )
        return
    }
    case('researchPhaseResult'):{
        this.currentEvent.updateButtonState(
            'validateResearch',
            this.compareValueToTreshold(
                event.cardSelector.selectionQuantity,
                event.cardSelector.selectedIdList.length,
                event.cardSelector.selectionQuantityTreshold)
    )
    return
    }

    case('discardCards'):{
        this.buttonHandler.updateButtonState(
            'discardCards',
            this.compareValueToTreshold(
                event.cardSelector.selectionQuantity,
                event.cardSelector.selectedIdList.length,
                event.cardSelector.selectionQuantityTreshold)
        )
        return
    }
    case('addRessourceToSelectedCard'):{
        this.buttonHandler.updateButtonState(
            'addRessourceToSelectedCard',
            this.compareValueToTreshold(
                event.cardSelector.selectionQuantity,
                event.cardSelector.selectedIdList.length,
                event.cardSelector.selectionQuantityTreshold)
        )
        return
    }
    case('scanKeepResult'):{
        this.buttonHandler.updateButtonState(
            'scanKeep',
            this.compareValueToTreshold(
                event.cardSelector.selectionQuantity,
                event.cardSelector.selectedIdList.length,
                event.cardSelector.selectionQuantityTreshold)
        )
        return
    }
}
 */

export class EventTargetCard extends EventBaseModel {
    override subType!: EventTargetCardSubType;
    override value!: EventValue
    targetCardId!: number
    override autoFinalize: boolean = true
}

export class EventGeneric extends EventBaseModel {
    override subType!: EventGenericSubType;
    override value!: EventValue
    override autoFinalize: boolean = true
    title!: string
}

export class EventDeckQuery extends EventBaseModel {
    override subType!: EventDeckQuerySubType;
    override value!: EventValue
    override autoFinalize: boolean = true
}
    