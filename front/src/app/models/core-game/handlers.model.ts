import { GameState } from "../../services/core-game/game-state.service";
import { EventBaseModel, EventCardSelector, EventCardSelectorRessource } from "./event.model";

export class EventHandler {
    private eventCounter: number = 0
    private clientPlayerId = 0

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
