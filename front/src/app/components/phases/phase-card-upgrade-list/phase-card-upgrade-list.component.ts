import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../../cards/phase-card/phase-card.component';
import { CardState } from '../../../types/project-card.type';
import { CardOptions } from '../../../interfaces/global.interface';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PhaseCardHolderModel } from '../../../models/core-game/phase-card.model';

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

	phaseCardIndexList!: number[];
	phaseCardState = new Map<number, CardState>();

	clientPlayerId!:number;
	clientPlayerPhaseCardState!: PhaseCardHolderModel;

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.phaseCardIndexList = [0, 1, 2]
		let state: CardState = 'upgraded'
		for(let i in this.phaseCardIndexList){
			if(Number(i)>0){
				state='default'
			}
			this.phaseCardState.set(Number(i), state)
		}

		this.gameStateService.groupPlayerState.subscribe(
			state => this.updateState(state)
		)
	}

	public cardStateChange(card: {cardId: number, state:CardState}): void {
		let newPhaseCardState : PhaseCardHolderModel = this.clientPlayerPhaseCardState

		for(let i=0; i<this.phaseCardIndexList.length; i++){
			if(this.phaseCardIndexList[i]===card.cardId){
				this.phaseCardState.set(i, 'upgraded')
				continue
			}
			this.phaseCardState.set(i, 'default')
		}

		newPhaseCardState.setPhaseCardUpgraded(this.phaseIndex, card.cardId)
		newPhaseCardState.setPhaseCardSelection(this.phaseIndex, card.cardId, true)

		this.cardUpgraded.emit({phaseIndex: this.phaseIndex, phaseCardLevel: card.cardId})
		this.gameStateService.setPlayerUpgradedPhaseCard(this.clientPlayerId, newPhaseCardState)
	}
	getCardStateFromIndex(index:number): CardState {
		let state = this.phaseCardState.get(index)
		if(!state){
			return 'default'
		}
		return state
	}
	updateState(state: PlayerStateModel[]): void{
		if(state[this.clientPlayerId].phaseCard === this.clientPlayerPhaseCardState){return}
		this.clientPlayerPhaseCardState = state[this.clientPlayerId].phaseCard
	}
}
