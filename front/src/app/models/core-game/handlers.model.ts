import { GameState } from "../../services/core-game/game-state.service";
import { EventBaseModel, EventCardSelector, EventCardSelectorPlayZone, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard } from "./event.model";
import { Injectable } from "@angular/core";


@Injectable()
export class EventHandler {
    private eventCounter: number = 0
	private currentEvent!: EventBaseModel
	private clientPlayerId = this.gameStateService.clientPlayerId

    constructor(private gameStateService: GameState){}

	handleQueueUpdate(eventQueue: EventBaseModel[]): EventBaseModel | undefined {
		if(!this.currentEvent){return this.initializeFirstEvent(eventQueue)}
		
		if(eventQueue[0].finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return
		}
		
		return this.switchEvent(eventQueue, this.currentEvent)
	}

	setEventId(): number {
		this.eventCounter += 1
		return this.eventCounter
	} 
	initializeFirstEvent(eventQueue: EventBaseModel[]): EventBaseModel {
		this.currentEvent = eventQueue[0]
		this.currentEvent.id = this.setEventId()
		return this.currentEvent
	}
    switchEvent(eventQueue: EventBaseModel[], event: EventBaseModel): EventBaseModel {
		if(eventQueue[0]===event){return this.currentEvent}
		
		//switching current event to top of the pile
		this.currentEvent = eventQueue[0]
		if(!this.currentEvent.id){this.currentEvent.id = this.setEventId()}

        //reset CardSelector state
		if(this.currentEvent.hasSelector()===true){this.switchEventCardSelector(this.currentEvent as EventCardSelector)}

        return this.currentEvent
    }

    private switchEventCardSelector(event: EventCardSelector): void {
        //remove stateFromParent before switching event
        //if(event && event.cardSelector && event.cardSelector.stateFromParent){event.cardSelector.stateFromParent=undefined}

        //reset currentEvent parameters
        event.selectionActive = false
    }

	updateEventMainButton(enabled: boolean): void {
		this.currentEvent.button?.updateEnabled(enabled)
	}

