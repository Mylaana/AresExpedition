import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { CardState } from '../../../../models/cards/card-cost.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { PhaseCardGroupModel, PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { PhaseCardInfoService } from '../../../../services/cards/phase-card-info.service';
import { Utils } from '../../../../utils/utils';


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
export class PhaseCardUpgradeListComponent implements OnChanges{
	@Input() phaseIndex!: number;
	cardInitialState: CardState = {selectable:false, upgradable:true}
	@Input() upgradeRemaining!: boolean
	@Output() cardUpgraded: EventEmitter<{phaseIndex: number, phaseCardLevel: number}> = new EventEmitter<{phaseIndex: number, phaseCardLevel: number}>()

	private _upgradeRemaining!: boolean

	phaseCardLevelList!: number[];
	phaseCardState: CardState[] = [];
	@ViewChildren('phaseCards') phaseCards!: QueryList<PhaseCardComponent>
	phaseCardModels:PhaseCardModel[] = []

	clientPlayerId!:number;
	clientPlayerPhaseCardGroupState!: PhaseCardGroupModel;

	loaded: boolean = false

	constructor(
		private gameStateService: GameState,
		private phaseCardInfoService: PhaseCardInfoService
	){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.phaseCardLevelList = [0, 1, 2]
		this.setUpdateRemaining(this.upgradeRemaining)

		this.gameStateService.groupPlayerState.subscribe(
			state => this.updateState(state)
		)

		this.phaseCardModels = this.phaseCardInfoService.getPhaseCardFromPhaseIndex(this.phaseIndex)


		this.loaded = true
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['upgradeRemaining'] && changes['upgradeRemaining'].currentValue){
			this.setState()
		}
	}

	setUpdateRemaining(upgradeRemaining:boolean): void {
		this._upgradeRemaining = upgradeRemaining
		this.setState()
	}

	private setState(): void {
		if(this.loaded===false){return}
		if(this._upgradeRemaining){
			this.cardInitialState = {selectable:false, upgradable:true}
		} else {
			this.cardInitialState = {selectable:true, upgradable:false}
		}
	}

	public cardStateChange(card: {cardId: number, state:CardState, stateUpdateType:string}): void {
		let newPhaseCardState : PhaseCardGroupModel = this.clientPlayerPhaseCardGroupState

		newPhaseCardState.setPhaseCardUpgraded(card.cardId)
		newPhaseCardState.setPhaseCardSelection(card.cardId, true)

		if(card.stateUpdateType==='upgrade'){
			this.cardUpgraded.emit({phaseIndex: this.phaseIndex, phaseCardLevel: card.cardId})
		}

		this.gameStateService.setPlayerUpgradedPhaseCardFromPhaseCardGroup(this.clientPlayerId, this.phaseIndex, newPhaseCardState)
		this.setState()
	}
	updateState(state: PlayerStateModel[]): void{
		if(this.phaseCardState.length!=0 && Utils.jsonCopy(state[this.clientPlayerId].phaseCards.phaseGroups[this.phaseIndex]) == Utils.jsonCopy(this.clientPlayerPhaseCardGroupState)){return}
		this.clientPlayerPhaseCardGroupState = state[this.clientPlayerId].phaseCards.phaseGroups[this.phaseIndex]
		this.phaseCardState = this.clientPlayerPhaseCardGroupState.getPhaseCardStateList()
	}
}
