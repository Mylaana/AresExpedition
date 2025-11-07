import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectListType } from '../../../types/project-card.type';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/game-state/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GAME_CARD_SELL_VALUE } from '../../../global/global-const';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { NonEventButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-sell-cards',
  imports: [
	CommonModule,
	PlayableCardListComponent,
	NonEventButtonComponent
],
  templateUrl: './sell-cards.component.html',
  styleUrl: './sell-cards.component.scss'
})
export class SellCardsComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	@ViewChild('cardListSelector') playableList!: PlayableCardListComponent

	_totalSell: number = 0
	_sellValue: number = 3
	_selectAll: NonEventButton = ButtonDesigner.createNonEventButton('sellCardsSelectAll')
	_selectNone: NonEventButton = ButtonDesigner.createNonEventButton('sellCardsSelectNone')
	destroy$ = new Subject<void>

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateClientState(state))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.updateSelectedCardList.emit(input)
		this._totalSell = input.selected.length * this._sellValue
	}
	private updateClientState(state: PlayerStateModel){
		this._sellValue = GAME_CARD_SELL_VALUE +  state.getSellCardValueMod()
	}
	private selectAll(){
		this.playableList.selectAll()
	}
	private selectNone() {
		this.playableList.selectNone()
	}
	onButtonClicked(button: NonEventButton){
		switch(button.name){
			case('sellCardsSelectAll'):{
				this.selectAll()
				break
			}
			case('sellCardsSelectNone'):{
				this.selectNone()
				break
			}
		}
	}
}
