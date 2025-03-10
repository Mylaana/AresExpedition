import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameState } from '../../../services/core-game/game-state.service';
import { GlobalPannelComponent } from '../global-pannel/global-pannel.component';
import { RessourcePannelComponent } from '../ressource-pannel/ressource-pannel.component';
import { TagPannelComponent } from '../tag-pannel/tag-pannel.component';
import { expandCollapseVertical } from '../../animations/animations';

@Component({
	selector: 'app-player-pannel',
	standalone: true,
	imports: [
		CommonModule,
		RessourcePannelComponent,
		TagPannelComponent,
		GlobalPannelComponent
	],
	templateUrl: './player-pannel.component.html',
	styleUrl: './player-pannel.component.scss',
	animations: [expandCollapseVertical],
})
export class PlayerPannelComponent implements OnInit{
	@Input() playerId!: number;

	playerState!: PlayerStateModel;
	playerIsReady!: boolean;
	playerName!: string;
	playerPhase!: PlayerPhase;
	currentPhase!: NonSelectablePhaseEnum;

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		this.gameStateService.currentGroupPlayerState.subscribe(
			playersState => this.updatePlayerState()
		)
		this.gameStateService.currentGroupPlayerReady.subscribe(
			playersReady => this.updatePlayerReady()
		)
		this.gameStateService.currentGroupPlayerSelectedPhase.subscribe(
			playerPhase => this.updatePlayerPhase(playerPhase)
		)
		this.gameStateService.currentPhase.subscribe(
			phase => this.currentPhase = phase
		)
		this.updatePlayerState()
	}
	updatePlayerState(): void {
		var checkPlayerState = this.gameStateService.getPlayerStateFromId(this.playerId)
		if(checkPlayerState === undefined){
			return
		}
		//updates this component's player state if changed
		if(checkPlayerState != this.playerState){
			this.playerState = checkPlayerState
			this.playerName = checkPlayerState.getName()
		}
	}
	updatePlayerReady() : void {
		this.playerIsReady = this.gameStateService.getPlayerReady(this.playerId)
	}
	updatePlayerPhase(playerPhase: PlayerPhase[]): void {
		for(let phase of playerPhase){
			if(phase.playerId===this.playerId){
				this.playerPhase = phase
				break
			}
		}
	}
}
