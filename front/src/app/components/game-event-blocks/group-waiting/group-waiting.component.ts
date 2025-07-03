import { Component, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyModel, PlayerStateModel } from '../../../models/player-info/player-state.model';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../../animations/animations';
import { Subject, takeUntil } from 'rxjs';
import { PlayerInfoStateModel } from '../../../models/player-info/player-state-info.model';

@Component({
  selector: 'app-group-waiting',
  imports: [CommonModule],
  templateUrl: './group-waiting.component.html',
  styleUrl: './group-waiting.component.scss',
  animations: [fadeIn]
})
export class GroupWaitingComponent implements OnInit{
	clientId!: string
	_otherPlayers!: PlayerInfoStateModel[]
	_groupInfo!: PlayerInfoStateModel[]

	private destroy$ = new Subject<void>
	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.clientId = this.gameStateService.getClientState().getId()
		this.setGroupInfo(this.gameStateService.getGroupState())
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe((groupReady) => this.groupReadyUpdate(groupReady))
	}
	private groupReadyUpdate(groupReady : PlayerReadyModel[]){
		if(groupReady.length===0){return}
		this._otherPlayers = []
		for(let p of groupReady){
			if(p.id!=this.clientId && p.isReady){
				this.addOtherPlayerReady(p.id)
			}
		}
	}
	private addOtherPlayerReady(playerId: string){
		for(let i of this._groupInfo){
			if(i.getId()===playerId){
				this._otherPlayers.push(i)
				return
			}
		}
	}
	private setGroupInfo(groupState: PlayerStateModel[]){
		this._groupInfo = []
		for(let s of groupState){
			this._groupInfo.push(s.getInfoState())
		}
	}
}
