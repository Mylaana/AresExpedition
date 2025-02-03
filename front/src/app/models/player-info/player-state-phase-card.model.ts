import { GAME_PHASE_GROUP_LIST } from "../../global/global-const";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { PhaseCardGroupType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model"

export class PlayerPhaseCardState {
	private phaseGroups: PhaseCardGroupModel[] = this.initializePhaseGroups();
	private phaseCardUpgradeCount: number = 0
	private selectedPhase: PhaseCardGroupType | undefined

	constructor(private phaseService: PhaseCardInfoService){}

	private initializePhaseGroups(): PhaseCardGroupModel[] {
		let groups: PhaseCardGroupModel[] = []
		for(let groupName of GAME_PHASE_GROUP_LIST){
			groups.push(this.phaseService.getNewPhaseGroup(groupName))
		}
		return groups
	}

	getPhaseCardUpgradedCount(): number { return this.phaseCardUpgradeCount }
	addPhaseCardUpgradeCount(): void { this.phaseCardUpgradeCount++ }
	getSelectedPhase(): PhaseCardGroupType | undefined { return this.selectedPhase }
	getUpgradedPhaseCards(): PhaseCardModel[] {
		let cards: PhaseCardModel[] = []
		for(let group of this.phaseGroups){
			cards.push(group.getUpgradedPhaseCard())
		}
		return cards
	}

	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		let phase:PhaseCardGroupType | undefined = Utils.getPhaseGroupFromPhaseUpgrade(upgrade)
		if(!phase){return}

		for(let g of this.phaseGroups){
			if(g.phaseGroupType===phase){
				g.setPhaseCardUpgraded(upgrade)
				return
			}
		}
	}

	/*
	setPhaseCardSelection(phaseIndex: number, phaseCardLevel: number, selected: boolean): void {
		this.phaseGroups[phaseIndex].setPhaseCardSelection(phaseCardLevel, selected)
	}*/
	/*
	getSelectedPhaseCards(): PhaseCardModel[] {
		let phaseCards: PhaseCardModel[] = []
		for(let group of this.phaseGroups){
			phaseCards.push(group.getSelectedPhaseCard())
		}
		return phaseCards
	}
	*/
}
