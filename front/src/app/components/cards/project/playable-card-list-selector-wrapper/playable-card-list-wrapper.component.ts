import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PlayableCardListComponent } from '../playable-card-list/playable-card-list.component';
import { Subject, takeUntil } from 'rxjs';
import { GameStateFacadeService } from '../../../../services/game-state/game-state-facade.service';
import { EventBaseCardSelector } from '../../../../models/core-game/event.model';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../interfaces/card.interface';
import { Utils } from '../../../../utils/utils';
import { MinMaxEqualType } from '../../../../types/global.type';
import { EventHandler } from '../../../../models/core-game/handlers.model';
import { ListBehavior, ProjectListType } from '../../../../types/project-card.type';

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
	@ViewChild('cardList') cardListChild!: PlayableCardListComponent
	

	_currentEvent!: EventBaseCardSelector | null
	destroy$ = new Subject<void>()
	_cardList!: PlayableCardModel[]
	_initialCardState!: CardState
	_selectionTresholdType!: MinMaxEqualType
	_selectionQuantity!: number
	
	constructor(
		private gameStateService: GameStateFacadeService,
		private eventHandler: EventHandler
	){}
	
	ngOnInit(): void {
		switch(this.listBehavior){
			case('selector'):{
				this.gameStateService.currentEventSelector.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventSelectorUpdate(event))
				break
			}
			case('builder'):{
				this.gameStateService.currentEventBuilder.pipe(takeUntil(this.destroy$)).subscribe(event => this.onEventBuilderUpdate(event))
			}
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onEventSelectorUpdate(event: EventBaseCardSelector | null){
		console.log('new event Selector focus:',event)
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		let selector = event.getCardSelector()
		this._cardList = selector.selectFrom
		if(selector.cardInitialState){
			this._initialCardState = Utils.toFullCardState(selector.cardInitialState)
		}
		this._selectionQuantity = selector.selectionQuantity
		this._selectionTresholdType = selector.selectionQuantityTreshold
	}
	onEventBuilderUpdate(event: EventBaseCardSelector | null){
		console.log('new event Builder focus:',event)
		this._currentEvent = event
		if(!event){
			this.resetState()
			return
		}
		let selector = event.getCardSelector()
		this._cardList = selector.selectFrom
		if(selector.cardInitialState){
			this._initialCardState = Utils.toFullCardState(selector.cardInitialState)
		}
		this._selectionQuantity = selector.selectionQuantity
		this._selectionTresholdType = selector.selectionQuantityTreshold
	}
	resetState(){
		this._cardList = []
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.eventHandler.updateSelectedCardList(input.selected, input.listType)
	}
	public selectAll(){
		this.cardListChild.selectAll()
	}
	public selectNone(){ 
		this.cardListChild.selectNone()
	}
}
