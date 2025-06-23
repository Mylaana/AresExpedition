import { Injector } from "@angular/core";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { GAME_SELECTABLE_PHASE_LIST } from "../../global/global-const";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model"
import { PhaseCardDTO, PlayerPhaseCardStateDTO } from "../../interfaces/dto/player-state-dto.interface";

export class PlayerPhaseCardStateModel {
	private phaseGroups!: PhaseCardGroupModel[]
	private phaseCardUpgradeCount: number = 0
	private selectedPhase!: SelectablePhaseEnum
	private previousSelectedPhase!: SelectablePhaseEnum

	private phaseService: PhaseCardInfoService

	constructor(private injector: Injector, dto: PlayerPhaseCardStateDTO, instantiateEmpty: boolean = false){
		this.phaseService = this.injector.get(PhaseCardInfoService)

		if(instantiateEmpty){
			this.phaseGroups = []
			this.selectedPhase = SelectablePhaseEnum.undefined
			this.previousSelectedPhase = SelectablePhaseEnum.undefined
			return
		}

		this.selectedPhase = dto.sp
		this.previousSelectedPhase = dto.psp
		this.phaseGroups = this.phaseGroupFromJson(dto.pc)
	}

	getPhaseCardUpgradedCount(): number { return this.phaseCardUpgradeCount}
	refreshPhaseCardUpgradeCount(): void {
		let upgraded: number = 0
		for(let g of this.phaseGroups){
			if(g.getPhaseIsUpgraded()){
				upgraded++
			}
		}
		this.phaseCardUpgradeCount = upgraded
	}
	getPhaseSelected(): SelectablePhaseEnum { return this.selectedPhase}
	setPhaseSelected(selection: SelectablePhaseEnum): void {this.selectedPhase = selection}
	getPreviousPhaseSelected(): SelectablePhaseEnum { return this.previousSelectedPhase}
	setPreviousPhaseSelected(selection: SelectablePhaseEnum): void {console.trace('set PREVIOUS phase selected',selection); this.previousSelectedPhase = selection}
	getPhaseCards(onlyUpgraded: boolean):  PhaseCardModel[] {
		let cards: PhaseCardModel[] = []
		for(let group of this.phaseGroups){
			cards.push(group.getPhaseCard(onlyUpgraded))
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
			pc: this.phaseGroupToJson(this.phaseGroups),
			sp: this.selectedPhase,
			psp: this.previousSelectedPhase
		}
	}
	newGame(): void {
		for(let groupName of GAME_SELECTABLE_PHASE_LIST){
			this.phaseGroups.push(this.phaseService.getNewPhaseGroup(groupName))
		}
	}
	static fromJson(data: PlayerPhaseCardStateDTO, injector: Injector): PlayerPhaseCardStateModel {
		if (!data.pc || !data.sp || !data.psp){
			throw new Error("Invalid PlayerPhaseCardStateDTO: Missing required fields")
		}
		return new PlayerPhaseCardStateModel(injector, data)
	}

	private phaseGroupToJson(phaseGroups: PhaseCardGroupModel[]): PhaseCardDTO[] {
		//converts only upgraded cards
		let phaseCards: PhaseCardDTO[] = []

		for(let group of phaseGroups){
			for(let card of group.phaseCards){
				if(card.phaseCardUpgraded){
					phaseCards.push({cl: card.cardLevel, pi: card.phaseId})
					break
				}
			}
		}

		return phaseCards
	}

	private phaseGroupFromJson(phaseCards: PhaseCardDTO[]): PhaseCardGroupModel[] {
		let groups: PhaseCardGroupModel[] = []
		for(let groupName of GAME_SELECTABLE_PHASE_LIST){
			groups.push(this.phaseService.getNewPhaseGroup(groupName))
		}


		//load upgraded from dto
		for(let card of phaseCards) {
			groups[card.pi].phaseCards[card.cl].setPhaseCardUpgraded(true)
			if(card.cl!=0){
				groups[card.pi].phaseIsUpgraded = true
				this.phaseCardUpgradeCount += 1
			}
		}

		return groups
	}

	static empty(injector: Injector): PlayerPhaseCardStateModel {
		return new PlayerPhaseCardStateModel(
			injector,
			{
				pc: [],
				sp: SelectablePhaseEnum.undefined,
				psp: SelectablePhaseEnum.undefined
			},
			true
		)
	}
}
