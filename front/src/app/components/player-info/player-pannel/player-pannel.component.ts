import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { PlayerReadyModel, PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { GlobalPannelComponent } from '../global-pannel/global-pannel.component';
import { RessourcePannelComponent } from '../ressource-pannel/ressource-pannel.component';
import { TagPannelComponent } from '../tag-pannel/tag-pannel.component';
import { expandCollapseVertical } from '../../../animations/animations';
import { Subject, takeUntil } from 'rxjs';
import { myUUID, SettingPlayerPannelSize } from '../../../types/global.type';
import { GameParamService } from '../../../services/core-game/game-param.service';

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
	@Input() gameOver!: boolean;

	_playerState!: PlayerStateModel;
	playerIsReady!: boolean;
	playerName!: string;
	playerPhase!: PlayerPhase;
	currentPhase!: NonSelectablePhaseEnum;

	private isClient: boolean = this.gameStateService.isClient(this.playerId)
	private destroy$ = new Subject<void>()
	_pannelSize!: SettingPlayerPannelSize
	constructor(
		private gameStateService: GameStateFacadeService,
		private gameParam: GameParamService
	){}

	ngOnInit(){
		this.gameParam.currentPlayerPannelSize.subscribe(size => this._pannelSize = size)
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateClientState(state))
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updatePlayerState(state))
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(ready => this.updatePlayerReady(ready))
		this.gameStateService.currentGroupPlayerSelectedPhase.pipe(takeUntil(this.destroy$)).subscribe(playerPhase => this.updatePlayerPhase(playerPhase))
		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(phase => this.currentPhase = phase)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateClientState(clientState: PlayerStateModel){
		this._playerState = clientState
		this.playerName = this._playerState.getName()
	}
	updatePlayerState(groupstate: PlayerStateModel[]): void {
		if(this.isClient){return}
		for(let state of groupstate){
			if(state.getId()===this.playerId){
				this._playerState = state
				this.playerName = this._playerState.getName()
				return
			}
		}
	}
	updatePlayerReady(groupReady: PlayerReadyModel[]) : void {
		for(let ready of groupReady){
			if(ready.id===this.playerId){
				this.playerIsReady = ready.isReady
				return
			}
		}
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
