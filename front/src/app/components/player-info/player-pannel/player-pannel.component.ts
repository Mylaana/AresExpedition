import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameState } from '../../../services/core-game/game-state.service';
import { GlobalPannelComponent } from '../global-pannel/global-pannel.component';
import { RessourcePannelComponent } from '../ressource-pannel/ressource-pannel.component';
import { TagPannelComponent } from '../tag-pannel/tag-pannel.component';
import { expandCollapseVertical } from '../../../animations/animations';
import { Subject, takeUntil } from 'rxjs';
import { myUUID } from '../../../types/global.type';

@Component({
    selector: 'app-player-pannel',
    imports: [
        CommonModule,
        RessourcePannelComponent,
        TagPannelComponent,
        GlobalPannelComponent
    ],
    templateUrl: './player-pannel.component.html',
    styleUrl: './player-pannel.component.scss',
    animations: [expandCollapseVertical]
})
export class PlayerPannelComponent implements OnInit, OnDestroy{
	@Input() playerId!: myUUID;

	playerState!: PlayerStateModel;
	playerIsReady!: boolean;
	playerName!: string;
	playerPhase!: PlayerPhase;
	currentPhase!: NonSelectablePhaseEnum;

	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(playersState => this.updatePlayerState())
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(playersReady => this.updatePlayerReady())
		this.gameStateService.currentGroupPlayerSelectedPhase.pipe(takeUntil(this.destroy$)).subscribe(playerPhase => this.updatePlayerPhase(playerPhase))
		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(phase => this.currentPhase = phase)
		this.updatePlayerState()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
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
