import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { EventBaseModel, EventPhase } from '../../../models/core-game/event.model';

@Component({
    selector: 'app-phase-production',
    imports: [PlayableCardListComponent],
    templateUrl: './phase-production.component.html',
    styleUrl: './phase-production.component.scss'
})
export class PhaseProductionComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel

	constructor(private gameStateService: GameState){}
	clientPlayerState!: PlayerStateModel;
	_productionCardList: PlayableCardModel[] = []
	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateState(state))
		this.updateCardList(this.event as EventPhase)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateState(state: PlayerStateModel): void {
		this.clientPlayerState = state
	}
	updateCardList(event: EventPhase){
		this._productionCardList = event.productionCardList??[]
	}
}
