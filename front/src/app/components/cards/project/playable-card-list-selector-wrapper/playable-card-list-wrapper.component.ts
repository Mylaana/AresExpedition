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
	

	_currentEvent!: EventBaseCardSelector | null
	destroy$ = new Subject<void>()
	_cardList!: PlayableCardModel[]
	_initialCardState!: CardState
	_currentCardState!: CardState
	_selectionTresholdType!: MinMaxEqualType
	_selectionQuantity!: number
	_builderDiscount!: number
	_listType!: ProjectListType
	
	constructor(
		private gameStateService: GameStateFacadeService,
		private eventHandler: EventHandler
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
				this._listType = 'builderSelector'
				break
			}
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onEventSelectorUpdate(event: EventBaseCardSelector | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		console.log('selector:',event)
	}
	onEventBuilderUpdate(event: EventCardBuilder | null){
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		this.setSelectorPart(event.getCardSelector())
		this._builderDiscount = event.getCurrentBuilderDiscount()
		console.log('builder:', event)
	}
	setSelectorPart(selector: CardSelector){
		this._cardList = selector.selectFrom
		if(selector.cardInitialState){
			this._initialCardState = Utils.toFullCardState(selector.cardInitialState)
		}
		if(selector.stateFromParent){
			this._currentCardState = Utils.toFullCardState(selector.stateFromParent)
		}
		this._selectionQuantity = selector.selectionQuantity
		this._selectionTresholdType = selector.selectionQuantityTreshold
	}
	resetState(){
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
