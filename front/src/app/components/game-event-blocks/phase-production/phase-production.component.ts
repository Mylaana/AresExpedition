import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-phase-production',
    imports: [],
    templateUrl: './phase-production.component.html',
    styleUrl: './phase-production.component.scss'
})
export class PhaseProductionComponent implements OnInit, OnDestroy{
	constructor(private gameStateService: GameState){}
	currentGroupPlayerState!: PlayerStateModel[];
	clientPlayerState!: PlayerStateModel;

	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(groupPlayerState => this.updateState(groupPlayerState))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}

	updateState(state: PlayerStateModel[]): void {
		this.currentGroupPlayerState = state
		this.clientPlayerState = this.gameStateService.getClientState()
	}
}
