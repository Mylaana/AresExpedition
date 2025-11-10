import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { Subject, takeUntil } from 'rxjs';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { PlayerReadyModel, PlayerStateModel } from '../../../models/player-info/player-state.model';
import { fadeIn } from '../../../animations/animations';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayerNameComponent } from '../../player-info/player-name/player-name.component';
import { PlayerInfoStateModel } from '../../../models/player-info/player-state-info.model';
import { GameActiveContentService } from '../../../services/core-game/game-active-content.service';

@Component({
    selector: 'app-waiting-ready',
    imports: [
        CommonModule,
		PlayableCardListComponent,
		PlayerNameComponent
    ],
    templateUrl: './waiting-ready.component.html',
    styleUrl: './waiting-ready.component.scss',
    animations: [fadeIn]
})
export class WaitingReadyComponent implements OnInit{
	@Input() event!: EventBaseModel
	_waitingCorporationList!:PlayableCardModel[]
	private maxCorporations: number = 0

	private destroy$ = new Subject<void>()
	_groupPlayerReady: PlayerReadyModel[] = []
	_groupInfo!: PlayerInfoStateModel[]

	constructor(
		private gameStateService: GameStateFacadeService,
		private gameContentService: GameActiveContentService
	){}

	ngOnInit(): void {
		this.setGroupInfo(this.gameStateService.getGroupState())
		this.maxCorporations = this.gameContentService.isContentActive('modeMerger')?2:1
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(ready => this.onGroupReadyUpdate(ready))
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateWaitingCorporationList(state))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onGroupReadyUpdate(groupReady: PlayerReadyModel[]): void {
		this._groupPlayerReady = groupReady
	}
	updateWaitingCorporationList(state: PlayerStateModel){
		let corporations = state.getPlayedCorporations()
		if(corporations.length>=this.maxCorporations){
			this._waitingCorporationList = []
			return
		}
		this._waitingCorporationList = this.gameStateService.getClientHandCorporationModelList()
	}
	private setGroupInfo(groupState: PlayerStateModel[]){
		this._groupInfo = []
		for(let s of groupState){
			this._groupInfo.push(s.getInfoState())
		}
	}
	isReady(playerName: string): boolean {
		for(let p of this._groupPlayerReady){
			if(p.name===playerName){return p.isReady}
		}
		return false
	}
}
