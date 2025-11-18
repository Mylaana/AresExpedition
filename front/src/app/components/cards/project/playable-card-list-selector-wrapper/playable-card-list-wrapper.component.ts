import { CommonModule } from "@angular/common"
import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from "@angular/core"
import { Subject, takeUntil } from "rxjs"
import { CardState } from "../../../../interfaces/card.interface"
import { ProjectFilter, CardSelector } from "../../../../interfaces/global.interface"
import { PlayableCardModel } from "../../../../models/cards/project-card.model"
import { EventBaseCardSelector, EventCardBuilder, EventCardActivator } from "../../../../models/core-game/event.model"
import { EventProcessor } from "../../../../services/events/event-processor.service"
import { CardBuilderEventHandlerService } from "../../../../services/events/Sub/card-builder-event-handler.service"
import { CardSelectorEventHandlerService } from "../../../../services/events/Sub/card-selector-event-handler.service"
import { CommandButtonStateService } from "../../../../services/game-state/command-button-state.service"
import { GameStateFacadeService } from "../../../../services/game-state/game-state-facade.service"
import { EventUnionSubTypes } from "../../../../types/event.type"
import { MinMaxEqualType } from "../../../../types/global.type"
import { ListBehavior, ProjectListType, ActivationOption, ProjectListSubType } from "../../../../types/project-card.type"
import { Utils } from "../../../../utils/utils"
import { PlayableCardListComponent } from "../playable-card-list/playable-card-list.component"

@Component({
	selector: 'app-playable-card-list-wrapper',
	imports: [
		CommonModule,
		PlayableCardListComponent		
	],
	templateUrl: './playable-card-list-wrapper.component.html',
	styleUrl: './playable-card-list-wrapper.component.scss'
})
export class PlayableCardListWrapperComponent implements OnInit, OnDestroy {
	@Input() listBehavior: ListBehavior = 'display'
	@Output() onSelectionUpdateForBuilderEvent = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	@Output() onSelectionUpdateForSelectorEvent = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	@Output() projectActivated = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	@ViewChild('cardList') cardListChild!: PlayableCardListComponent
	
	destroy$ = new Subject<void>()
	
	_authorizeSelection: boolean = false
	_currentEvent!: EventBaseCardSelector | null
	_cardList!: PlayableCardModel[]
	_initialCardState!: CardState
	_currentCardState!: CardState
	_selectionTresholdType!: MinMaxEqualType
	_selectionQuantity!: number
	_builderDiscount!: number
	_listType!: ProjectListType
	_filter!: ProjectFilter | undefined
	_listSubType: ProjectListSubType = 'none'
	
	constructor(
		private eventProcessor: EventProcessor,
		private builderService: CardBuilderEventHandlerService,
		private selectorService: CardSelectorEventHandlerService,
		private mainButtonService: CommandButtonStateService
	){}
	
	ngOnInit(): void {
		switch(this.listBehavior){
			case('selector'):{
				this.selectorService.currentEventSelector.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventSelectorUpdate(event))
				this.selectorService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destroy$)).subscribe(() => {
					if(!this._currentEvent){return}
					let selector = this._currentEvent?.getCardSelector()
					console.log('PlayableCardListWrapperComponent - notifyRecalculateSelector', Utils.jsonCopy(selector))
					this.setSelectorPart(this._currentEvent?.getCardSelector())
				})
				this._listType = 'selector'
				break
			}
			case('builder'):{
				this.builderService.currentEventBuilder.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventBuilderUpdate(event))
				this.builderService.currentBuilderIsComplete.pipe(takeUntil(this.destroy$)).subscribe(v => this.onBuilderComplete(v))
				this.builderService.currentActiveBuilderDiscount.pipe(takeUntil(this.destroy$)).subscribe(d => this.updateDiscount(d))
				this.builderService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destroy$)).subscribe(() => {
					if(!this._currentEvent){return}
					this.setSelectorPart(this._currentEvent?.getCardSelector())
				})
				this._listType = 'builderSelector'
				break
			}
			case('activator'):{
				this.eventProcessor.currentEventActivator.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventActivatorUpdate(event))
			}
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	private onEventSelectorUpdate(event: EventBaseCardSelector | null){
		this._currentEvent = event
		console.log('PlayableCardListWrapperComponent - onEventSelectorUpdate', Utils.jsonCopy(event))
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		this.setListSubType(event.subType)
	}
	private onEventBuilderUpdate(event: EventCardBuilder | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		this.updateDiscount(event.getCurrentBuilderDiscount())
		this.setListSubType(event.subType)
	}
	private onEventActivatorUpdate(event: EventCardActivator | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		this.setListSubType(event.subType)
	}
	private updateDiscount(discount: number){
		this._builderDiscount = discount
	}
	private onBuilderComplete(complete: boolean){
		if(!this._currentEvent){return}
		if(!complete){return}
		this.setAuthorizeSelection(!complete)
	}
	private setSelectorPart(selector: CardSelector){
		this._cardList = selector.selectFrom
		if(selector.cardInitialState){
			this._initialCardState = Utils.toFullCardState(selector.cardInitialState)
		}
		this._selectionQuantity = selector.selectionQuantity
		this._selectionTresholdType = selector.selectionQuantityTreshold
		this.setAuthorizeSelection(selector.cardInitialState?.selectable??false)
		this._filter = selector.filter
	}
	private setAuthorizeSelection(authorized: boolean){
		this._authorizeSelection = authorized
	}
	private resetState(){
		this._cardList = []
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		switch(this.listBehavior){
			case('builder'):{
				this.onSelectionUpdateForBuilderEvent.emit(input)
				break
			}
			default:{
				this.onSelectionUpdateForSelectorEvent.emit(input)
				this.eventProcessor.updateSelectedCardList(input.selected, input.listType)
				this.mainButtonService.updateCurrentEventMainButton()
				break
			}
		}
	}
	public selectAll(){
		this.cardListChild.selectAll()
	}
	public selectNone(){ 
		this.cardListChild.selectNone()
	}
	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}){
		this.projectActivated.emit(input)
	}
	private setListSubType(eventSubtype: EventUnionSubTypes): void {
		switch(eventSubtype){
			case('selectCardForcedSell'):case('selectCardOptionalSell'):{this._listSubType = 'sell'; break}
			case('researchPhaseResult'):{this._listSubType = 'research'; break}
			case('discardCards'):{this._listSubType='discard'; break}
			case('addRessourceToSelectedCard'):{this._listSubType='addRessource';break}
			case('scanKeepResult'):{this._listSubType='scanKeepResult';break}
			case('doubleProduction'):{this._listSubType='repeatProduction';break}
			case('selectStartingHand'):{this._listSubType='recycleStartingProject';break}
		}
	}
}
