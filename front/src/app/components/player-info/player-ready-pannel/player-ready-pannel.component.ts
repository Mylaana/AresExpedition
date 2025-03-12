import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyModel } from '../../../models/player-info/player-state.model';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-player-ready-pannel',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './player-ready-pannel.component.html',
	styleUrl: './player-ready-pannel.component.scss'
})
export class PlayerReadyPannelComponent implements OnInit, OnDestroy {
	currentGroupPlayerReady!: PlayerReadyModel[];
	currentGroupPlayerSelectedPhase!: PlayerPhase[];

	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(groupPlayerReady => this.currentGroupPlayerReady = groupPlayerReady)
		this.gameStateService.currentGroupPlayerSelectedPhase.pipe(takeUntil(this.destroy$)).subscribe(groupPlayerSelectedPhase => this.currentGroupPlayerSelectedPhase = groupPlayerSelectedPhase)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
}
