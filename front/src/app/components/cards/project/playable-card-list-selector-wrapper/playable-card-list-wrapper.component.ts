import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PlayableCardListComponent } from '../playable-card-list/playable-card-list.component';
import { Subject, takeUntil } from 'rxjs';
import { GameStateFacadeService } from '../../../../services/game-state/game-state-facade.service';
import { EventBaseCardSelector, EventCardBuilder } from '../../../../models/core-game/event.model';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../interfaces/card.interface';
import { Utils } from '../../../../utils/utils';
import { MinMaxEqualType } from '../../../../types/global.type';
import { EventHandler } from '../../../../models/core-game/handlers.model';
import { ListBehavior, ProjectListType } from '../../../../types/project-card.type';
import { CardSelector } from '../../../../interfaces/global.interface';
import { CardBuilderEventHandlerService } from '../../../../services/core-game/card-builder-event-handler.service';

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
	
	constructor(
		private gameStateService: GameStateFacadeService,
		private eventHandler: EventHandler,
		private builderService: CardBuilderEventHandlerService
	){}
	
	ngOnInit(): void {
		switch(this.listBehavior){
			case('selector'):{
				this.gameStateService.currentEventSelector.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventSelectorUpdate(event))
				this._listType = 'selector'
				break
			}
			case('builder'):{
				this.gameStateService.currentEventBuilder.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventBuilderUpdate(event))
				this.builderService.currentBuilderIsComplete.pipe(takeUntil(this.destroy$)).subscribe(v => this.onBuilderComplete(v))
				this.builderService.currentActiveBuilderDiscount.pipe(takeUntil(this.destroy$)).subscribe(d => this.updateDiscount(d))
				this.builderService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destroy$)).subscribe(() => {
					if(!this._currentEvent){return}
					console.log('notified')
					this.setSelectorPart(this._currentEvent?.getCardSelector())
				})
				this._listType = 'builderSelector'
				break
			}
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	private onEventSelectorUpdate(event: EventBaseCardSelector | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
	}
	private onEventBuilderUpdate(event: EventCardBuilder | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		this.updateDiscount(event.getCurrentBuilderDiscount())
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
				this.eventHandler.updateSelectedCardList(input.selected, input.listType)
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
}
