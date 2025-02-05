import { CardState } from "./card-cost.model";
import { PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { SelectablePhaseEnum } from "../../enum/phase.enum";

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseGroup!: SelectablePhaseEnum
	phaseCards: PhaseCardModel[] = []
	private phaseIsUpgraded: boolean = false

	getUpgradedPhaseCard(): PhaseCardModel {
		for(let card of this.phaseCards){
			if(card.phaseCardUpgraded===true){
				return card
			}
		}
		return new PhaseCardModel
	}
	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		if(this.phaseIsUpgraded){return}
		for(let card of this.phaseCards){
			card.setPhaseCardUpgraded(card.phaseType==upgrade)
		}
		this.phaseIsUpgraded = true
	}
	getPhaseCardStateList(): CardState[] {
		let stateList: CardState[] = []
		for(let card of this.phaseCards){
			stateList.push(card.getPhaseCardState())
		}
		return stateList
	}
	getPhaseIsUpgraded(): boolean {return this.phaseIsUpgraded}
}

export class PhaseCardModel {
	phaseId!:number
	cardLevel!: number
	phaseGroup!: SelectablePhaseEnum
	phaseType!: PhaseCardType
	phaseCardUpgraded!: boolean

	baseDescription!: string
	bonusDescription!: string


	setPhaseCardUpgraded(upgraded: boolean): void {
		this.phaseCardUpgraded = upgraded
	}

	getPhaseCardState(): CardState {
		let state: CardState = {}
		state.upgraded = this.phaseCardUpgraded
		return state
	}
}

