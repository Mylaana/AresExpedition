import { TagInfo, ScanKeep, GlobalParameterValue, RessourceInfo, GlobalParameter, AdvancedRessourceStock, ProjectFilter } from "../../interfaces/global.interface";
import { ProjectCardModel } from "../cards/project-card.model";
import { RessourceType, RGB } from "../../types/global.type";
import { PlayerStateModelFullDTO, PlayerStateModelPublicDTO, PlayerStateModelSecretDTO } from "../../interfaces/dto/player-state-dto.interface";
import { PlayerScoreStateModel } from "./player-state-score.model";
import { PlayerInfoStateModel } from "./player-state-info.model";
import { PlayerTagStateModel } from "./player-state-tag.model";
import { PlayerRessourceStateModel } from "./player-state-ressource.model";
import { PlayerPhaseCardState } from "./player-state-phase-card.model";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { PhaseCardInfoService } from "../../services/cards/phase-card-info.service";
import { Injector } from "@angular/core";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { PlayerOtherStateModel } from "./player-state-other.model";
import { PlayerGlobalParameterStateModel } from "./player-state-global-parameter.model";
import { PlayerProjectCardState } from "./player-state-project-card.model";
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { ProjectCardInitializeService } from "../../services/cards/project-card-initialize.service";

export class PlayerStateModel {
	private projectCardState: PlayerProjectCardState
	private infoState = new PlayerInfoStateModel
	private scoreState = new PlayerScoreStateModel
	private tagState = new PlayerTagStateModel
	private ressourceState = new PlayerRessourceStateModel
	private phaseCardState: PlayerPhaseCardState
	private globalParameterState = new PlayerGlobalParameterStateModel
	private otherState = new PlayerOtherStateModel

	constructor(private injector: Injector) {
		const phaseService = this.injector.get(PhaseCardInfoService)
		const projectInfoService = this.injector.get(ProjectCardInfoService)
		const projectInitializeService = this.injector.get(ProjectCardInitializeService)
		this.phaseCardState = new PlayerPhaseCardState(phaseService)
		this.projectCardState = new PlayerProjectCardState(projectInfoService, projectInitializeService)
	  }


	//infostate
	getId(): number {return this.infoState.getId()}
	setId(id: number){this.infoState.setId(id)}
	getName(): string {return this.infoState.getName()}
	setName(name: string){this.infoState.setName(name)}
	getColor(): RGB {return this.infoState.getColor()}
	setColor(color: RGB){this.infoState.setColor(color)}

	//scoreState
	getMilestoneCompleted(): number {return this.scoreState.getMilestoneCompletedNumber()}
	addMilestoneCompleted(){this.scoreState.addMilestoneCompleted()}
	getVP(): number {return this.scoreState.getVP()}
	addVP(vp: number){this.scoreState.addVP(vp)}
	getTR(): number {return this.scoreState.getVP()}
	addTR(vp: number){this.scoreState.addVP(vp)}

	//tagState
	getTags(): TagInfo[] {return this.tagState.getTags()}
	addPlayedCardTags(card: ProjectCardModel): void {this.tagState.addPlayedCardTags(card)}

	//ressourceState
	getRessources(): RessourceInfo[] {return this.ressourceState.getRessources()}
	getRessourceInfoFromId(id: number): RessourceInfo | undefined {return this.ressourceState.getRessourceInfoFromId(id)}
	getRessourceInfoFromType(type: RessourceType): RessourceInfo | undefined {return this.ressourceState.getRessourceStateFromType(type)}
	addRessource(type: RessourceType, quantity: number): void {this.ressourceState.addRessource(type, quantity)}
	addProduction(type: RessourceType, quantity: number): void {this.ressourceState.addProduction(type, quantity)}
	setScalingProduction(type: RessourceType, quantity: number): void {this.ressourceState.setScalingProduction(type, quantity)}

	//phaseCardState
	getPhaseCardUpgradedCount(): number {return this.phaseCardState.getPhaseCardUpgradedCount()}
	addPhaseCardUpgradeCount(): void {this.phaseCardState.addPhaseCardUpgradeCount()}
	setPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {this.phaseCardState.setPhaseCardUpgraded(upgrade)}
	getPhaseSelected(): SelectablePhaseEnum | undefined {return this.phaseCardState.getPhaseSelected()}
	setPhaseSelected(selection: SelectablePhaseEnum): void {this.phaseCardState.setPhaseSelected(selection)}
	getUpgradedPhaseCards(): PhaseCardModel[] {return this.phaseCardState.getUpgradedPhaseCards()}
	getPhaseGroups(): PhaseCardGroupModel[] {return this.phaseCardState.getPhaseGroups()}

