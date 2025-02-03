import { CardState } from "./card-cost.model";
import { PhaseCardGroupType, PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseGroupType!: PhaseCardGroupType
	phaseCards!: PhaseCardModel[]

	getUpgradedPhaseCard(): PhaseCardModel {
		for(let card of this.phaseCards){
			if(card.phaseCardUpgraded===true){
				return card
			}
		}
		return new PhaseCardModel
	}
	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		for(let card of this.phaseCards){
			if(card.phaseType==upgrade)
				card.setPhaseCardUpgraded()
		}
	}

	getPhaseCardStateList(): CardState[] {
		let stateList: CardState[] = []
		for(let card of this.phaseCards){
			stateList.push(card.getPhaseCardState())
		}
		return stateList
	}
}

export class PhaseCardModel {
	phaseId!:number
	cardLevel!: number
	phaseGroupType!: PhaseCardGroupType
	phaseType!: PhaseCardType
	phaseCardUpgraded!: boolean
	phaseCardSelected!: boolean

	baseDescription!: string
	bonusDescription!: string


	setPhaseCardUpgraded(): void {
		this.phaseCardUpgraded = true
	}

	setPhaseCardSelection(selected: boolean): void {
		this.phaseCardSelected = selected
	}

	getPhaseCardState(): CardState {
		let state: CardState = {}
		state.selected = this.phaseCardSelected
		state.upgraded = this.phaseCardUpgraded
		return state
	}
}

