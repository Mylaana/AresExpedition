import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { CardState } from '../../../../models/cards/card-cost.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PhaseCardGroupModel, PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { PhaseCardInfoService } from '../../../../services/cards/phase-card-info.service';
import { PhaseCardUpgradeType } from '../../../../types/phase-card.type';


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
export class PhaseCardUpgradeListComponent {
	@Input() phaseIndex!: number;
	@Input() phaseGroup!: PhaseCardGroupModel
	cardInitialState!: CardState
	stateFromParent!: CardState
	@Output() cardUpgraded: EventEmitter<any> = new EventEmitter<any>()

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
		this.phaseCardModels = this.phaseGroup.phaseCards

		this.loaded = true
		this.cardInitialState = {upgradable: this.phaseGroup.getPhaseIsUpgraded()===false}
		this.setState()
	}
	refreshPhaseGroup(): void {
		for(let card of this.phaseCards){
			card.refreshState()
		}
	}
	private setState(): void {
		if(this.loaded===false){return}
		this.stateFromParent = {upgradable: this.phaseGroup.getPhaseIsUpgraded()===false}
	}
	public phaseCardUpgraded(upgradeType: PhaseCardUpgradeType): void {
		this.cardUpgraded.emit()

		this.gameStateService.setClientPhaseCardUpgraded(upgradeType)
		this.setState()
	}
}