    resolveEventEffect(){
        switch(this.currentEvent.type){
            case('cardSelector'):{this.resolveEventCardSelector(this.currentEvent as EventCardSelector); break}
            case('cardSelectorRessource'):{this.resolveEventCardSelectorRessource(this.currentEvent as EventCardSelectorRessource); break}
			case('cardSelectorPlayZone'):{this.resolveEventCardSelectorPlayZone(this.currentEvent as EventCardSelectorPlayZone); break}
			case('generic'):{this.resolveEventGeneric(this.currentEvent as EventGeneric); break}
			case('deck'):{this.resolveEventDeckQuery(this.currentEvent as EventDeckQuery); break}
			case('targetCard'):{this.resolveEventTargetCards(this.currentEvent as EventTargetCard); break}
			default:{console.log('Non mapped event in handler.resolveEventEffect: ', this.currentEvent)}
        }
    }
    private resolveEventCardSelector(event: EventCardSelector): void {
        switch(event.subType){
            case('selectCardForcedSell'):{
                let playerCards = this.gameStateService.getClientPlayerState().cards
                if(playerCards.hand.length <= playerCards.maximum){
                    event.finalized = true
                    break
                }
                event.cardSelector.selectionQuantity = playerCards.hand.length - playerCards.maximum
                event.title = `Too many cards in hand, please select at least ${event.cardSelector.selectionQuantity} cards to sell.`
                event.cardSelector.selectFrom = this.gameStateService.getClientPlayerStateHandProject()

                event.selectionActive = true
                break
            }
            case('discardCards'):case('selectCardOptionalSell'):{
                event.selectionActive = true
                event.cardSelector.selectFrom = this.gameStateService.getClientPlayerStateHandProject()
                break
            }
			default:{console.log('Non mapped event in handler.resolveEventCardSelector: ', this.currentEvent)}
        }
    }
    private resolveEventCardSelectorRessource(event: EventCardSelectorRessource): void {
		switch(event.subType){
			case('addRessourceToSelectedCard'):{
				event.selectionActive = true
				event.cardSelector.selectFrom = 
						this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(event.cardSelector.filter)
				if(event.cardSelector.selectFrom.length===0){
					console.log('no cards found to add:', event.value)
					event.finalized = true
				}
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventCardSelectorRessource: ', this.currentEvent)}
		}
    }
	private resolveEventCardSelectorPlayZone(event: EventCardSelectorPlayZone): void {
		console.log('resolving event: ','EventCardSelectorPlayZone')
		switch(event.subType){
			case('constructionPhase'):{
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventCardSelectorPlayZone: ', this.currentEvent)}
		}
	}
	private resolveEventGeneric(event: EventGeneric): void {
		console.log('resolving event: ','EventGeneric')
		switch(event.subType){
			case('endOfPhase'):{
				event.finalized = true
				this.gameStateService.setPlayerReady(true, this.clientPlayerId)
				break
			}
			case('planificationPhase'):{
				this.currentEvent.finalized = true
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventGeneric: ', this.currentEvent)}
		}

		if(this.currentEvent.finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
		}
	}
	private resolveEventDeckQuery(event: EventDeckQuery): void {
		console.log('resolving event: ','EventDeckQuery')
		switch(event.subType){
			case('drawQuery'):{
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventDeckQuery: ', this.currentEvent)}
		}
	}
	private resolveEventTargetCards(event: EventTargetCard): void {
		console.log('resolving event: ','EventTargetCard')
		switch(event.subType){
			case('addRessourceToCardId'):{

				break
			}
			default:{console.log('Non mapped event in handler.resolveEventTargetCards: ', this.currentEvent)}
		}
	}
}

/**
 * case('forcedSell'):{
				let playerCards = this.gameStateService.getClientPlayerState().cards
				if(playerCards.hand.length <= playerCards.maximum){
					ticket.isFinalized = true
					break
				}
				this.currentEvent.cardSelector.selectionQuantity = playerCards.hand.length - playerCards.maximum
				this.currentEvent.cardSelector.title = `Too many cards in hand, please select at least ${ticket.cardSelector.selectionQuantity} cards to sell.`
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(playerCards.hand)

				this.currentEvent.selectionActive = true
				break
			}
			case('endOfPhase'):{
				ticket.isFinalized = true
				this.gameStateService.setPlayerReady(true, this.clientPlayerId)
				break
			}
			case('selectCard'):{
				this.currentEvent.selectionActive = true
				break
			}
			case('optionalSell'):{
				this.currentEvent.selectionActive = true
				break
			}
			case('upgradePhase'):{
				this.currentEvent.selectionActive = true
				this.gameStateService.addPhaseCardUpgradeNumber(this.clientPlayerId, this.currentEvent.cardSelector.selectionQuantity)
				break
			}
			case('selectCardToBuild'):{
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
				break
			}
			case('drawCards'):{
				ticket.isFinalized = true
				this.currentEvent.button = this.buttons[this.getButtonIdFromName('drawCards')]
				this.addDrawQueue(this.clientPlayerId, ticket.value)
				break
			}
			case('discardCards'):{
				this.currentEvent.selectionActive = true
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerState().cards.hand)			
				break
			}
			case('increaseGlobalParameter'):{
				this.currentEvent.isFinalized = true
				let parameter: GlobalParameter = this.currentEvent.value
				this.gameStateService.addGlobalParameterStepsEOPtoPlayerId(this.clientPlayerId, {name:parameter.name, steps:parameter.addEndOfPhase})
				break
			}
			case('ressourceGain'):{
				this.currentEvent.isFinalized = true
				let ressources: RessourceStock[] = [].concat(this.currentEvent.value)
				this.gameStateService.addRessourceToClientPlayer(ressources)
				break
			}
			case('cardRessourceGain'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addRessourceToClientPlayerCard(this.currentEvent.value)
				break
			}
			case('increaseResearchScanValue'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addClientPlayerResearchScanValue(this.currentEvent.value)
				break
			}
			case('increaseResearchKeepValue'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addClientPlayerResearchKeepValue(this.currentEvent.value)
				break
			}
			case('deactivateTrigger'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.setClientPlayerTriggerAsInactive(this.currentEvent.value)
 				break
			}
			case('addRessourceToSelectedCard'):{
				this.currentEvent.selectionActive = true
				this.currentEvent.cardSelector.selectFrom = this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(
					this.currentEvent.cardSelector.phaseFilter)
				if(this.currentEvent.cardSelector.selectFrom.length===0){
					console.log('no cards found to add:', this.currentEvent.value)
					this.currentEvent.isFinalized = true
				}
				break
			}
			case('scanKeepQuery'):{
				this.currentEvent.isFinalized = true
				let scanKeep: ScanKeep = this.currentEvent.value
				let draw = new DrawModel;
				draw.playerId = this.clientPlayerId
				draw.cardNumber = scanKeep.scan
				draw.drawRule = 'scanKeep'
				draw.keepCardNumber = scanKeep.keep
				this.gameStateService.addDrawQueue(draw)
				console.log('scanKeepQuery: ',draw)
				break
			}
			case('scanKeepResult'):{
				this.currentEvent.selectionActive = true
				console.log('scanKeepResult!')
			}
		}
 */
/**
export class ButtonHandler{
	buttonList: ChildButton[] = []
	buttons: ChildButton[] = [];
	buttonsIds = new Map<ButtonNames, number>();

	phaseButtons = new  Map<NonSelectablePhase, ButtonNames>(
		[
			['planification', 'validatePlanification'],
			['development', 'validateDevelopment'],
			['construction', 'validateConstruction'],
			['action', 'validateAction'],
			['production', 'validateProduction'],
			['research', 'validateResearch']
		]
	)

	//marche en vidant la map et en l'initialisant avec un set()
	eventMainButton = new Map<EventUnionSubTypes, ButtonNames>(
		[
			['discardCards','discardCards'],
			['drawCards','drawCards'],
			['upgradePhase','upgradePhase'],
			['addRessourceToSelectedCard', 'addRessourceToSelectedCard']
		]
	)
	buttonClicked(clickedButtonName: ChildButton) : void {
		clickedButtonName = this.getButtonNameFromId(button.id)
		switch(clickedButtonName){
			case(undefined):{return}


			case('validateResearch'):{
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				//reset research phase
				this.buttons[button.id].enabled = false
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('sellCardsEndPhase'):
			case('validateOptionalSellCards'):{
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.updateButtonState('sellCardsEndPhase',false)
				this.gameStateService.sellCardsFromClientHand( this.currentEvent.cardSelector.selectedIdList.length)
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('selectFirstCard'):
			case('selectSecondCard'):{
				let zoneId: number
				if(clickedButtonName==='selectFirstCard'){
					zoneId = 0
				} else {
					zoneId = 1
				}
				this.currentEvent.cardSelector.playCardActive = zoneId
				this.currentEvent.cardSelector.stateFromParent = {selectable: true}

				if(clickedButtonName==='selectSecondCard'){
					this.updateButtonState('selectAlternative', false)
				}

				this.currentEvent.selectionActive = true
				break
			}
			case('cancelFirstCard'):{
				this.cancelBuildCardSelection(0)
				break
			}
			case('cancelSecondCard'):{
				this.cancelBuildCardSelection(1)
				this.updateButtonState('selectAlternative', true)
				break
			}
			case('buildFirstCard'):{
				this.buildCard(0)
				break
			}
			case('buildSecondCard'):
			{
				this.buildCard(1)
				break
			}
			case('validateDevelopment'):
			case('validateConstruction'):
			case('validateAction'):
			case('validateProduction'):
			{
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('selectAlternative'):{
				this.updateButtonState('selectSecondCard', false)
				this.updateButtonState('buildSecondCard', false)
				this.updateButtonState('cancelSecondCard', false)
				this.updateButtonState('selectAlternative', false)
				console.log(clickedButtonName)
				break
			}
			case('callOptionalSellCards'):{
				let newEvent = new EventBaseModel
				newEvent.type = 'optionalSell'
				newEvent.cardSelector = {
					selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
					selectionQuantity: 0,
					selectionQuantityTreshold: 'min',
					cardInitialState: {selectable:true, ignoreCost: true},
					title: `Sell any card number :`,
					selectedIdList: [],
				}
				newEvent.button = this.buttons[this.getButtonIdFromName('validateOptionalSellCards')]
				this.gameStateService.addEventQueue(newEvent, true)
				break
			}
			case('upgradePhase'):{
				this.currentEvent.finalized = true
				this.gameStateService.removePhaseCardUpgradeNumber(this.clientPlayerId, 0 , true)
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('discardCards'):{
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('addRessourceToSelectedCard'):{
				let stockList: AdvancedRessourceStock[] = []
				if(!Array.isArray(this.currentEvent.value)){
					stockList.push(this.currentEvent.value)
				} else {
					stockList = this.currentEvent.value
				}
				let cardStock: CardRessourceStock = {
					cardId: this.currentEvent.cardSelector.selectedIdList[0],
					stock: stockList
				}
				this.gameStateService.addRessourceToClientPlayerCard(cardStock)
				this.currentEvent.finalized = true
				this.currentEvent.cardSelector.stateFromParent = {selected:false, selectable:false, activable:false, ignoreCost:false, playable:false, upgradable:false, upgraded:false}
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('scanKeep'):{
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.buttons[button.id].enabled = false
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
		}
	}
 */