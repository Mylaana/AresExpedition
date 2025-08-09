import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerPannelComponent } from '../../../player-info/player-pannel/player-pannel.component';
import { CommonModule } from '@angular/common';
import { myUUID } from '../../../../types/global.type';
import { PhaseSelectedPlayerPannelComponent } from '../../post-game/phase-selected-player-pannel/phase-selected-player-pannel.component';
import { MilestoneAndAwardComponent } from '../../../player-info/milestone-and-award/milestone-and-award.component';

@Component({
  selector: 'app-game-over',
  imports: [
	CommonModule,
	PlayerPannelComponent,
	PhaseSelectedPlayerPannelComponent,
	MilestoneAndAwardComponent
],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent implements OnInit{
	@Input() gameOver!: boolean
	groupState!: PlayerStateModel[]
	_playerIdList: myUUID[] = []

	_discoveryEnabled: boolean = false

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentPlayerCount.subscribe(playerCount => this.updatePlayerList(playerCount))
		this.gameStateService.currentGroupPlayerState.subscribe(
			states => this.updateState(states)
		)
		this._discoveryEnabled = false
	}
	updateState(state: PlayerStateModel[]){
		this.groupState = state
		console.log(this.groupState)
	}
	updatePlayerList(playerIdList: myUUID[]){
		this._playerIdList = playerIdList
	}
}
