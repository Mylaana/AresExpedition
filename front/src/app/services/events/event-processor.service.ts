import { Inject, Injectable, InjectionToken } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { DrawEventFactory } from "../../factory/draw-event-designer.service"
import { EventFactory } from "../../factory/event/event-factory"
import { AdvancedRessourceStock, ScanKeep, CardRessourceStock } from "../../interfaces/global.interface"
import { PlayableCardModel } from "../../models/cards/project-card.model"
import { EventBaseModel, EventCardSelector, EventCardBuilder, EventCardActivator, EventPhase, EventCardSelectorRessource, EventDeckQuery, EventTargetCard, EventWaiter, EventTagSelector, EventBaseCardSelector } from "../../models/core-game/event.model"
import { EventCardActivatorSubType, EventUnionSubTypes } from "../../types/event.type"
import { ProjectListType, ActivationOption } from "../../types/project-card.type"
import { Utils, Logger } from "../../utils/utils"
import { GameStateFacadeService } from "../game-state/game-state-facade.service"
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

	private currentEventSubject$ = new BehaviorSubject<EventBaseModel | undefined>(undefined)
	readonly currentEventObs = this.currentEventSubject$.asObservable()
	
	private _eventActivator$ = new BehaviorSubject<EventCardActivator | null>(null)
	readonly currentEventActivator = this._eventActivator$.asObservable()
	
	readonly currentEventQueue = this.gameEventQueueService._eventQueue$.asObservable()

    constructor(
		private gameStateService: GameStateFacadeService,
		private gameEventQueueService: EventQueueService,
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
		this.currentEventSubject$.next(this.currentEvent)
		if(!this.currentEvent.id){this.currentEvent.id = this.setEventId()}
		this.currentEventId = this.currentEvent.id

		//event specific onSwitch rules
		this.currentEvent.onSwitch()

        //handler onSwitch rules
		this.getHandlerFor(this.currentEvent)?.onSwitchEvent(this.currentEvent)

		this.applyAutoFinalize()
    }
	private applyAutoFinalize(): void {
		if(this.currentEvent.autoFinalize!=true){return}

		this.currentEvent.finalized = true
		this.finishEventEffect()
	}
    private finishEventEffect(){
		const handler = this.getHandlerFor(this.currentEvent)
		if(handler){
			handler.onFinalizeEvent(this.currentEvent)
			if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
			this.checkFinalized()
			return
		} else {
			Logger.logError('Non mapped event in handler.finishEventEffect: ', this.currentEvent)
		}

		if(this.currentEvent.waiterId!=undefined){this.waiterResolved.push(this.currentEvent.waiterId)}
		this.checkFinalized()
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
	private onBuilderButtonCommand(command: EventBuilderCommand): void {
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
}