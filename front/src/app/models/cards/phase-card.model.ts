import { PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { CardState } from "../../interfaces/card.interface";

export class PhaseCardGroupModel {
	phaseIndex!: number;
	phaseGroup!: SelectablePhaseEnum
	phaseCards: PhaseCardModel[] = []
	phaseIsUpgraded: boolean = false

	getPhaseCard(onlyUpgraded: boolean = false): PhaseCardModel {
		for(let card of this.phaseCards){
			if(onlyUpgraded===false){return card}
			if(card.phaseCardUpgraded===true){return card}
			if(!this.phaseIsUpgraded){return card}
		}
		return new PhaseCardModel
	}
	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		//if(this.phaseIsUpgraded){return}
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
	title!: string

	baseDescription!: string
	bonusDescription!: string


	setPhaseCardUpgraded(upgraded: boolean): void {
		this.phaseCardUpgraded = upgraded
	}

	getPhaseCardState(): CardState {
		let state: CardState
		state = {
			selectable: false,
			selected: false,
			upgradable: false,
			upgraded: this.phaseCardUpgraded,
			//buildable: false,
			activable: false,
			ignoreCost: false
		}
		return state
	}
}

