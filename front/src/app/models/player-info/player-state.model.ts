import { TagInfo, ScanKeep, GlobalParameterValue, RessourceInfo, GlobalParameter, AdvancedRessourceStock, ProjectFilter } from "../../interfaces/global.interface";
import { ProjectCardModel } from "../cards/project-card.model";
import { myUUID, RessourceType, RGB } from "../../types/global.type";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { PlayerScoreStateModel } from "./player-state-score.model";
import { PlayerInfoStateModel } from "./player-state-info.model";
import { PlayerTagStateModel } from "./player-state-tag.model";
import { PlayerRessourceStateModel } from "./player-state-ressource.model";
import { PlayerPhaseCardStateModel } from "./player-state-phase-card.model";
import { PhaseCardUpgradeType } from "../../types/phase-card.type";
import { Injector } from "@angular/core";
import { PhaseCardGroupModel, PhaseCardModel } from "../cards/phase-card.model";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { PlayerOtherStateModel } from "./player-state-other.model";
import { PlayerGlobalParameterStateModel } from "./player-state-global-parameter.model";
import { PlayerProjectCardStateModel } from "./player-state-project-card.model";


export class PlayerStateModel {
	private infoState: PlayerInfoStateModel
	private scoreState: PlayerScoreStateModel
	private tagState: PlayerTagStateModel
	private ressourceState: PlayerRessourceStateModel
	private projectCardState: PlayerProjectCardStateModel
	private phaseCardState: PlayerPhaseCardStateModel
	private globalParameterState: PlayerGlobalParameterStateModel
	private otherState: PlayerOtherStateModel

	constructor(private injector: Injector, dto?: PlayerStateDTO) {
		this.infoState = dto
			?new PlayerInfoStateModel(dto.infoState)
			:PlayerInfoStateModel.empty()
		this.scoreState = dto
			?new PlayerScoreStateModel(dto.scoreState)
			:PlayerScoreStateModel.empty()
		this.tagState = dto
			?new PlayerTagStateModel(dto.tagState)
			:PlayerTagStateModel.empty()
		this.ressourceState = dto
			?new PlayerRessourceStateModel(dto.ressourceState)
			:PlayerRessourceStateModel.empty()
		this.projectCardState = dto
			?new PlayerProjectCardStateModel(injector, dto.projectCardState)
			:PlayerProjectCardStateModel.empty(injector)
		this.phaseCardState = dto
			?new PlayerPhaseCardStateModel(injector, dto.phaseCardState)
			:PlayerPhaseCardStateModel.empty(injector)
		this.globalParameterState = dto
			?new PlayerGlobalParameterStateModel(dto.globalParameterState)
			:PlayerGlobalParameterStateModel.empty()
		this.otherState = dto
			?new PlayerOtherStateModel(dto.otherState)
			:PlayerOtherStateModel.empty()
	  }


	//infostate
	getId(): myUUID {return this.infoState.getId()}
	setId(id: myUUID){this.infoState.setId(id)}
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
	getPhaseSelected(): SelectablePhaseEnum {return this.phaseCardState.getPhaseSelected()}
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
	getCorporationHandIdList(): number[] {return this.projectCardState.getCorporationHandIdList()}

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

	public toJson(): PlayerStateDTO {
		return {
			infoState: this.infoState.toJson(),
			scoreState: this.scoreState.toJson(),
			tagState: this.tagState.toJson(),
			ressourceState: this.ressourceState.toJson(),
			projectCardState: this.projectCardState.toJson(),
			phaseCardState: this.phaseCardState.toJson(),
			globalParameterState: this.globalParameterState.toJson(),
			otherState: this.otherState.toJson()
		}
	}
	public static fromJson(data: Partial<PlayerStateDTO>, injector: Injector): PlayerStateModel {
		if(
			!data.infoState
			|| !data.scoreState
			|| !data.tagState
			|| !data.ressourceState
			|| !data.projectCardState
			|| !data.phaseCardState
			|| !data.globalParameterState
			|| !data.otherState
		){
			throw new Error("Invalid PlayerStateDTO: Missing required fields")
		}
		return new PlayerStateModel(injector, data as PlayerStateDTO)
	}
	static empty(injector: Injector): PlayerStateModel {
		return new PlayerStateModel(injector);
	}
	public newGame(dto: PlayerStateDTO): void {
		this.infoState.newGame(dto.infoState)
		this.scoreState.newGame()
		this.tagState.newGame()
		this.ressourceState.newGame()
		this.projectCardState.newGame(dto.projectCardState)
		this.phaseCardState.newGame()
		this.globalParameterState.newGame()
		this.otherState.newGame()
	}
}


export class PlayerReadyModel {
    id!: myUUID;
    name!:string;
    isReady: boolean = false;
}
