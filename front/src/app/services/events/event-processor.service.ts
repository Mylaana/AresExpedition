import { Inject, Injectable, InjectionToken } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { DeckQueryOptionsEnum, DiscardOptionsEnum, InputRuleEnum } from "../../enum/global.enum"
import { SelectablePhaseEnum } from "../../enum/phase.enum"
import { DrawEventFactory } from "../../factory/draw-event-designer.service"
import { EventFactory } from "../../factory/event/event-factory"
import { PlayableCard } from "../../factory/playable-card.factory"
import { AdvancedRessourceStock, RessourceStock, ScanKeep, CardRessourceStock, RessourceInfo } from "../../interfaces/global.interface"
import { PhaseCardModel } from "../../models/cards/phase-card.model"
import { PlayableCardModel } from "../../models/cards/project-card.model"
import { EventBaseModel, EventCardSelector, EventCardBuilder, EventCardActivator, EventPhase, EventComplexCardSelector, EventCardSelectorRessource, EventGeneric, EventDeckQuery, EventTargetCard, EventWaiter, EventTagSelector, EventBaseCardSelector } from "../../models/core-game/event.model"
import { EventCardSelectorSubType, EventCardSelectorRessourceSubType, EventCardActivatorSubType, EventPhaseSubType, EventUnionSubTypes } from "../../types/event.type"
import { myUUID } from "../../types/global.type"
import { BuilderType } from "../../types/phase-card.type"
import { ProjectListType, ActivationOption } from "../../types/project-card.type"
import { Utils, Logger } from "../../utils/utils"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { GameParamService } from "../core-game/game-param.service"
import { GameStateFacadeService } from "../game-state/game-state-facade.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { CardSelectorService } from "../core-game/components-services/card-selector.service"
import { EventQueueService } from "./event-queue.service"
import { CommandButtonStateService } from "../game-state/command-button-state.service"
import { CardBuilderService } from "../core-game/components-services/card-builder.service"
import { EventBuilderCommand, GameEventHandler } from "../../interfaces/services.interface"
import { EventBuilderHandler } from "./handlers/event-builder-handler"
import { EventSelectorHandler } from "./handlers/event-selector-handler"

export const GAME_EVENT_HANDLERS = new InjectionToken<GameEventHandler[]>(
  'GAME_EVENT_HANDLERS'
);

@Injectable({
	providedIn: 'root'
})
export class EventProcessor {
    private eventCounter: number = 0
	private currentEvent!: EventBaseModel
	private currentEventId!: number
	private waiterResolved: number[] = []
	private readonly phaseHandler = new PhaseResolveHandler(this.gameStateService, this.gameParam)

	private _currentEvent$ = new BehaviorSubject<EventBaseModel | undefined>(undefined)
	readonly currentEventObs = this._currentEvent$.asObservable()
	
	private _eventActivator$ = new BehaviorSubject<EventCardActivator | null>(null)
	readonly currentEventActivator = this._eventActivator$.asObservable()
	
	readonly currentEventQueue = this.gameEventQueueService._eventQueue$.asObservable()

