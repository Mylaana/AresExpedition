import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PhaseCardGroupModel, PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { PhaseCardUpgradeType } from '../../../../types/phase-card.type';
import { CardStateModel } from '../../../../models/cards/card-state.model';
import { CardState } from '../../../../interfaces/card.interface';
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
export class PhaseCardUpgradeListComponent {
	@Input() phaseGroup!: PhaseCardGroupModel
	@Input() upgradeFinished: boolean = false
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
	){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.phaseCardLevelList = [0, 1, 2]
		this.phaseCardModels = this.phaseGroup.phaseCards

		this.loaded = true
		this.cardInitialState = Utils.toFullCardState({upgradable: this.canUpgrade()})
		this.setState()
	}
	refreshPhaseGroup(): void {
		for(let card of this.phaseCards){
			card.refreshState()
		}
	}
	setUpgradeFinished(): void {
		this.upgradeFinished = true
		this.stateFromParent = Utils.toFullCardState({upgradable: this.canUpgrade()})
		console.log(this.phaseGroup.phaseIndex, )
	}
	canUpgrade(): boolean {
		if(this.upgradeFinished){return false}
		if(this.phaseGroup.getPhaseIsUpgraded()){return false}
		return true
	}
	private setState(): void {
		if(this.loaded===false){return}
		this.stateFromParent = Utils.toFullCardState({upgradable: this.canUpgrade()})
	}
	public phaseCardUpgraded(upgradeType: PhaseCardUpgradeType): void {
		this.cardUpgraded.emit()

		this.gameStateService.setClientPhaseCardUpgraded(upgradeType)
		this.setState()
	}
}
