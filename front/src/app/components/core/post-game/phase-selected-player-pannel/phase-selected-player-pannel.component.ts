import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { SelectablePhaseEnum } from '../../../../enum/phase.enum';
import { PlayerStatStateModel } from '../../../../models/player-info/player-state-stat';
import { CommonModule } from '@angular/common';
import { PlayerNameComponent } from '../../../player-info/player-name/player-name.component';
import { PlayerColor } from '../../../../types/global.type';

@Component({
  selector: 'app-phase-selected-player-pannel',
  imports: [
	CommonModule,
	PlayerNameComponent
],
  templateUrl: './phase-selected-player-pannel.component.html',
  styleUrl: './phase-selected-player-pannel.component.scss'
})
export class PhaseSelectedPlayerPannelComponent implements OnInit{
	@Input() state!: PlayerStateModel

	private statState!: PlayerStatStateModel
	private selectedPhases: Map<number, SelectablePhaseEnum> = new Map()
	totalRounds!: number[]
	ngOnInit(): void {
		this.statState = this.state.getStatState()
		this.selectedPhases = this.statState.getSelectedPhaseOnRound()
		this.totalRounds = Array.from(new Array(this.selectedPhases.size), (x,i) => i+1)
	}
	getSelectedPhaseFromIndexAsSring(index: number): string {
		return (this.selectedPhases.get(index)?.toString().toLocaleLowerCase()??"")
	}
}
