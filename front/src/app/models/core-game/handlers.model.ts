import { ChildButton } from "../../interfaces/global.interface";
import { GameState } from "../../services/core-game/game-state.service";
import { EventBaseModel, EventCardSelector, EventCardSelectorRessource } from "./event.model";
import { ButtonNames } from "../../types/global.type";

export class EventHandler {
    private eventCounter: number = 0

    constructor(private gameStateService: GameState){}

    switchEvent(eventQueue: EventBaseModel[], currentEvent: EventBaseModel): EventBaseModel | undefined {
        if(eventQueue.length===0){
			//currentEvent=eventQueue[0]
			return
		}
		if(eventQueue[0].finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return
		}

		//sets event id if undefined
		if(eventQueue[0].id === undefined){
			this.eventCounter++
			eventQueue[0].id = this.eventCounter
		}

		let ticket = eventQueue[0]

		
		if(currentEvent != ticket){
			//saves current event status in event queue
			for(let e of eventQueue){
				if(e.id === currentEvent.id){
					e = currentEvent
					break
				}
			}
		}

		if (currentEvent === ticket){return}

        //reset CardSelector state
        if(currentEvent.type==='cardSelector'){
            this.switchEventCardSelector(currentEvent as EventCardSelector)
        }
        currentEvent = ticket

        return currentEvent
    }
    private switchEventCardSelector(event: EventCardSelector): void {
        //remove stateFromParent before switching event
        if(event && event.cardSelector && event.cardSelector.stateFromParent){event.cardSelector.stateFromParent=undefined}

        //reset currentEvent parameters
        event.selectionActive = false
    }
    resolveEventEffect(currentEvent: EventBaseModel){
        switch(currentEvent.type){
            case('cardSelector'):{this.resolveEventCardSelector(currentEvent as EventCardSelector); break}
            case('cardSelectorRessource'):{this.resolveEventCardSelectorRessource(currentEvent as EventCardSelectorRessource); break}
        }

        return currentEvent
    }
    private resolveEventCardSelector(event: EventCardSelector): void {
        switch(event.subType){
            case('forcedSell'):{
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
            case('selectCard'):{
                event.selectionActive = true
                break
            }
            case('optionalSell'):{
                event.selectionActive = true
                break
            }
            case('selectCardToBuild'):{
                event.cardSelector.selectFrom = this.gameStateService.getClientPlayerStateHandProject()
                break
            }
            case('discardCards'):{
                event.selectionActive = true
                event.cardSelector.selectFrom = this.gameStateService.getClientPlayerStateHandProject()
                break
            }
        }
    }
    private resolveEventCardSelectorRessource(event: EventCardSelectorRessource): void {
        event.selectionActive = true
        event.cardSelector.selectFrom = 
                this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(event.cardSelector.filter)
        if(event.cardSelector.selectFrom.length===0){
            console.log('no cards found to add:', event.value)
            event.finalized = true
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

			case('validatePlanification'):{
				this.updateButtonState('validatePlanification', false)
				this.currentEvent.finalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
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
