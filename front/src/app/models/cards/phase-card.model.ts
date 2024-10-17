import { CardState } from "./card-cost.model";
import { PhaseCardType } from "../../types/phase-card.type";

export class PhaseCardHolderModel {
	phaseGroups: PhaseCardGroupModel[] = [];

	setPhaseCardUpgraded(phaseIndex: number, phaseCardLevel: number): void {
		this.phaseGroups[phaseIndex].setPhaseCardUpgraded(phaseCardLevel)
	}
	setPhaseCardSelection(phaseIndex: number, phaseCardLevel: number, selected: boolean): void {
		this.phaseGroups[phaseIndex].setPhaseCardSelection(phaseCardLevel, selected)
	}
	getSelectedPhaseCards(): PhaseCardModel[] {
		let phaseCards: PhaseCardModel[] = []
		for(let group of this.phaseGroups){
			phaseCards.push(group.getSelectedPhaseCard())
		}
		return phaseCards
	}
}

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseCards: PhaseCardModel[] = [];

	getSelectedPhaseCard(): PhaseCardModel {
		for(let card of this.phaseCards){
			if(card.phaseCardSelected===true){
				return card
			}
		}
		return new PhaseCardModel
	}
	setPhaseCardUpgraded(phaseCardLevel: number): void {
		this.phaseCards[phaseCardLevel].setPhaseCardUpgraded()
	}
	//only one phase card can be selected
	setPhaseCardSelection(phaseCardLevel: number, selected: boolean): void {
		for(let card of this.phaseCards){
			if(card.cardLevel===phaseCardLevel){
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
	phaseId!:number;
	cardLevel!: number;
	phaseType!: PhaseCardType;
	phaseCardUpgraded!: boolean;
	phaseCardSelected!: boolean;

	baseDescription!: string;
	bonusDescription!: string;


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

