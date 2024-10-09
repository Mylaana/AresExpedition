import { AdvancedRessourceStock, CardRessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { DrawEventDesigner, EventDesigner } from "../../services/core-game/event-designer.service";
import { GameState } from "../../services/core-game/game-state.service";
import { EventCardSelectorRessourceSubType, EventCardSelectorSubType, EventUnionSubTypes } from "../../types/event.type";
import { ProjectCardModel } from "../cards/project-card.model";
import { EventPlayZoneButton } from "./button.model";
import { DrawEvent, EventBaseModel, EventCardSelector, EventCardSelectorPlayZone, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, EventWaiter } from "./event.model";
import { Injectable } from "@angular/core";


@Injectable()
export class EventHandler {
	private initialized!: boolean
    private eventCounter: number = 0
	private currentEvent!: EventBaseModel
	private clientPlayerId = this.gameStateService.clientPlayerId
	private waiterResolved: number[] = []

    constructor(
		private gameStateService: GameState,
		private projectCardInfoService: ProjectCardInfoService
	){}

	handleQueueUpdate(eventQueue: EventBaseModel[]): EventBaseModel | undefined {
		if(eventQueue.length===0){return undefined}
		
		if(eventQueue[0].finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return
		}
		this.switchEvent(eventQueue, this.currentEvent)
		if(this.waiterResolved.length!=0){this.resolveWaiters(eventQueue)}
		this.checkFinalized()
		return this.currentEvent
	}
	eventMainButtonClicked(): void {
		this.resolveEventEffect()
	}
	updateEventMainButton(enabled: boolean): void {
		this.currentEvent.button?.updateEnabled(enabled)
	}
	playZoneButtonClicked(button: EventPlayZoneButton): void {
		let event = this.currentEvent as EventCardSelectorPlayZone
		event.playZoneButtonClicked(button)
		switch(button.name){
			case('buildCard'):{
				let cardId = event.getCardToBuildId()
				if(cardId===undefined){return}
				let buildEvent = EventDesigner.createGeneric('buildCard', {cardId:cardId})
				this.gameStateService.addEventQueue(buildEvent, true)
				break
			}
		}
	}
	updateSelectedCardList(selection: ProjectCardModel[]): void {
		let event = this.currentEvent as EventCardSelector
		event.updateCardSelection(selection)
	}
	private checkFinalized(): void {
		if(this.currentEvent.finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
		}
	}
	private setEventId(): number {
		this.eventCounter += 1
		return this.eventCounter
	} 
    private switchEvent(eventQueue: EventBaseModel[], event: EventBaseModel): void {
		if(eventQueue[0]===event){return}
		if(eventQueue[0]===this.currentEvent){return}
		
		//switching current event to top of the pile
		this.currentEvent = eventQueue[0]
		if(!this.currentEvent.id){this.currentEvent.id = this.setEventId()}

        //call selector related switchEvents
		if(this.currentEvent.hasSelector()===true){this.switchEventCardSelector(this.currentEvent as EventCardSelector)}

		this.applyAutoFinalize()
        return 
    }
	private applyAutoFinalize(): void {
		if(this.currentEvent.autoFinalize!=true){return}

		this.currentEvent.finalized = true
		this.resolveEventEffect()
	}
    private switchEventCardSelector(event: EventCardSelector): void {
        //remove stateFromParent before switching event
        //if(event && event.cardSelector && event.cardSelector.stateFromParent){event.cardSelector.stateFromParent=undefined}

        //reset currentEvent parameters
		event.deactivateSelection()
		let subType = event.subType as EventCardSelectorSubType | EventCardSelectorRessourceSubType
		if(event.refreshSelectorOnSwitch){event.cardSelector.selectFrom = this.gameStateService.getClientPlayerStateHandProject()}

		//check per subType special rules:
		switch(subType){
			case('selectCardForcedSell'):{
				console.log('resolving event: ','EventCardSelector ', event.subType)
                let playerCards = this.gameStateService.getClientPlayerState().cards
                if(playerCards.hand.length <= playerCards.maximum){
                    event.finalized = true
                    break
                }
				event.cardSelector.selectionQuantity = playerCards.hand.length - playerCards.maximum
				event.activateSelection()
				event.cardSelector.stateFromParent = {selectable:true, ignoreCost:true}
				event.title = `Too many cards in hand, please select ${event.cardSelector.selectionQuantity} cards to sell or more.`
				break
			}
			case('discardCards'):case('selectCardOptionalSell'):{
				event.activateSelection()
				event.cardSelector.stateFromParent = {selectable:true, ignoreCost:true}
				break
			}
			case('addRessourceToSelectedCard'):{
				event.activateSelection()
				event.cardSelector.selectFrom = this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(event.cardSelector.filter)
				console.log(event)
			}
		}
    }
    private resolveEventEffect(){
        switch(this.currentEvent.type){
            case('cardSelector'):{this.resolveEventCardSelector(this.currentEvent as EventCardSelector); break}
            case('cardSelectorRessource'):{this.resolveEventCardSelectorRessource(this.currentEvent as EventCardSelectorRessource); break}
			case('cardSelectorPlayZone'):{this.resolveEventCardSelectorPlayZone(this.currentEvent as EventCardSelectorPlayZone); break}
			case('generic'):{this.resolveEventGeneric(this.currentEvent as EventGeneric); break}
			case('deck'):{this.resolveEventDeckQuery(this.currentEvent as EventDeckQuery); break}
			case('targetCard'):{this.resolveEventTargetCards(this.currentEvent as EventTargetCard); break}
			case('waiter'):{this.resolveEventWaiter(this.currentEvent as EventWaiter);break}
			default:{console.log('Non mapped event in handler.resolveEventEffect: ', this.currentEvent)}
        }
		if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
		this.checkFinalized()
    }
    private resolveEventCardSelector(event: EventCardSelector): void {
		console.log('resolving event: ','EventCardSelector ', event.subType)

		event.finalized = true

        switch(event.subType){
			case('selectCardForcedSell'):case('selectCardOptionalSell'):case('discardCards'):{
				event.finalized = true
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, event.cardSelector.selectedList)
				
				if(event.subType==='discardCards'){break}
				this.gameStateService.sellCardsFromClientHand(event.cardSelector.selectedList.length)
				break
			}
			case('actionPhase'):{
				break
			}
			case('researchPhaseResult'):{
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.projectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectedList))
				break
			}
			case('scanKeepResult'):{
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.projectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectedList))
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventCardSelector: ', this.currentEvent)}
        }
		if(event.subType!='actionPhase'){event.activateSelection()}
    }
    private resolveEventCardSelectorRessource(event: EventCardSelectorRessource): void {
		console.log('resolving event: ','EventCardSelectorRessource ', event.subType)
		switch(event.subType){
			case('addRessourceToSelectedCard'):{
				console.log(event)
                event.activateSelection()
				//event.cardSelector.selectFrom = this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(event.cardSelector.filter)
				if(event.cardSelector.selectFrom.length===0){
					console.log('no cards found to add:', event.advancedRessource)
					event.finalized = true
				}
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventCardSelectorRessource: ', this.currentEvent)}
		}
    }
	private resolveEventCardSelectorPlayZone(event: EventCardSelectorPlayZone): void {
		console.log('resolving event: ','EventCardSelectorPlayZone ', event.subType)
		switch(event.subType){
			case('developmentPhase'):case('constructionPhase'):{
				event.finalized = true
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventCardSelectorPlayZone: ', this.currentEvent)}
		}
	}
	private resolveEventGeneric(event: EventGeneric): void {
		console.log('resolving event: ','EventGeneric ', event.subType)

		if(event.subType!='buildCard'){event.finalized = true}

		switch(event.subType){
			case('endOfPhase'):{
				this.gameStateService.setPlayerReady(true, this.clientPlayerId)
				break
			}
			case('buildCard'):{
				let cardId = event.cardIdToBuild
				if(cardId===undefined){break}
				let card = this.projectCardInfoService.getCardById(cardId)
				if(card===undefined){break}
				this.gameStateService.playCardFromClientHand(card)
				break
			}
			case('drawResult'):{
				if(event.drawResultList===undefined){break}
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, event.drawResultList)
				break
			}
			case('increaseGlobalParameter'):{
				if(!event.increaseParameter){break}
				this.gameStateService.addGlobalParameterStepsEOPtoPlayerId(this.clientPlayerId, event.increaseParameter)
				break
			}
			case('increaseResearchScanKeep'):{
				if(!event.increaseResearchScanKeep){break}
				if(event.increaseResearchScanKeep.scan!=undefined && event.increaseResearchScanKeep.scan>0){
					this.gameStateService.addClientPlayerResearchScanValue(event.increaseResearchScanKeep.scan)
				}
				if(event.increaseResearchScanKeep.keep!=undefined && event.increaseResearchScanKeep.keep>0){
					this.gameStateService.addClientPlayerResearchKeepValue(event.increaseResearchScanKeep.keep)
				}
				break
			}
			case('productionPhase'):case('planificationPhase'):{break}
			//case('addRessourceToPlayer')
			default:{console.log('Non mapped event in handler.resolveEventGeneric: ', this.currentEvent)}
		}
	}
	private resolveEventDeckQuery(event: EventDeckQuery): void {
		console.log('resolving event: ','EventDeckQuery ', event.subType)
		let resolveType!: EventUnionSubTypes
		event.waiterId = event.id
		switch(event.subType){
			case('drawQuery'):{
				resolveType = 'drawResult'
				break
			}
			case('researchPhaseQuery'):{
				resolveType = 'researchPhaseResult'
				event.scanKeep = this.gameStateService.getClientPlayerResearchMods()
				break
			}
			case('scanKeepQuery'):{
				resolveType = 'scanKeepResult'
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventDeckQuery: ', this.currentEvent)}
		}

		if((event.drawDiscard===undefined && event.scanKeep===undefined) || event.waiterId===undefined || resolveType===undefined){return}

		//adding a deck waiter event until drawEvent resolution if deck event will draw something
		if((event.drawDiscard?.draw?event.drawDiscard.draw:0)>0 || (event.scanKeep?.scan!=undefined && event.scanKeep.scan>0)){
			this.gameStateService.addEventQueue(EventDesigner.createWaiter('deckWaiter', event.id), true)
		}
	
		let drawNumber = event.drawDiscard?.draw
		if(drawNumber!=undefined && drawNumber>0){
			this.gameStateService.addDrawQueue(DrawEventDesigner.createDrawEvent(resolveType, drawNumber,event.id))
		}
		if(event.scanKeep!==undefined){
			let scanKeep: ScanKeep = {scan:event.scanKeep?.scan?event.scanKeep?.scan:0, keep:event.scanKeep?.keep?event.scanKeep?.keep:0}
			this.gameStateService.addDrawQueue(DrawEventDesigner.createScanKeepEvent(resolveType, scanKeep, event.waiterId))
		}
		this.gameStateService.cleanAndNextEventQueue()
	}
	private resolveEventWaiter(event: EventWaiter): void {
		console.log('resolving event: ','EventWaiter ', event.subType)
		switch(event.subType){
			case('deckWaiter'):{
				return
			}
			default:{console.log('Non mapped event in handler.EventWaiter: ', this.currentEvent)}
		}
	}
	private resolveEventTargetCards(event: EventTargetCard): void {
		console.log('resolving event: ','EventTargetCard ', event.subType)

		switch(event.subType){
			case('addRessourceToCardId'):{
				if(event.advancedRessource===undefined){console.log('event tried to add ressource, but variable was empty: ',event); break}
				let ressourceStock: AdvancedRessourceStock[] = []
				if(Array.isArray(event.advancedRessource)===true){
					ressourceStock = event.advancedRessource
				} else {
					ressourceStock.push(event.advancedRessource)
				}
				let cardStock: CardRessourceStock = {
					cardId:event.targetCardId,
					stock:ressourceStock
				}
				this.gameStateService.addRessourceToClientPlayerCard(cardStock)
				break
			}
			case('deactivateTrigger'):{
				this.gameStateService.setClientPlayerTriggerAsInactive(event.targetCardId)
				break
			}
			default:{console.log('Non mapped event in handler.resolveEventTargetCards: ', this.currentEvent)}
		}
	}
	private resolveWaiters(eventQueue: EventBaseModel[]){
		let newWaiters: number[] = []
		for(let waiterId of this.waiterResolved){
			let waiterIsResolved = this.resolveWaiterId(waiterId, eventQueue)
			if(waiterIsResolved===false){newWaiters.push(waiterId)}
		}
		this.waiterResolved = newWaiters
	}
	private resolveWaiterId(waiterId: number, eventQueue: EventBaseModel[]): boolean {
		for(let event of eventQueue){
			if(event.type!=='waiter'){continue}

			let waiterEvent = event as EventWaiter
			if(waiterId!==waiterEvent.waiterId){continue}

			event.finalized=true
			return true
		}
		return false
	}
}

@Injectable()
export class DrawEventHandler {
	constructor(
		private gameStateService:GameState,
		private projectCardInfoService: ProjectCardInfoService
	){}
	handleQueueUpdate(drawQueue: DrawEvent[]): void {
		if(drawQueue.length===0 || drawQueue[0].served===false || drawQueue[0].finalized===true){
			return
		}
		let event = drawQueue[0]
		this.resolveDrawEvent(event)
		event.finalized = true
		this.gameStateService.cleanAndNextDrawQueue()
	}
	private resolveDrawEvent(drawEvent: DrawEvent): void {
		let resultEvent!: EventBaseModel
		console.log('resolving deck event: ',drawEvent.resolveEventSubType)
		switch(drawEvent.resolveEventSubType){
			case('drawResult'):{
				resultEvent = EventDesigner.createGeneric(
					'drawResult',
					{
						drawEventResult:drawEvent.drawResultCardList,
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
			case('researchPhaseResult'):{
				resultEvent = EventDesigner.createCardSelector(
					'researchPhaseResult',
					{
						cardSelector:{
							selectFrom: this.projectCardInfoService.getProjectCardList(drawEvent.drawResultCardList),
							selectedList: [],
							selectionQuantity: drawEvent.keepCardNumber,
						},
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
			case('scanKeepResult'):{
				if(drawEvent.keepCardNumber===undefined){break}
				resultEvent = EventDesigner.createCardSelector(
					'scanKeepResult',
					{
						cardSelector:{
							selectFrom: this.projectCardInfoService.getProjectCardList(drawEvent.drawResultCardList),
							selectedList: [],
							selectionQuantity: drawEvent.keepCardNumber
						},
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
		}
		if(resultEvent===undefined){return}
		this.gameStateService.addEventQueue(resultEvent,true)
	}
}