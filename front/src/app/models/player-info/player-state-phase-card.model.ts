import { Injector } from "@angular/core";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { GAME_SELECTABLE_PHASE_LIST } from "../../global/global-const";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model"
import { PhaseCardDTO, PlayerPhaseCardStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { RessourceStock } from "../../interfaces/global.interface";

export class PlayerPhaseCardStateModel {
	private phaseGroups!: PhaseCardGroupModel[]
	private phaseCardUpgradeCount: number = 0
	private selectedPhase!: SelectablePhaseEnum
	private previousSelectedPhase!: SelectablePhaseEnum

	private constructionBonusCollected!: boolean
	private actionBonusCollected!: boolean
	private productionCollected!: boolean
	private researchBonusCollected!: boolean

	private secondProductionCollected!: boolean

	private resourcesProducedThisRound: RessourceStock[] = []
	private cardsProducedThisRound: string[] = []
	
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
		
		//load bonus collected from json
		this.constructionBonusCollected = dto.cbc
		this.actionBonusCollected = dto.abc
		this.productionCollected = dto.fpc
		this.secondProductionCollected = dto.spc
		this.researchBonusCollected = dto.rbc

		this.cardsProducedThisRound = dto.pcl
		this.resourcesProducedThisRound = dto.pr
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
	resetAllPhaseActivationBonusCollected() {
		this.setPhaseBonusCollected(SelectablePhaseEnum.development, false)
		this.setPhaseBonusCollected(SelectablePhaseEnum.construction, false)
		this.setPhaseBonusCollected(SelectablePhaseEnum.action, false)
		this.setPhaseBonusCollected(SelectablePhaseEnum.production, false)
		this.setPhaseBonusCollected('secondProduction', false)
		this.setPhaseBonusCollected(SelectablePhaseEnum.research, false)

		this.cardsProducedThisRound = []
		this.resourcesProducedThisRound = []
	}
	getPhaseBonusCollected(phase: SelectablePhaseEnum | 'secondProduction'): boolean {
		switch(phase){
			case(SelectablePhaseEnum.construction):{
				return this.constructionBonusCollected 
			}
			case(SelectablePhaseEnum.action):{
				return this.actionBonusCollected 
			}
			case(SelectablePhaseEnum.production):{
				return this.productionCollected 
			}
			case(SelectablePhaseEnum.research):{
				return this.researchBonusCollected
			}
			case('secondProduction'):{
				return this.secondProductionCollected
			}
			default:{return true}
		}
	}
	setPhaseBonusCollected(phase: SelectablePhaseEnum | 'secondProduction', collected: boolean){
		switch(phase){
			case(SelectablePhaseEnum.construction):{
				this.constructionBonusCollected = collected
				return
			}
			case(SelectablePhaseEnum.action):{
				this.actionBonusCollected = collected
				return
			}
			case(SelectablePhaseEnum.production):{
				this.productionCollected = collected
				return
			}
			case(SelectablePhaseEnum.research):{
				this.researchBonusCollected = collected
				return
			}
			case('secondProduction'):{
				this.secondProductionCollected = collected
				return
			}
		}
	}
	addProductionResourcesObtainedThisRound(ressources: RessourceStock[]){

	}
	addProductionCardsObtainedThisRound(resources: string[]){
		this.cardsProducedThisRound = this.cardsProducedThisRound.concat(resources)
	}
	getProductionCardsObtainedThisRound(): string[] {
		return this.cardsProducedThisRound
	}
	toJson(): PlayerPhaseCardStateDTO {
		return {
			pc: this.phaseGroupToJson(this.phaseGroups),
			sp: this.selectedPhase,
			psp: this.previousSelectedPhase,
			cbc: this.constructionBonusCollected,
			abc: this.actionBonusCollected,
			fpc: this.productionCollected,
			spc: this.secondProductionCollected,
			rbc: this.researchBonusCollected,
			pcl: this.cardsProducedThisRound,
			pr: this.resourcesProducedThisRound

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

	private phaseGroupFromJson(dto: PhaseCardDTO[]): PhaseCardGroupModel[] {
		let groups: PhaseCardGroupModel[] = []
		for(let groupName of GAME_SELECTABLE_PHASE_LIST){
			groups.push(this.phaseService.getNewPhaseGroup(groupName))
		}


		//load upgraded from dto
		for(let card of dto) {
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
				psp: SelectablePhaseEnum.undefined,
				cbc: false,
				abc: false,
				fpc: false,
				spc: false,
				rbc: false,
				pcl: [],
				pr: []
			},
			true
		)
	}
}
