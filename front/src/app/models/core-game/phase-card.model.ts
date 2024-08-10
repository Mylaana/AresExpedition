import { PhaseCardType } from "../../types/phase-card.type";

export class PhaseCardHolderModel {
	phaseGroup: PhaseCardGroupModel[] = [];

	setPhaseCardUpgraded(phaseIndex: number, phaseCardLevel: number): void {
		this.phaseGroup[phaseIndex].phaseCards[phaseCardLevel].phaseCardUpgraded = true
	}
	setPhaseCardSelection(phaseIndex: number, phaseCardLevel: number, selected: boolean): void {
		this.phaseGroup[phaseIndex].phaseCards[phaseCardLevel].phaseCardSelected = selected
	}
}

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseCards: PhaseCardModel[] = [];
}

export class PhaseCardModel {
	phaseCardLevel!: number;
	phaseType!: PhaseCardType;
	phaseCardUpgraded!: boolean;
	phaseCardSelected!: boolean;
}
