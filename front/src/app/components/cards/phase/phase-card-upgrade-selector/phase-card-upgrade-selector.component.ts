import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';

@Component({
  selector: 'app-phase-card-upgrade-selector',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardUpgradeListComponent
],
  templateUrl: './phase-card-upgrade-selector.component.html',
  styleUrl: './phase-card-upgrade-selector.component.scss'
})
export class PhaseCardUpgradeSelectorComponent {
	@Input() phaseList!: number[]

	cardInitialState: CardState = {selectable: false, upgradable: true};
	clientPlayerId!: number
	upgradeNumber: number = 0

	constructor(private gameStateService: GameState){}

	ngOnInit():void{
		if(this.phaseList===null){this.phaseList= [0,1,2,3,4]}
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.gameStateService.currentGroupPlayerState.subscribe(
			state => this.upgradeNumberUpdate(state)
		)
	}

	public cardUpgraded(phaseCard: {phaseIndex: number, phaseCardLevel: number}): void {
		this.gameStateService.removePhaseCardUpgradeNumber(this.clientPlayerId)
	}

	upgradeNumberUpdate(state: PlayerStateModel[]):void{
		if(state[this.clientPlayerId].phaseCardUpgradeNumber!=this.upgradeNumber){
			this.upgradeNumber = state[this.clientPlayerId].phaseCardUpgradeNumber
		}

		if(this.upgradeNumber===0){
			this.cardInitialState.selectable = true
			this.cardInitialState.upgradable = false
		}
	}
}
