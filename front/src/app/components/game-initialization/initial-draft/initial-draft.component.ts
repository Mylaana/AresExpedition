import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameState } from '../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/cards/project-card.model';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { EventBaseModel, EventCardSelector } from '../../../models/core-game/event.model';
import { ProjectListType } from '../../../types/project-card.type';

@Component({
  selector: 'app-initial-draft',
  standalone: true,
  imports: [
	CommonModule,
	ProjectCardListComponent],
  templateUrl: './initial-draft.component.html',
  styleUrl: './initial-draft.component.scss'
})
export class InitialDraftComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: ProjectCardModel[], listType: ProjectListType}>
		= new EventEmitter<{selected: ProjectCardModel[], listType: ProjectListType}>()
	_playerHandCorporation: any = []
	_selectionList: ProjectCardModel[] =[]
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		//this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		this._playerHandCorporation = this.gameStateService.getClientState().getCorporationHandIdList()
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
