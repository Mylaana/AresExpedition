import { CardState } from "../../interfaces/global.interface";
import { PhaseCardType } from "../../types/phase-card.type";

export class PhaseCardHolderModel {
	phaseGroup: PhaseCardGroupModel[] = [];

	setPhaseCardUpgraded(phaseIndex: number, phaseCardLevel: number): void {
		this.phaseGroup[phaseIndex].setPhaseCardUpgraded(phaseCardLevel)
	}
	setPhaseCardSelection(phaseIndex: number, phaseCardLevel: number, selected: boolean): void {
		this.phaseGroup[phaseIndex].setPhaseCardSelection(phaseCardLevel, selected)
	}
}

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseCards: PhaseCardModel[] = [];

	setPhaseCardUpgraded(phaseCardLevel: number): void {
		this.phaseCards[phaseCardLevel].setPhaseCardUpgraded()
	}

	//only one phase card can be selected
	setPhaseCardSelection(phaseCardLevel: number, selected: boolean): void {
		for(let card of this.phaseCards){
			if(card.phaseCardLevel===phaseCardLevel){
				card.setPhaseCardSelection(selected)
			} else {
				card.setPhaseCardSelection(false)
			}
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
	phaseCardLevel!: number;
	phaseType!: PhaseCardType;
	phaseCardUpgraded!: boolean;
	phaseCardSelected!: boolean;


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

