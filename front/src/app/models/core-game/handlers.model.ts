import { Injectable } from "@angular/core";
import { AdvancedRessourceStock, CardRessourceStock, RessourceState, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { EventDesigner } from "../../services/designers/event-designer.service";
import { GameState } from "../../services/core-game/game-state.service";
import { EventCardSelectorRessourceSubType, EventCardSelectorSubType, EventPhaseSubType, EventUnionSubTypes } from "../../types/event.type";
import { SelectablePhase } from "../../types/global.type";
import { BuilderType } from "../../types/phase-card.type";
import { PhaseCardModel } from "../cards/phase-card.model";
import { ProjectCardModel } from "../cards/project-card.model";
import { EventCardBuilderButton } from "./button.model";
import { DrawEvent, EventBaseModel, EventCardSelector, EventCardBuilder, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, EventWaiter, EventPhase } from "./event.model";
import { DrawEventDesigner } from "../../services/designers/draw-event-designer.service";
import { Utils } from "../../utils/utils";
import { RxStompService } from "../../services/websocket/rx-stomp.service";
import { SelectablePhaseEnum } from "../../enum/phase.enum";

@Injectable()
export class EventHandler {
    private eventCounter: number = 0
	private currentEvent!: EventBaseModel
	private currentEventId!: number
	private clientPlayerId = this.gameStateService.clientPlayerId
	private waiterResolved: number[] = []
	private readonly phaseHandler = new PhaseResolveHandler(this.gameStateService)

    constructor(
		private gameStateService: GameState,
		private projectCardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}

	handleQueueUpdate(eventQueue: EventBaseModel[]): EventBaseModel | undefined {
		if(eventQueue.length===0){return undefined}
		if(eventQueue[0].id!=undefined && this.currentEventId!=undefined && Utils.jsonCopy(eventQueue[0].id)===Utils.jsonCopy(this.currentEventId)){
				return this.currentEvent
		}
		if(eventQueue[0].finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return this.currentEvent
		}

		this.switchEvent(eventQueue, this.currentEvent)
		if(this.waiterResolved.length!=0){this.resolveWaiters(eventQueue)}
		this.checkFinalized()
		return this.currentEvent
	}
	eventMainButtonClicked(): void {
		this.finishEventEffect()
	}
	updateEventMainButton(enabled: boolean): void {
		this.currentEvent.button?.updateEnabled(enabled)
	}
	cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		let event = this.currentEvent as EventCardBuilder
		event.cardBuilderButtonClicked(button)
		switch(button.name){
			case('buildCard'):{
				let cardId = event.getCardToBuildId()
				if(cardId===undefined){return}
				this.gameStateService.addEventQueue(EventDesigner.createGeneric('buildCard', {cardId:cardId}), 'first')
				break
			}
			case('drawCard'):{
				this.gameStateService.addEventQueue(EventDesigner.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}), 'first')
				break
			}
			case('gain6MC'):{
				this.gameStateService.addEventQueue(EventDesigner.createGeneric('addRessourceToPlayer',{baseRessource:{name:"megacredit",valueStock:6}}), 'first')
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
		//switching current event to top of the pile
		this.currentEvent = eventQueue[0]
		if(!this.currentEvent.id){this.currentEvent.id = this.setEventId()}
		this.currentEventId = this.currentEvent.id

        //call selector related switchEvents
		if(this.currentEvent.hasSelector()===true){this.switchEventCardSelector(this.currentEvent as EventCardSelector)}
		if(this.currentEvent.type==='phase'){this.switchEventPhase(this.currentEvent)}

		this.applyAutoFinalize()
        return
    }
	private applyAutoFinalize(): void {
		if(this.currentEvent.autoFinalize!=true){return}

		this.currentEvent.finalized = true
		this.finishEventEffect()
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
				Utils.logEventResolution('resolving event: ','EventCardSelector ', event.subType)
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
				let selectFrom = this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(event.cardSelector.filter)
				if(selectFrom.length===0){event.finalized=true;break}
				event.activateSelection()
				event.cardSelector.selectFrom = selectFrom
			}
		}
    }
	private switchEventPhase(event: EventBaseModel): void {
		let subType = event.subType as EventPhaseSubType

		if(event.autoFinalize===true){event.finalized=true}
		switch(subType){
			case('developmentPhase'):{this.phaseHandler.resolveDevelopment();break}
			case('constructionPhase'):{this.phaseHandler.resolveConstruction();break}
			case('productionPhase'):{this.phaseHandler.resolveProduction();break}
			case('researchPhase'):{this.phaseHandler.resolveResearch();break}
			default:{return}
		}
	}
    private finishEventEffect(){
        switch(this.currentEvent.type){
            case('cardSelector'):{this.finishEventCardSelector(this.currentEvent as EventCardSelector); break}
            case('cardSelectorRessource'):{this.finishEventCardSelectorRessource(this.currentEvent as EventCardSelectorRessource); break}
			case('cardSelectorCardBuilder'):{this.finishEventCardBuilder(this.currentEvent as EventCardBuilder); break}
			case('generic'):{this.finishEventGeneric(this.currentEvent as EventGeneric); break}
			case('deck'):{this.finishEventDeckQuery(this.currentEvent as EventDeckQuery); break}
			case('targetCard'):{this.finishEventTargetCards(this.currentEvent as EventTargetCard); break}
			case('waiter'):{this.finishEventWaiter(this.currentEvent as EventWaiter);break}
			case('phase'):{this.finishEventPhase(this.currentEvent as EventPhase); break}
			default:{Utils.logError('Non mapped event in handler.finishEventEffect: ', this.currentEvent)}
        }
		if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
		this.checkFinalized()
    }
    private finishEventCardSelector(event: EventCardSelector): void {
		Utils.logEventResolution('resolving event: ','EventCardSelector ', event.subType)

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
			default:{Utils.logError('Non mapped event in handler.finishEventCardSelector: ', this.currentEvent)}
        }
		if(event.subType!='actionPhase'){event.activateSelection()}
    }
    private finishEventCardSelectorRessource(event: EventCardSelectorRessource): void {
		Utils.logEventResolution('resolving event: ','EventCardSelectorRessource ', event.subType)
		switch(event.subType){
			case('addRessourceToSelectedCard'):{
				event.finalized = true
				let stock: AdvancedRessourceStock[] = event.advancedRessource?[event.advancedRessource]:[]
				if(stock.length===0){break}

				this.gameStateService.addRessourceToClientPlayerCard({cardId: event.cardSelector.selectedList[0].id,stock: stock})
				break
			}
			default:{Utils.logError('Non mapped event in handler.finishEventCardSelectorRessource: ', this.currentEvent)}
		}
    }
	private finishEventCardBuilder(event: EventCardBuilder): void {
		Utils.logEventResolution('resolving event: ','EventCardBuilder ', event.subType)
		switch(event.subType){
			case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):{
				event.finalized = true
				break
			}
			default:{Utils.logError('Non mapped event in handler.finishEventCardBuilder: ', this.currentEvent)}
		}
	}
	private finishEventGeneric(event: EventGeneric): void {
		Utils.logEventResolution('resolving event: ','EventGeneric ', event.subType)

		if(event.subType!='buildCard'){event.finalized = true}

		switch(event.subType){
			case('endOfPhase'):{
				this.gameStateService.setClientPlayerReady(true)
				this.rxStompService.publishPlayerState(this.gameStateService.getClientPlayerState())
				//this.rxStompService.publishClientPlayerReady(true)
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
			case('addRessourceToPlayer'):{
				if(event.baseRessource===undefined){break}
				let baseRessources: RessourceStock[] = []

				if(Array.isArray(event.baseRessource)){
					baseRessources = event.baseRessource
				} else {
					baseRessources.push(event.baseRessource)
				}

				this.gameStateService.addRessourceToClientPlayer(baseRessources)
				break
			}
			case('planificationPhase'):{
				this.gameStateService.clientPlayerValidateSelectedPhase()
				break
			}
			case('upgradePhaseCards'):{break}
			default:{Utils.logError('Non mapped event in handler.finishEventGeneric: ', this.currentEvent)}
		}
	}
	private finishEventDeckQuery(event: EventDeckQuery): void {
		Utils.logEventResolution('resolving event: ','EventDeckQuery ', event.subType)
		let resolveType!: EventUnionSubTypes
		event.waiterId = event.id
		switch(event.subType){
			case('drawQuery'):{
				resolveType = 'drawResult'
				break
			}
			case('researchPhaseQuery'):{
				resolveType = 'researchPhaseResult'
				break
			}
			case('scanKeepQuery'):{
				resolveType = 'scanKeepResult'
				break
			}
			default:{Utils.logError('Non mapped event in handler.finishEventDeckQuery: ', this.currentEvent)}
		}

		if((event.drawDiscard===undefined && event.scanKeep===undefined) || event.waiterId===undefined || resolveType===undefined){return}

		//adding a deck waiter event until drawEvent resolution if deck event will draw something
		if((event.drawDiscard?.draw?event.drawDiscard.draw:0)>0 || (event.scanKeep?.scan!=undefined && event.scanKeep.scan>0)){
			this.gameStateService.addEventQueue(EventDesigner.createWaiter('deckWaiter', event.id), 'second')
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
	private finishEventWaiter(event: EventWaiter): void {
		Utils.logEventResolution('resolving event: ','EventWaiter ', event.subType)
		switch(event.subType){
			case('deckWaiter'):{
				return
			}
			default:{Utils.logError('Non mapped event in handler.EventWaiter: ', this.currentEvent)}
		}
	}
	private finishEventTargetCards(event: EventTargetCard): void {
		Utils.logEventResolution('resolving event: ','EventTargetCard ', event.subType)

		switch(event.subType){
			case('addRessourceToCardId'):{
				if(event.advancedRessource===undefined){Utils.logError('event tried to add ressource, but variable was empty: ',event); break}
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
			default:{Utils.logError('Non mapped event in handler.finishEventTargetCards: ', this.currentEvent)}
		}
	}
	private finishEventPhase(event: EventPhase): void {
		Utils.logEventResolution('resolving event: ','finishEventPhase ', event.subType)

		switch(event.subType){
			case('developmentPhase'):case('constructionPhase'):case('researchPhase'):{
				break
			}
			case('productionPhase'):{
				event.finalized=true
				break
			}
			default:{Utils.logError('Non mapped event in handler.finishEventPhase: ', this.currentEvent)}
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
		private projectCardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}
	handleQueueUpdate(drawQueue: DrawEvent[]): void {
		if(drawQueue.length===0){return}
		if(drawQueue[0].finalized===true){return}
		if(drawQueue[0].queried===false){
			this.sendWsDrawQuery(drawQueue[0])
		}
		if(drawQueue[0].served===false){return}
		let event = drawQueue[0]
		this.resolveDrawEvent(event)
		event.finalized = true
		this.gameStateService.cleanAndNextDrawQueue()
	}
	private sendWsDrawQuery(event: DrawEvent){
		event.queried = true
		this.rxStompService.publishDraw(event.drawCardNumber, event.waiterId)
	}
	private resolveDrawEvent(drawEvent: DrawEvent): void {
		let resultEvent!: EventBaseModel
		Utils.logEventResolution('resolving deck event: ',drawEvent.resolveEventSubType)
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
		this.gameStateService.addEventQueue(resultEvent,'first')
	}
}

class PhaseResolveHandler {
	private currentUpgradedPhaseCards!: PhaseCardModel[]
	constructor(private gameStateService: GameState){}
	private clientPlayerId: number = this.gameStateService.clientPlayerId

	private getCurrentUpgradedPhaseCard(): PhaseCardModel[] {
		return this.gameStateService.getClientPlayerSelectedPhaseCards()
	}
	private refreshCurrentUpgradedPhaseCard(): void {
		this.currentUpgradedPhaseCards = this.getCurrentUpgradedPhaseCard()
	}
	private shouldReceivePhaseCardSelectionBonus(phaseResolved: SelectablePhaseEnum): boolean {
		return this.gameStateService.getPlayerCurrentSelectedPhase(this.clientPlayerId)===phaseResolved
	}
	resolveDevelopment(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[0].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.development)){
			builderType = 'developmentAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventDesigner.createCardBuilder('developmentPhaseBuilder',builderType),'second')
	}
	resolveConstruction(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[1].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.construction)){
			builderType = 'constructionAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventDesigner.createCardBuilder('constructionPhaseBuilder',builderType),'second')

		if(builderType==='construction_draw_card'){
			this.gameStateService.addEventQueue(EventDesigner.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}),'second')
		}
	}
	resolveProduction(): void {
		this.refreshCurrentUpgradedPhaseCard()

		let clientState = this.gameStateService.getClientPlayerState()
		let newClientRessource: RessourceState[] = []

		newClientRessource = clientState.ressource

		for(let i=0; i<newClientRessource.length; i++){
			switch(i){
				//MC production
				case(0):{
					newClientRessource[i].valueStock =
						newClientRessource[i].valueStock
						+ newClientRessource[i].valueProd
						+ clientState.terraformingRating
						+ this.getProductionPhaseCardSelectionBonus()
					break
				}
				//heat and plant producition
				case(1):case(2):{
					newClientRessource[i].valueStock =
						newClientRessource[i].valueStock
						+ newClientRessource[i].valueProd
					break
				}
				//Cards production
				case(5):{
					if(newClientRessource[i].valueProd===0){break}
					this.gameStateService.addEventQueue(EventDesigner.createDeckQueryEvent(
						'drawQuery',
						{drawDiscard:{draw:newClientRessource[i].valueProd,discard:0}}
					),'first')
					break
				}
			}
		}

		this.gameStateService.updateClientPlayerState(clientState)
	}
	private getProductionPhaseCardSelectionBonus(): number {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return 0}

		let bonus: number = 0
		let productionPhaseCard = this.currentUpgradedPhaseCards[3]

		switch(productionPhaseCard.phaseType){
			case('production_base'):{bonus=4;break}
			case('production_7mc'):{bonus=7;break}
			case('production_1mc_activate_card'):{bonus=1;break}
		}

		return bonus
	}
	resolveResearch(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let baseScanKeep: ScanKeep = {scan:2,keep:1}
		let clientState = this.gameStateService.getClientPlayerState()
		let modScanKeep: ScanKeep = clientState.research
		let bonusScanKeep: ScanKeep = this.getResearchPhaseCardSelectionBonus()
		let totalScanKeep = {
			scan: baseScanKeep.scan + modScanKeep.scan + bonusScanKeep.scan,
			keep: baseScanKeep.keep + modScanKeep.keep + bonusScanKeep.keep,
		}
		this.gameStateService.addEventQueue(EventDesigner.createDeckQueryEvent(
			'researchPhaseQuery',
			{scanKeep:totalScanKeep}
		),'first')

	}
	private getResearchPhaseCardSelectionBonus(): ScanKeep {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.research)){return {scan:0, keep:0}}

		let bonus: ScanKeep = {scan:0, keep:0}
		let researchPhaseCard = this.currentUpgradedPhaseCards[4]

		switch(researchPhaseCard.phaseType){
			case('research_base'):{bonus={scan:3, keep:1};break}
			case('research_scan6_keep1'):{bonus={scan:6, keep:1};break}
			case('research_scan2_keep2'):{bonus={scan:2, keep:2};break}
		}
		return bonus
	}
}
