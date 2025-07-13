import { Injectable } from "@angular/core";
import { AdvancedRessourceStock, CardRessourceStock, RessourceInfo, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { GameState } from "../../services/core-game/game-state.service";
import { EventCardActivatorSubType, EventCardSelectorRessourceSubType, EventCardSelectorSubType, EventPhaseSubType, EventUnionSubTypes } from "../../types/event.type";
import { BuilderType } from "../../types/phase-card.type";
import { PhaseCardModel } from "../cards/phase-card.model";
import { PlayableCardModel } from "../cards/project-card.model";
import { EventCardBuilderButton } from "./button.model";
import { DrawEvent, EventBaseModel, EventCardSelector, EventCardBuilder, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, EventWaiter, EventPhase, EventCardActivator, EventComplexCardSelector, EventTagSelector } from "./event.model";
import { Logger, Utils } from "../../utils/utils";
import { RxStompService } from "../../services/websocket/rx-stomp.service";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { ActivationOption, ProjectListType } from "../../types/project-card.type";
import { myUUID, TagType } from "../../types/global.type";
import { GameParamService } from "../../services/core-game/game-param.service";
import { EventFactory } from "../../factory/event/event-factory";
import { DrawEventFactory } from "../../factory/draw-event-designer.service";
import { BuilderOption, DeckQueryOptionsEnum, DiscardOptionsEnum, ProjectFilterNameEnum } from "../../enum/global.enum";
import { PlayableCard } from "../../factory/playable-card.factory";

@Injectable()
export class EventHandler {
    private eventCounter: number = 0
	private currentEvent!: EventBaseModel
	private currentEventId!: number
	private waiterResolved: number[] = []
	private readonly phaseHandler = new PhaseResolveHandler(this.gameStateService, this.gameParam)

    constructor(
		private gameStateService: GameState,
		private projectCardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService,
		private gameParam: GameParamService
	){}

	public handleQueueUpdate(eventQueue: EventBaseModel[]): EventBaseModel | undefined {
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
	public eventMainButtonClicked(): void {
		this.finishEventEffect()
	}
	public updateValidateButton(enabled: boolean): void {
		this.currentEvent.button?.updateEnabled(enabled)
		this.currentEvent.button?.locked?this.currentEvent.lockValidateButton:false
	}
	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		let event = this.currentEvent as EventCardBuilder
		event.cardBuilderButtonClicked(button)
		switch(button.name){
			case('buildCard'):{
				let card = event.getCardToBuildId()
				if(card===undefined){return}
				this.gameStateService.addEventQueue(EventFactory.createGeneric('buildCard', {card:card}), 'first')
				event.setFirstCardBuilt()
				event.cardSelector.selectFrom = this.gameStateService.getClientHandModelList(event.cardSelector.filter)
				break
			}
			case(BuilderOption.drawCard):{
				this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}), 'first')
				break
			}
			case(BuilderOption.gain6MC):{
				this.gameStateService.addEventQueue(EventFactory.createGeneric('addRessourceToPlayer',{baseRessource:{name:"megacredit",valueStock:6}}), 'first')
				break
			}
		}
		event.updateButtonEnabled()
	}
	public updateSelectedCardList(selected: PlayableCardModel[], listType: ProjectListType): void {
		switch(listType){
			case('selector'):{
				let event = this.currentEvent as EventCardSelector
				event.updateCardSelection(selected)
				break
			}
			case('builderSelector'):{
				let event = this.currentEvent as EventCardBuilder
				event.updateCardSelection(selected)
				event.updateButtonEnabled()
				break
			}
			default:{
			}
		}
	}
	public cancelSellCardsOptional(): void {
		if(this.currentEvent.subType!='selectCardOptionalSell'){return}
		this.cancelCurrentEvent()
	}
	public cancelDisplayUpgradedPhase(): void {
		if(this.currentEvent.subType!='upgradePhaseCards'){return}
		this.cancelCurrentEvent()
	}
	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}): void {
		let event = this.currentEvent as EventCardActivator
		event.activationLog[input.card.cardCode] = input.card.activated
		if(input.twice){event.doubleActivationCount += 1}
		this.gameStateService.activateCard(input.card, input.option)
	}
	public updateActionPhaseMainButtonState(enabled?: boolean): void {
		let state = this.gameStateService.getClientState()
		let plantStock = state.getRessourceInfoFromType('plant')?.valueStock??0
		let heatStock = state.getRessourceInfoFromType('heat')?.valueStock??0
		enabled = (heatStock>=8  || plantStock>=8 || (heatStock>=5  && plantStock>=3)) === false

		this.currentEvent.button?.updateEnabled(enabled)
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

		this.currentEvent.onSwitch()

        //call general switchEvents cases
		if(this.currentEvent.hasSelector()===true){this.switchEventCardSelector(this.currentEvent as EventCardSelector)}
		if(this.currentEvent.type==='phase'){this.switchEventPhase(this.currentEvent as EventPhase)}
		if(this.currentEvent.type==='cardActivator'){this.switchEventCardActivator(this.currentEvent as EventCardActivator)}
		if(this.currentEvent.type==='ComplexSelector'){this.switchEventComplexCardSelector(this.currentEvent as EventComplexCardSelector)}

		//specific cases
		if(this.currentEvent.subType==='planificationPhase' && this.currentEvent.button){
			this.currentEvent.button.resetStartEnabled()
		}

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
		if(event.refreshSelectorOnSwitch){event.cardSelector.selectFrom = this.gameStateService.getClientHandModelList(event.cardSelector.filter)}

		//check per subType special rules:
		switch(subType){
			case('selectCardForcedSell'):{
				Logger.logEventResolution('resolving event: ','EventCardSelector ', event.subType)
                let clientState = this.gameStateService.getClientState()
				let currentSize = clientState.getHandCurrentSize()
				let maximumSize = clientState.getHandMaximumSize()
                if(currentSize <= maximumSize){
                    event.finalized = true
                    break
                }
				event.cardSelector.selectionQuantity = currentSize - maximumSize
				event.activateSelection()
				event.cardSelector.stateFromParent =  Utils.toFullCardState({selectable:true, ignoreCost:true})
				event.title = `Too many cards in hand, please select ${event.cardSelector.selectionQuantity} cards to sell or more.`
				break
			}
			case('selectCardOptionalSell'):{
				event.activateSelection()
				event.cardSelector.stateFromParent =  Utils.toFullCardState({selectable:true, ignoreCost:true})
				break
			}
			case('addRessourceToSelectedCard'):{
				let selectFrom = this.gameStateService.getClientProjectPlayedModelList(event.cardSelector.filter)
				if(selectFrom.length===0){event.finalized=true;break}
				event.activateSelection()
				event.cardSelector.selectFrom = selectFrom
				break
			}
			case('recallCardInHand'):case('doubleProduction'):{
				event.cardSelector.selectFrom = this.gameStateService.getClientState().getProjectPlayedModelList(event.cardSelector.filter)
				break
			}
		}
    }
	private switchEventComplexCardSelector(event: EventComplexCardSelector){
		switch(event.subType){
			case('discardCards'):{
				event.activateSelection()
				event.cardSelector.stateFromParent =  Utils.toFullCardState({selectable:true, ignoreCost:true})
				break
			}
			case('scanKeepResult'):{
				if(event.scanKeepOptions===DeckQueryOptionsEnum.modPro){
					let card = this.gameStateService.getClientProjectPlayedModelList().filter((el)=>el.cardCode==='P32')[0]
					if(!card){break}
					let tag = Utils.toTagType(card.tagsId[0])
					if(!event.cardSelector.filter){break}
					event.cardSelector.filter.authorizedTag = [tag]
					event.title = `Modpro : add one card to hand with an ${tag[0].toUpperCase() + tag.slice(1)} tag`
				}
			}
		}
	}
	private switchEventCardActivator(event: EventCardActivator){

		let subType = event.subType as EventCardActivatorSubType
		if(event.refreshSelectorOnSwitch){event.cardSelector.selectFrom = this.gameStateService.getClientHandModelList(event.cardSelector.filter)}

		//check per subType special rules:
		switch(subType){
			case('actionPhaseActivator'):{
				let state = this.gameStateService.getClientState()
				let plantStock = state.getRessourceInfoFromType('plant')?.valueStock??0
				let heatStock = state.getRessourceInfoFromType('heat')?.valueStock??0
				let finishPhaseButtonEnabled = (heatStock>=8  || plantStock>=8 || (heatStock>=5  && plantStock>=3)) === false

				event.cardSelector.selectFrom = this.gameStateService.getClientProjectPlayedModelList(event.cardSelector.filter)
				if(event.button){
					event.button.startEnabled = finishPhaseButtonEnabled
					event.button.resetStartEnabled()
				}
				break
			}
		}
	}


	private switchEventPhase(event: EventPhase): void {
		let subType = event.subType as EventPhaseSubType
		if(event.autoFinalize===true){event.finalized=true}
		switch(subType){
			case('developmentPhase'):{this.phaseHandler.resolveDevelopment();break}
			case('constructionPhase'):{this.phaseHandler.resolveConstruction();break}
			case('actionPhase'):{this.phaseHandler.resolveAction(); break}
			case('productionPhase'):{
				if(event.productionApplied){return}
				event.productionApplied = true // prevents infinite loops
				this.phaseHandler.resolveProduction(event);
				break
			}
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
			case('cardActivator'):{this.finishEventCardActivator(this.currentEvent as EventCardActivator); break}
			case('ComplexSelector'):{this.finishEventComplexCardSelector(this.currentEvent as EventComplexCardSelector); break}
			case('tagSelector'):{this.finishEventTagSelector(this.currentEvent as EventTagSelector); break}
			default:{Logger.logError('Non mapped event in handler.finishEventEffect: ', this.currentEvent)}
        }
		if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
		this.checkFinalized()
    }
    private finishEventCardSelector(event: EventCardSelector): void {
		Logger.logEventResolution('resolving event: ','EventCardSelector ', event.subType)

		event.finalized = true

        switch(event.subType){
			case('selectCardForcedSell'):case('selectCardOptionalSell'):{
				event.finalized = true
				this.gameStateService.removeCardsFromClientHandById(Utils.toCardsIdList(event.cardSelector.selectedList), 'project')
				this.gameStateService.sellCardsFromClientHand(event.cardSelector.selectedList.length)
				break
			}
			case('researchPhaseResult'):{
				this.gameStateService.addCardsSelectedFromListAndDiscardTheRest(
					ProjectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectedList),
					ProjectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectFrom)
				)
				break
			}
			case('selectStartingHand'):{
				let drawNumber = event.cardSelector.selectedList.length
				event.finalized = true
				this.gameStateService.removeCardsFromClientHandByModel(event.cardSelector.selectedList, 'project')
				this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber}}), 'first')
				break
			}
			case('selectCorporation'):{
				event.finalized = true
				this.gameStateService.playCorporation(event.cardSelector.selectedList[0])
				break
			}
			case('selectMerger'):{
				event.finalized = true
				this.gameStateService.playCorporation(event.cardSelector.selectedList[0], true)
				this.gameStateService.applyAverageStartingMegacredits()
				break
			}
			case('recallCardInHand'):{
				event.finalized = true
				if(event.cardSelector.selectedList.length===0){break}
				this.gameStateService.recallCardFromPlayed(event.cardSelector.selectedList[0])
				break
			}
			case('doubleProduction'):{
				event.finalized = true
				this.gameStateService.applyDoubleProduction(event.cardSelector.selectedList[0])
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardSelector: ', this.currentEvent)}
        }
		event.activateSelection()
    }
	private finishEventComplexCardSelector(event: EventComplexCardSelector): void {
		Logger.logEventResolution('resolving event: ','EventScanKeepCardSelector ', event.subType)
		event.finalized = true
		switch(event.subType){
			case('discardCards'):{
				event.finalized = true
				let discardedList = event.cardSelector.selectedList
				this.gameStateService.removeCardsFromClientHandById(Utils.toCardsIdList(discardedList), 'project')

				switch(event.discardOptions){
					case(DiscardOptionsEnum.marsUniversity):{
						if(event.cardSelector.selectedList.length===0){break}
						let clientState = this.gameStateService.getClientState()
						let newEvents = PlayableCard.getOnTriggerredEvents(
								'ON_TRIGGER_RESOLUTION',
								clientState.getTriggersIdActive(),
								clientState,
								{discardedCard:discardedList[0]}
							)
						this.gameStateService.addEventQueue(
							newEvents,
							'first'
						)
						break
					}
					case(DiscardOptionsEnum.redraftedContracts):{
						if(event.cardSelector.selectedList.length===0){break}
						this.gameStateService.addEventQueue(
							EventFactory.simple.draw(event.cardSelector.selectedList.length),
							'first'
						)
						break
					}
					case(DiscardOptionsEnum.matterGenerator):{
						if(event.cardSelector.selectedList.length===0){break}
						this.gameStateService.addEventQueue(EventFactory.simple.addRessource({name:'megacredit', valueStock:6}), 'first')
					}
				}
				break
			}
			case('scanKeepResult'):{
				switch(event.scanKeepOptions){
					case(DeckQueryOptionsEnum.brainstormingSession):{
						let card = event.cardSelector.selectFrom[0]
						switch(card.cardType){
							case ('greenProject'):{
								this.gameStateService.addEventQueue(EventFactory.simple.addRessource({name:'megacredit', valueStock:1}), 'first')
								break
							}
							case('blueProject'):case('redProject'):{
								this.gameStateService.addCardsToClientHand(card.cardCode)
							}
						}
					}
				}
				if(event.cardSelector.selectedList.length>0){
					this.gameStateService.addCardsSelectedFromListAndDiscardTheRest(
						ProjectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectedList),
						ProjectCardInfoService.getProjectCardIdListFromModel(event.cardSelector.selectFrom)
					)
				}
			}
		}


	}
    private finishEventCardSelectorRessource(event: EventCardSelectorRessource): void {
		Logger.logEventResolution('resolving event: ','EventCardSelectorRessource ', event.subType)
		switch(event.subType){
			case('addRessourceToSelectedCard'):{
				event.finalized = true
				let stock: AdvancedRessourceStock[] = event.advancedRessource?[event.advancedRessource]:[]
				if(stock.length===0){break}

				this.gameStateService.addRessourceToClientCard({cardCode: event.cardSelector.selectedList[0].cardCode,stock: stock})
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardSelectorRessource: ', this.currentEvent)}
		}
    }
	private finishEventCardActivator(event: EventCardActivator): void {
		Logger.logEventResolution('resolving event: ','EventCardActivator ', event.subType)
		event.finalized = true

		switch(event.subType){
			case('actionPhaseActivator'):{
				for(let card of event.cardSelector.selectFrom){
					card.activated = 0
				}
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardActivator: ', this.currentEvent)}
		}
    }
	private finishEventCardBuilder(event: EventCardBuilder): void {
		Logger.logEventResolution('resolving event: ','EventCardBuilder ', event.subType)
		switch(event.subType){
			case('developmentPhaseBuilder'):case('constructionPhaseBuilder'):case('specialBuilder'):{
				event.finalized = true
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardBuilder: ', this.currentEvent)}
		}
	}
	private finishEventGeneric(event: EventGeneric): void {
		Logger.logEventResolution('resolving event: ','EventGeneric ', event.subType)

		if(event.subType!='buildCard'){event.finalized = true}

		switch(event.subType){
			case('endOfPhase'):{
				this.gameStateService.setClientReady(true)
				this.gameStateService.endOfPhase()
				break
			}
			case('buildCard'):{
				let card = event.cardIdToBuild
				if(!card){break}
				this.gameStateService.playCardFromClientHand(card, 'project')
				break
			}
			case('drawResult'):{
				if(event.drawResultList===undefined){break}
				this.gameStateService.addCardsToClientHand(event.drawResultList)
				break
			}
			case('drawResultThenDiscard'):{
				if(event.drawResultList===undefined){break}
				this.gameStateService.addCardsToClientHand(event.drawResultList)
				if(event.thenDiscard && event.thenDiscard>0){
					this.gameStateService.addEventQueue(EventFactory.simple.discard(event.thenDiscard), 'first')
				}
				break
			}
			case('increaseGlobalParameter'):{
				if(!event.increaseParameter){break}
				this.gameStateService.addGlobalParameterStepsEOPtoClient(event.increaseParameter)
				break
			}
			case('increaseResearchScanKeep'):{
				if(!event.increaseResearchScanKeep){break}
				if(event.increaseResearchScanKeep.scan!=undefined && event.increaseResearchScanKeep.scan>0){
					this.gameStateService.addClientResearchScanValue(event.increaseResearchScanKeep.scan)
				}
				if(event.increaseResearchScanKeep.keep!=undefined && event.increaseResearchScanKeep.keep>0){
					this.gameStateService.addClientResearchKeepValue(event.increaseResearchScanKeep.keep)
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

				this.gameStateService.addRessourceToClient(baseRessources)
				break
			}
			case('planificationPhase'):{
				this.gameStateService.clientSelectPhase(event.selectedPhase?.toUpperCase() as SelectablePhaseEnum)
				this.gameStateService.clientPlayerValidateSelectedPhase()
				break
			}
			case('oceanQuery'):{
				if(!event.gainOceanNumber){break}
				this.rxStompService.publishOceanQuery(event.gainOceanNumber, this.gameStateService.getClientStateDTO())
				break
			}
			case('upgradePhaseCards'):{break}
			case('waitingGroupReady'):{break}
			case('addForestPointAndOxygen'):{
				if(event.addForestPoint){
					this.gameStateService.addForestPointAndOxygen(event.addForestPoint)
				}
				break
			}
			case('addProduction'):{
				if(!event.baseRessource){break}
				this.gameStateService.addProductionToClient(event.baseRessource)
				break
			}
			case('addTr'):{
				if(!event.increaseTr){break}
				this.gameStateService.addTr(event.increaseTr)
				break
			}
			case('loadProductionPhaseCards'):{
				if(!event.loadProductionCardList || event.loadProductionCardList.length===0){break}
				this.gameStateService.loadProductionPhaseCardList(event.loadProductionCardList)
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventGeneric: ', this.currentEvent)}
		}
	}
	private finishEventDeckQuery(event: EventDeckQuery): void {
		Logger.logEventResolution('resolving event: ','EventDeckQuery ', event.subType)
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
			case('drawThenDiscard'):{
				resolveType = 'drawResultThenDiscard'
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventDeckQuery: ', this.currentEvent)}
		}

		if((event.drawDiscard===undefined && event.scanKeep===undefined) || event.waiterId===undefined || resolveType===undefined){return}

		//adding a deck waiter event until drawEvent resolution if deck event will draw something
		if((event.drawDiscard?.draw?event.drawDiscard.draw:0)>0 || (event.scanKeep?.scan!=undefined && event.scanKeep.scan>0)){
			this.gameStateService.addEventQueue(EventFactory.createWaiter('deckWaiter', event.id), 'second')
		}

		let drawNumber = event.drawDiscard?.draw
		if(drawNumber!=undefined && drawNumber>0){
			this.gameStateService.addDrawQueue(
				DrawEventFactory.createDrawEvent(resolveType, drawNumber,event.id, event.isCardProduction, event.drawThenDiscard?event.drawDiscard?.discard:0)
			)
		}
		if(event.scanKeep!==undefined){
			let scanKeep: ScanKeep = {scan:event.scanKeep?.scan?event.scanKeep?.scan:0, keep:event.scanKeep?.keep?event.scanKeep?.keep:0}
			this.gameStateService.addDrawQueue(DrawEventFactory.createScanKeepEvent(resolveType, scanKeep, event.waiterId, event.options))
		}
		this.gameStateService.cleanAndNextEventQueue()
	}
	private finishEventWaiter(event: EventWaiter): void {
		Logger.logEventResolution('resolving event: ','EventWaiter ', event.subType)
		switch(event.subType){
			case('deckWaiter'):{
				return
			}
			default:{Logger.logError('Non mapped event in handler.EventWaiter: ', this.currentEvent)}
		}
	}
	private finishEventTargetCards(event: EventTargetCard): void {
		Logger.logEventResolution('resolving event: ','EventTargetCard ', event.subType)

		switch(event.subType){
			case('addRessourceToCardId'):{
				if(event.advancedRessource===undefined){Logger.logError('event tried to add ressource, but variable was empty: ',event); break}
				let ressourceStock: AdvancedRessourceStock[] = []
				if(Array.isArray(event.advancedRessource)===true){
					ressourceStock = event.advancedRessource
				} else {
					ressourceStock.push(event.advancedRessource)
				}
				let cardStock: CardRessourceStock = {
					cardCode:event.targetCardId,
					stock:ressourceStock
				}
				this.gameStateService.addRessourceToClientCard(cardStock)
				break
			}
			case('deactivateTrigger'):{
				this.gameStateService.setClientTriggerAsInactive(event.targetCardId)
				break
			}
			case('addTagToCardId'):{
				this.gameStateService.addTagToTargetCard(event.targetCardId, event.addTag)
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventTargetCards: ', this.currentEvent)}
		}
	}
	private finishEventPhase(event: EventPhase): void {
		Logger.logEventResolution('resolving event: ','finishEventPhase', event.subType)

		switch(event.subType){
			case('developmentPhase'):case('constructionPhase'):case('researchPhase'):{
				break
			}
			case('productionPhase'):{
				event.finalized=true
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventPhase: ', this.currentEvent)}
		}
	}
	private finishEventTagSelector(event: EventTagSelector) {
		Logger.logEventResolution('resolving event: ','finishEventTagSelector', event.subType)
		switch(event.subType){
			case('tagSelector'):{
				event.finalized=true
				this.gameStateService.addEventQueue(EventFactory.simple.addTagToCard(event.targetCardId, event.selectedTag), 'first')
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventPhase: ', this.currentEvent)}
		}
	}
	private cancelCurrentEvent(): void {
		this.currentEvent.finalized = true
		this.checkFinalized()
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
		event.finalized = true
		this.resolveDrawEvent(event)
		this.gameStateService.cleanAndNextDrawQueue()
	}
	private sendWsDrawQuery(event: DrawEvent){
		event.queried = true
		switch(event.resolveEventSubType){
			case('drawResult'):{
				this.rxStompService.publishDraw(event.drawCardNumber, event.waiterId, this.gameStateService.getClientStateDTO(), event.isCardProduction)
				break
			}
			case('researchPhaseResult'):{
				this.rxStompService.publishScanKeep({scan:event.drawCardNumber, keep: event.keepCardNumber??0}, event.waiterId, this.gameStateService.getClientStateDTO(), event.resolveEventSubType)
				break
			}
			case('scanKeepResult'):{
				this.rxStompService.publishScanKeep({scan:event.drawCardNumber, keep: event.keepCardNumber??0}, event.waiterId, this.gameStateService.getClientStateDTO(), event.resolveEventSubType, event.scanKeepOptions)
				break
			}
			case('drawResultThenDiscard'):{
				this.rxStompService.publishDraw(event.drawCardNumber, event.waiterId, this.gameStateService.getClientStateDTO(), event.isCardProduction, event.discardAfterDraw)
				break
			}
			default:{
				console.error('UNMAPED DRAW QUERY RESULT TYPE: ',event.resolveEventSubType)
			}
		}
	}
	private resolveDrawEvent(drawEvent: DrawEvent): void {
		let resultEvent!: EventBaseModel
		Logger.logEventResolution('resolving deck event: ',drawEvent.resolveEventSubType)
		switch(drawEvent.resolveEventSubType){
			case('drawResult'):{
				resultEvent = EventFactory.createGeneric(
					'drawResult',
					{
						drawEventResult:drawEvent.drawResultCardList,
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
			case('researchPhaseResult'):{
				resultEvent = EventFactory.createCardSelector(
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
				resultEvent = EventFactory.createCardSelectorComplex(
					'scanKeepResult',
					{
						cardSelector:{
							selectFrom:this.projectCardInfoService.getProjectCardList(drawEvent.drawResultCardList),
							selectionQuantity: drawEvent.keepCardNumber,
						},
						scanKeepOptions:drawEvent.scanKeepOptions,
						waiterId:drawEvent.waiterId,
					}
				)
				break
			}
			case('drawResultThenDiscard'):{
				resultEvent = EventFactory.createGeneric(
					'drawResultThenDiscard',
					{
						drawEventResult:drawEvent.drawResultCardList,
						thenDiscard: drawEvent.discardAfterDraw,
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
	private clientPlayerId: myUUID = ''

	constructor(
		private gameStateService: GameState,
		private gameParam: GameParamService
	){

	}

	private getPhaseCards(): PhaseCardModel[] {
		return this.gameStateService.getClientPhaseCards(true)
	}
	private refreshCurrentUpgradedPhaseCard(): void {
		this.currentUpgradedPhaseCards = this.getPhaseCards()
	}
	private shouldReceivePhaseCardSelectionBonus(phaseResolved: SelectablePhaseEnum): boolean {
		return this.gameStateService.getClientCurrentSelectedPhase()===phaseResolved
	}
	resolveDevelopment(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[0].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.development)){
			builderType = 'developmentAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventFactory.createCardBuilder('developmentPhaseBuilder',builderType),'second')
	}
	resolveConstruction(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[1].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.construction)){
			builderType = 'constructionAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventFactory.createCardBuilder('constructionPhaseBuilder',builderType),'second')

		if(builderType==='construction_draw_card'){
			this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}),'second')
		}
	}
	resolveProduction(event: EventPhase): void {
		this.refreshCurrentUpgradedPhaseCard()

		let clientState = this.gameStateService.getClientState()
		let production: RessourceStock[] = []
		let newEvents: EventBaseModel[] = []
		let currentClientRessources: RessourceInfo[] = clientState.getRessources()

		for(let i=0; i<currentClientRessources.length; i++){
			let ressourceGain: number = 0
			let ressource = currentClientRessources[i]
			switch(ressource.name){
				case('megacredit'):{
						ressourceGain= ressource.valueProd
						+ clientState.getTR()
						+ this.getProductionPhaseCardSelectionBonus()
					break
				}
				case('plant'):case('heat'):{
					ressourceGain = ressource.valueProd
					break
				}
			}
			if(ressourceGain>0){
				production.push({name:ressource.name, valueStock:ressourceGain})
			}
		}

		event.productionMegacreditFromPhaseCard = this.getProductionPhaseCardSelectionBonus()
		if(this.shouldApplyDoubleProduction(event)){
			event.productionDoubleApplied = true
			newEvents.push(EventFactory.createCardSelector('doubleProduction'))
		}

		if(production.length>0){
			newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: production}))
			this.gameStateService.addEventQueue(newEvents, 'first')
		}
	}
	public getProductionPhaseCardSelectionBonus(): number {
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
	public shouldApplyDoubleProduction(event: EventPhase): boolean {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return false}
		return this.currentUpgradedPhaseCards[3].phaseType === 'production_1mc_activate_card' && event.productionDoubleApplied===false
	}
	resolveResearch(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let baseScanKeep: ScanKeep = {scan:2,keep:1}
		let clientState = this.gameStateService.getClientState()
		let modScanKeep: ScanKeep = clientState.getResearch()
		let bonusScanKeep: ScanKeep = this.getResearchPhaseCardSelectionBonus()
		let totalScanKeep = {
			scan: baseScanKeep.scan + modScanKeep.scan + bonusScanKeep.scan,
			keep: baseScanKeep.keep + modScanKeep.keep + bonusScanKeep.keep,
		}
		this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent(
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
	resolveAction(): void {
		let activatorEvent = EventFactory.createCardActivator('actionPhaseActivator')
		this.refreshCurrentUpgradedPhaseCard()
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.action)){
			this.gameStateService.addEventQueue(activatorEvent,'first')
			return
		}

		let events: EventBaseModel[] = []
		let actionPhaseCard = this.currentUpgradedPhaseCards[2]
		switch(actionPhaseCard.phaseType){
			case('action_base'):{
				activatorEvent.doubleActivationMaxNumber = 1
				events.push(activatorEvent)
				break
			}
			case('action_scan_cards'):{
				activatorEvent.doubleActivationMaxNumber = 1
				activatorEvent.hasScan = true
				events.push(activatorEvent)
				break
			}
			case('action_repeat_two'):{
				activatorEvent.doubleActivationMaxNumber = 2
				events.push(activatorEvent)
				break
			}
		}
		this.gameStateService.addEventQueue(events,'first')
	}
}
