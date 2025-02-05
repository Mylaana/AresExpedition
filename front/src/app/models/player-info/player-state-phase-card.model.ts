import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { GAME_SELECTABLE_PHASE_LIST } from "../../global/global-const";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model"

export class PlayerPhaseCardState {
	private phaseGroups: PhaseCardGroupModel[] = this.initializePhaseGroups();
	private phaseCardUpgradeCount: number = 0
	private selectedPhase: SelectablePhaseEnum = SelectablePhaseEnum.undefined

	constructor(private phaseService: PhaseCardInfoService){}

	private initializePhaseGroups(): PhaseCardGroupModel[] {
		let groups: PhaseCardGroupModel[] = []
		for(let groupName of GAME_SELECTABLE_PHASE_LIST){
			groups.push(this.phaseService.getNewPhaseGroup(groupName))
		}
		return groups
	}

	getPhaseCardUpgradedCount(): number { return this.phaseCardUpgradeCount }
	addPhaseCardUpgradeCount(): void { this.phaseCardUpgradeCount++ }
	getPhaseSelected(): SelectablePhaseEnum { return this.selectedPhase }
	setPhaseSelected(selection: SelectablePhaseEnum): void {this.selectedPhase = selection}
	getUpgradedPhaseCards(): PhaseCardModel[] {
		let cards: PhaseCardModel[] = []
		for(let group of this.phaseGroups){
			cards.push(group.getUpgradedPhaseCard())
		}
		return cards
	}
	getPhaseGroups(): PhaseCardGroupModel[]{ return this.phaseGroups}

	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		let phase: SelectablePhaseEnum = Utils.getSelectablePhaseFromPhaseUpgrade(upgrade)
		if(!phase){return}

		for(let g of this.phaseGroups){
			if(g.phaseGroup===phase){
				g.setPhaseCardUpgraded(upgrade)
				return
			}
		}
	}
}
