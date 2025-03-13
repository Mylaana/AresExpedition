import { Component, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-player-selected-phase-pannel',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './player-selected-phase-pannel.component.html',
	styleUrl: './player-selected-phase-pannel.component.scss'
})
export class PlayerSelectedPhasePannelComponent implements OnInit{
	currentGroupPlayerSelectedPhase!: PlayerPhase[];
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		this.gameStateService.currentGroupPlayerSelectedPhase.pipe(takeUntil(this.destroy$)).subscribe(groupPlayerSelectedPhase => this.currentGroupPlayerSelectedPhase = groupPlayerSelectedPhase)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
}
