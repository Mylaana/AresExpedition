import { Injector } from "@angular/core";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { GAME_SELECTABLE_PHASE_LIST } from "../../global/global-const";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model"
import { PlayerPhaseCardStateDTO } from "../../interfaces/dto/player-state-dto.interface";

export class PlayerPhaseCardStateModel {
	private phaseGroups!: PhaseCardGroupModel[] //this.initializePhaseGroups();
	private phaseCardUpgradeCount!: number
	private selectedPhase!: SelectablePhaseEnum

	private phaseService: PhaseCardInfoService

	constructor(private injector: Injector, dto: PlayerPhaseCardStateDTO){
		this.phaseService = this.injector.get(PhaseCardInfoService)
		this.phaseGroups = this.initializePhaseGroups()
		this.selectedPhase = SelectablePhaseEnum.undefined
		//this.phaseGroups = dto.pg
		this.phaseCardUpgradeCount = dto.pcuc
		this.selectedPhase = dto.sp
	}

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

	toJson(): PlayerPhaseCardStateDTO {
		return {
			pg: this.phaseGroups,
			pcuc: this.phaseCardUpgradeCount,
			sp: this.selectedPhase
		}
	}
	static fromJson(data: PlayerPhaseCardStateDTO, injector: Injector): PlayerPhaseCardStateModel {
		if (!data.pg || !data.pcuc || !data.sp){
			throw new Error("Invalid PlayerPhaseCardStateDTO: Missing required fields")
		}
		return new PlayerPhaseCardStateModel(injector, data)
	}
	static empty(injector: Injector): PlayerPhaseCardStateModel {
		return new PlayerPhaseCardStateModel(
			injector,
			{
				pg: [],
				pcuc: 0,
				sp: SelectablePhaseEnum.undefined
			}
		)
	}
}