	//globalParameterState
	addGlobalParameterStepEOP(parameter: GlobalParameterValue): void {this.globalParameterState.addGlobalParameterStepEOP(parameter)}
	getGlobalParameters(): GlobalParameter[] {return this.globalParameterState.getGlobalParameters()}

	//otherState
	getResearch(): ScanKeep {return this.otherState.getResearch()}
	setResearch(research: ScanKeep): void {this.otherState.setResearch(research)}
	addResearchValue(research: Partial<ScanKeep>): void {this.otherState.addResearchValue(research)}
	getResearchScan(): number {return this.otherState.getResearchScan()}
	getResearchKeep(): number {return this.otherState.getResearchKeep()}
	getSellCardValueMod(): number {return this.otherState.getSellCardValueMod()}
	addSellCardValueMod(value: number): void {this.otherState.addSellCardValueMod(value)}

	//cardState
	setTriggerInactive(triggerId: number): void {this.projectCardState.setTriggerInactive(triggerId)}
	getTriggersIdOnPlayedCard(): number[] {return this.projectCardState.getTriggersIdOnPlayedCard()}
	getTriggersIdOnParameterIncrease(): number[] {return this.projectCardState.getTriggersIdOnParameterIncrease()}
	getTriggersIdOnRessourceAddedToCard(): number[] {return this.projectCardState.getTriggersIdOnRessourceAddedToCard()}
	getTriggersIdOnGainedTag(){return this.projectCardState.getTriggersIdOnGainedTag()}
	getTriggerCostMod(): number[] {return this.projectCardState.getTriggerCostMod()}

	addCardsToHand(cards: number | number[]) {this.projectCardState.addCardsToHand(cards)}
	removeCardsFromHand(cardIdList: number | number[]): void {this.projectCardState.removeCardsFromHand(cardIdList)}
	getProjectHandIdList(filter?: ProjectFilter): number[] {return this.projectCardState.getProjectHandIdList(filter)}
	getHandCurrentSize(): number {return this.projectCardState.getHandCurrentSize()}
	getHandMaximumSize(): number {return this.projectCardState.getHandMaximumSize()}

	addRessourceToCard(cardId: number, advancedRessourceStock: AdvancedRessourceStock): void {this.projectCardState.addRessourceToCard(cardId,advancedRessourceStock)}
	getProjectPlayedModelFromId(cardId:number): ProjectCardModel | undefined {return this.projectCardState.getProjectPlayedModelFromId(cardId)}
	getProjectPlayedIdList(filter?: ProjectFilter): number[] {return this.projectCardState.getProjectPlayedIdList(filter)}
	getProjectPlayedModelList(filter?: ProjectFilter): ProjectCardModel[] {return this.projectCardState.getProjectPlayedModelList(filter)}


	//to refactor
	playCard(card:ProjectCardModel):void{
		this.projectCardState.playCard(card)
		this.removeCardsFromHand([card.id])
		this.payCardCost(card)
		this.addPlayedCardTags(card)
	}

	private payCardCost(card: ProjectCardModel):void{
		this.addRessource('megacredit', -card.cost)
	}


	public toFullDTO(): PlayerStateModelFullDTO {
		return {
			cards: undefined, //this.cards,

			scoreState: this.scoreState,
			infoState: this.infoState,
			tagState: this.tagState,
			ressourceState: this.ressourceState,
			phaseCardState: this.phaseCardState,
			globalParameter: this.globalParameterState,
			otherState: this.otherState
		}
	}
	public toSecretDTO(): PlayerStateModelSecretDTO {
		return {
			cards: undefined,
			globalParameter: this.globalParameterState,
		}
	}
	public toPublicDTO(): PlayerStateModelPublicDTO {
		return {
			infoState: this.infoState,
			scoreState: this.scoreState,
			tagState: this.tagState,
			ressourceState: this.ressourceState,
			phaseCardState: this.phaseCardState,
			otherState: this.otherState
		}
	}
}


export class PlayerReadyModel {
    id!: number;
    name!:string;
    isReady: boolean = false;
}
