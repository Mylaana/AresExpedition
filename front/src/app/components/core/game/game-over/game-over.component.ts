import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerPannelComponent } from '../../../player-info/player-pannel/player-pannel.component';
import { CommonModule } from '@angular/common';
import { myUUID } from '../../../../types/global.type';
import { PhaseSelectedPlayerPannelComponent } from '../../post-game/phase-selected-player-pannel/phase-selected-player-pannel.component';
import { MilestoneAndAwardComponent } from '../../../player-info/milestone-and-award/milestone-and-award.component';
import { GlobalParameterContributionPannelComponent } from '../../post-game/global-parameter-contribution-pannel/global-parameter-contribution-pannel.component';

@Component({
  selector: 'app-game-over',
  imports: [
	CommonModule,
	PlayerPannelComponent,
	PhaseSelectedPlayerPannelComponent,
	MilestoneAndAwardComponent,
	GlobalParameterContributionPannelComponent,
],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent implements OnInit{
	@Input() gameOver!: boolean
	groupState!: PlayerStateModel[]
	_playerIdList: myUUID[] = []
	_round!: number
	_discoveryEnabled: boolean = false

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentPlayerCount.subscribe(playerCount => this.updatePlayerList(playerCount))
		this.gameStateService.currentGroupPlayerState.subscribe(
			states => this.updateState(states)
		)
		this._discoveryEnabled = this.gameStateService.getGameOptions().discovery
		this.gameStateService.currentRound.subscribe(round => this._round = round)
	}
	updateState(state: PlayerStateModel[]){
		this.groupState = state
	}
	updatePlayerList(playerIdList: myUUID[]){
		this._playerIdList = playerIdList
	}
	isDiscoveryEnabled(): boolean {
		return this.gameStateService.isDiscoveryEnabled()
	}
}
