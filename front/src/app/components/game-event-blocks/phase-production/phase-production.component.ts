import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { EventBaseModel, EventPhase } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-phase-production',
    imports: [
		CommonModule,
		PlayableCardListComponent
	],
    templateUrl: './phase-production.component.html',
    styleUrl: './phase-production.component.scss'
})
export class PhaseProductionComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel

	constructor(private gameStateService: GameState){}
	clientPlayerState!: PlayerStateModel;
	_productionCardList: PlayableCardModel[] = []
	_phaseMegacreditProduction!: number
	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateState(state))
		this.updateCardList(this.event as EventPhase)
		let e = this.event as EventPhase
		this._phaseMegacreditProduction = e.productionMegacreditFromPhaseCard??0
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
	getProduction(index: number): number {
		if(index>0){
			return this.clientPlayerState.getRessourceInfoFromId(index)?.valueProd??0
		}
		let megacredit = this.clientPlayerState.getRessourceInfoFromId(0)?.valueProd??0
		megacredit += this.clientPlayerState.getTR() + this._phaseMegacreditProduction
		return megacredit
	}
}
