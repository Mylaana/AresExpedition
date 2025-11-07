import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { CommonModule } from '@angular/common';
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from '../../../enum/phase.enum';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameState } from '../../../services/game-state/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { RGB, SettingInterfaceSize } from '../../../types/global.type';

interface PlayerPhaseSelection {
	color: RGB
	phaseSelected: SelectablePhaseEnum
	self: boolean
}

@Component({
  selector: 'app-left-pannel',
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './left-pannel.component.html',
  styleUrl: './left-pannel.component.scss'
})
export class LeftPannelComponent implements OnInit, OnDestroy{
	@Input() selectedPhaseList!: SelectablePhaseEnum[]
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() interfaceSize!: SettingInterfaceSize

	groupState!: PlayerStateModel[]
	phaseSelection!: PlayerPhaseSelection[]
	destroy$ = new Subject<void>
	_clientId!: string

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		//this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe((group) => this.updateGroupState(group))
		this._clientId =  this.gameStateService.getClientState().getId()
		this.updateGroupState(this.gameStateService.getGroupState())
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateGroupState(group: PlayerStateModel[]){
		if(!group){return}
		this.groupState = group
		this.phaseSelection = []
		for(let p of this.groupState){
			this.phaseSelection.push(
				{
					color: p.getColor(),
					phaseSelected: p.getPhaseSelected(),
					self: p.getId()===this._clientId
				}
			)
		}
	}
	getSelected(phase: SelectablePhaseEnum): PlayerPhaseSelection[] {
		let result: PlayerPhaseSelection [] = []
		for(let p of this.phaseSelection){
			if(p.phaseSelected===phase){
				result.push(p)
			}
		}
		return result
	}
	isCurrentPhase(phase: SelectablePhaseEnum): boolean {
		return this.currentPhase.toString()===phase.toString()
	}
}
