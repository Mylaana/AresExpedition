import { Component, OnDestroy, OnInit } from '@angular/core';
import { AwardPannelComponent } from '../award-pannel/award-pannel.component';
import { MilestonePannelComponent } from '../milestone-pannel/milestone-pannel.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { AwardsEnum, MilestonesEnum } from '../../../enum/global.enum';
import { Subject, take, takeUntil } from 'rxjs';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { AwardCard, ClaimedMilestoneCard, MilestoneCard } from '../../../interfaces/global.interface';
import { MilestoneAwardService } from '../../../services/core-game/milestone-award.service';

@Component({
  selector: 'app-milestone-and-award',
  imports: [
	AwardPannelComponent,
	MilestonePannelComponent
  ],
  templateUrl: './milestone-and-award.component.html',
  styleUrl: './milestone-and-award.component.scss'
})
export class MilestoneAndAwardComponent implements OnInit, OnDestroy{
	_awards!: AwardsEnum[]
	destroy$ = new Subject<void>
	_groupState!: PlayerStateModel[]

	constructor(
		private gameState: GameState,
		private milestoneAwardService: MilestoneAwardService
	){}

	ngOnInit(): void {
		this.gameState.currentAwards.pipe(takeUntil(this.destroy$)).subscribe(v => this._awards=v)
		this.gameState.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(state => this._groupState = state)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	getMilestoneCard(): MilestoneCard[]{
		return this.milestoneAwardService.getMilestoneCards()
	}
	getAwardCard(): AwardCard[]{
		return this.milestoneAwardService.getAwardsCards()
	}
	getClaimedMilestoneCard(): ClaimedMilestoneCard[]{
		return this.milestoneAwardService.getClaimedMilestoneStatus()
	}
}
