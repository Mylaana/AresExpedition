import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyModel } from '../../../models/player-info/player-state.model';
import { fadeIn } from '../../../animations/animations';

@Component({
    selector: 'app-waiting-ready',
    imports: [
        CommonModule
    ],
    templateUrl: './waiting-ready.component.html',
    styleUrl: './waiting-ready.component.scss',
    animations: [fadeIn]
})
export class WaitingReadyComponent implements OnInit{
	@Input() event!: EventBaseModel

	private destroy$ = new Subject<void>()
	_groupPlayerReady: PlayerReadyModel[] = []

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(ready => this.onGroupReadyUpdate(ready))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onGroupReadyUpdate(groupReady: PlayerReadyModel[]): void {
		this._groupPlayerReady = groupReady
	}
}
