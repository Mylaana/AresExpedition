import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../../cards/phase-card/phase-card.component';
import { CardState } from '../../../interfaces/global.interface';
import { CardOptions } from '../../../interfaces/global.interface';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PhaseCardGroupModel, PhaseCardHolderModel } from '../../../models/core-game/phase-card.model';
import { deepCopy } from '../../../functions/global.functions';

@Component({
  selector: 'app-phase-card-upgrade-list',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardComponent
],
  templateUrl: './phase-card-upgrade-list.component.html',
  styleUrl: './phase-card-upgrade-list.component.scss'
})
export class PhaseCardUpgradeListComponent{
	@Input() phaseIndex!: number;
	@Input() cardOptions!: CardOptions;
	@Output() cardUpgraded: EventEmitter<{phaseIndex: number, phaseCardLevel: number}> = new EventEmitter<{phaseIndex: number, phaseCardLevel: number}>()

	phaseCardLevelList!: number[];
	phaseCardState: CardState[] = [];

	clientPlayerId!:number;
	clientPlayerPhaseCardGroupState!: PhaseCardGroupModel;

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.phaseCardLevelList = [0, 1, 2]

		this.gameStateService.groupPlayerState.subscribe(
			state => this.updateState(state)
		)
	}

	public cardStateChange(card: {cardId: number, state:CardState, stateUpdateType:string}): void {
		let newPhaseCardState : PhaseCardGroupModel = this.clientPlayerPhaseCardGroupState

		newPhaseCardState.setPhaseCardUpgraded(card.cardId)
		newPhaseCardState.setPhaseCardSelection(card.cardId, true)

		if(card.stateUpdateType==='upgrade'){
			this.cardUpgraded.emit({phaseIndex: this.phaseIndex, phaseCardLevel: card.cardId})
		}

		this.gameStateService.setPlayerUpgradedPhaseCardFromPhaseCardGroup(this.clientPlayerId, this.phaseIndex, newPhaseCardState)
	}
	updateState(state: PlayerStateModel[]): void{
		if(this.phaseCardState.length!=0 && deepCopy(state[this.clientPlayerId].phaseCard.phaseGroup[this.phaseIndex]) == deepCopy(this.clientPlayerPhaseCardGroupState)){return}
		if(this.phaseCardState.length!=0){
		}
		this.clientPlayerPhaseCardGroupState = state[this.clientPlayerId].phaseCard.phaseGroup[this.phaseIndex]
		this.phaseCardState = this.clientPlayerPhaseCardGroupState.getPhaseCardStateList()
	}
}
