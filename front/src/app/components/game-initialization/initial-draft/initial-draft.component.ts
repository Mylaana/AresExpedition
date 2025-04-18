import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameState } from '../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { ProjectListType } from '../../../types/project-card.type';

@Component({
  selector: 'app-initial-draft',
  standalone: true,
  imports: [
	CommonModule,
	PlayableCardListComponent],
  templateUrl: './initial-draft.component.html',
  styleUrl: './initial-draft.component.scss'
})
export class InitialDraftComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>
		= new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	_playerHandCorporation: PlayableCardModel[] = []
	_selectionList: PlayableCardModel[] =[]
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		//this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		this._playerHandCorporation = this.gameStateService.getClientHandCorporationModelList()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onClientStateUpdate(state: PlayerStateModel): void {
	}
	onUpdateSelectedCardList(output: any): void {
		this.updateSelectedCardList.emit(output)
	}
}