    constructor(
		private gameStateService: GameStateFacadeService,
		private gameEventQueueService: EventQueueService,
		private gameParam: GameParamService,
		private builderService: CardBuilderService,
		private selectorService: CardSelectorService,
		private commandButtonStateService: CommandButtonStateService,

		@Inject(GAME_EVENT_HANDLERS)
    	private readonly handlers: GameEventHandler[]
	){
		this.currentEventQueue.subscribe(queue => this.handleQueueUpdate(queue))
		this.builderService.currentBuilderButtonCommand.subscribe(command => {
			if(!command){return}
			this.onBuilderButtonCommand(command)
		})
	}
	public handleQueueUpdate(eventQueue: EventBaseModel[]){
		if(eventQueue.length===0){return}
		if(eventQueue[0].id!=undefined && this.currentEventId!=undefined 
			&& Utils.jsonCopy(eventQueue[0].id)===Utils.jsonCopy(this.currentEventId)){return}
		if(eventQueue[0].finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return
		}
		this.switchEvent(eventQueue, this.currentEvent)
		if(this.waiterResolved.length!=0){this.resolveWaiters(eventQueue)}
		this.checkFinalized()
		this.updateSpecificEventSubjects(eventQueue)
	}
	private toEventCardActivator(event: EventBaseModel): EventCardActivator | null {
		return event?.hasCardActivator()
			? (event as EventCardActivator)
			: null
	}
	private toEventCardSelector(event: EventBaseModel): EventBaseCardSelector | null {
        return event?.hasSelector() && event?.hasCardBuilder()===false
			? (event as EventBaseCardSelector)
			: null
	}
    private toEventCardBuilder(event: EventBaseModel): EventCardBuilder | null {
		return event?.hasCardBuilder()
			? (event as EventCardBuilder)
			: null
	}
    private toEventWithMainButton(event: EventBaseModel): EventBaseModel | null {
        return event.button
            ? event
            : null
    }
    private updateSpecificEventSubjects(eventQueue: EventBaseModel[]) {
		if(!this.currentEvent){return}
	
		this._eventActivator$.next(this.toEventCardActivator(this.currentEvent))
        this.updateBuilderServiceCurrentEvent()
		this.updateSelectorServiceCurrentEvent()
		this.updateEventWithMainButtonServiceCurrentEvent()        
	}
	private updateBuilderServiceCurrentEvent(){
		this.builderService.onEventUpdate(this.toEventCardBuilder(this.currentEvent))
	}
	private updateSelectorServiceCurrentEvent(){
		this.selectorService.onEventUpdate(this.toEventCardSelector(this.currentEvent))
	}
	private updateEventWithMainButtonServiceCurrentEvent(){
		this.commandButtonStateService.onEventWithMainButtonUpdate(this.toEventWithMainButton(this.currentEvent))
	}
	public eventMainButtonClicked(): void {
		this.finishEventEffect()
	}
	public updateValidateButton(enabled: boolean): void {
		this.currentEvent.button?.setEnabled(enabled)
		this.currentEvent.button?.locked?this.currentEvent.lockValidateButton:false
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
	private checkFinalized(): void {
		if(this.currentEvent.finalized===true){
			this.gameStateService.cleanAndNextEventQueue()
		}
	}
	private setEventId(): number {
		this.eventCounter += 1
		return this.eventCounter
	}
    private switchEvent(eventQueue: EventBaseModel[], _event: EventBaseModel): void {
		//switching current event to top of the pile
		this.currentEvent = eventQueue[0]
		this._currentEvent$.next(this.currentEvent)
		if(!this.currentEvent.id){this.currentEvent.id = this.setEventId()}
		this.currentEventId = this.currentEvent.id

		//event specific onSwitch rules
		this.currentEvent.onSwitch()

        //handler onSwitch rules
		this.getHandlerFor(this.currentEvent)?.onSwitchEvent(this.currentEvent)
		if(this.currentEvent.type==='phase'){this.switchEventPhase(this.currentEvent as EventPhase)}
		if(this.currentEvent.type==='cardActivator'){this.switchEventCardActivator(this.currentEvent as EventCardActivator)}

		//specific cases
		if(this.currentEvent.subType==='planificationPhase' && this.currentEvent.button){
			this.currentEvent.button.resetStartEnabled()
		}

		this.applyAutoFinalize()
    }
	private applyAutoFinalize(): void {
		if(this.currentEvent.autoFinalize!=true){return}

		this.currentEvent.finalized = true
		this.finishEventEffect()
	}
	private switchEventCardActivator(event: EventCardActivator){
		
		let subType = event.subType as EventCardActivatorSubType
		if(event.refreshSelectorOnSwitch){event.setSelectorSelectFrom(this.gameStateService.getClientHandModelList(event.getSelectorFilter()))}
		
		//check per subType special rules:
		switch(subType){
			case('actionPhaseActivator'):{
				event.setSelectorSelectFrom(this.gameStateService.getClientProjectPlayedModelList(event.getSelectorFilter()))
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
		const handler = this.getHandlerFor(this.currentEvent)
		if(handler){
			handler.onFinalizeEvent(this.currentEvent)
			if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
			this.checkFinalized()
			return
		}

		switch(this.currentEvent.type){
            case('cardSelectorRessource'):{this.finishEventCardSelectorRessource(this.currentEvent as EventCardSelectorRessource); break}
			case('deck'):{this.finishEventDeckQuery(this.currentEvent as EventDeckQuery); break}
			case('targetCard'):{this.finishEventTargetCards(this.currentEvent as EventTargetCard); break}
			case('waiter'):{this.finishEventWaiter(this.currentEvent as EventWaiter);break}
			case('phase'):{this.finishEventPhase(this.currentEvent as EventPhase); break}
			case('cardActivator'):{this.finishEventCardActivator(this.currentEvent as EventCardActivator); break}
			case('tagSelector'):{this.finishEventTagSelector(this.currentEvent as EventTagSelector); break}
			default:{Logger.logError('Non mapped event in handler.finishEventEffect: ', this.currentEvent)}
        }
		if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
		this.checkFinalized()
    }
    private finishEventCardSelectorRessource(event: EventCardSelectorRessource): void {
		Logger.logEventResolution('resolving event: ','EventCardSelectorRessource ', event.subType)
		switch(event.subType){
			case('addRessourceToSelectedCard'):{
				event.finalized = true
				let stock: AdvancedRessourceStock[] = event.advancedRessource?[event.advancedRessource]:[]
				if(stock.length===0){break}

				this.gameStateService.addRessourceToClientCard({cardCode: event.getSelectorSelectedList()[0].cardCode,stock: stock})
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
				for(let card of event.getSelectorSelectFrom()){
					card.activated = 0
				}
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventCardActivator: ', this.currentEvent)}
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
				DrawEventFactory.createDrawEvent(
					resolveType,
					drawNumber,event.id,
					event.isCardProduction,
					event.drawThenDiscard?event.drawDiscard?.discard:0,
					event.isCardProductionDouble,
					event.firstCardProduction
				)
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
	onBuilderButtonCommand(command: EventBuilderCommand): void {
		const handler = this.getHandlerFor(this.currentEvent)
		if(!(handler && this.isEventBuilderEventHandler(handler))){return}
		
		let event = this.currentEvent as EventCardBuilder
		handler.onBuilderButtonCommand(event, command)

		if(command.commandType==='alternativePay'){
			this.builderService.notifyNewDiscount(event.getCurrentBuilderDiscount())
		}
	}
	private getHandlerFor(event: EventBaseModel): GameEventHandler | null {
		return this.handlers.find(h => h.supports(event)) ?? null;
	}
	private isEventBuilderEventHandler(handler: GameEventHandler): handler is EventBuilderHandler {
		return typeof(handler as EventBuilderHandler).onBuilderButtonCommand === 'function'
	}
	private isEventSelectorEventHandler(handler: GameEventHandler): handler is EventSelectorHandler {
		return typeof(handler as EventSelectorHandler) === typeof(EventSelectorHandler)
	}
}

class PhaseResolveHandler {
	private currentUpgradedPhaseCards!: PhaseCardModel[]
	private clientPlayerId: myUUID = ''

	constructor(
		private gameStateService: GameStateFacadeService,
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
