import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { EventBaseModel, EventPhase } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';

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

	constructor(
		private gameStateService: GameStateFacadeService,
		private cardInfoService: ProjectCardInfoService
	){}
	clientPlayerState!: PlayerStateModel;
	_productionCardList: PlayableCardModel[] = []
	_phaseMegacreditProduction!: number
	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateState(state))
		this.gameStateService.currentCardProduction.pipe(takeUntil(this.destroy$)).subscribe(cards => this._productionCardList =  this.cardInfoService.getProjectCardList(cards))

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
	/*
	updateCardList(event: EventPhase){
		this._productionCardList = event.productionCardList??[]
	}*/
	getProduction(index: number): number {
		if(index>0){
			return this.clientPlayerState.getRessourceInfoFromId(index)?.valueProd??0
		}
		let megacredit = this.clientPlayerState.getRessourceInfoFromId(0)?.valueProd??0
		megacredit += this.clientPlayerState.getTR() + this._phaseMegacreditProduction
		return megacredit
	}
}
