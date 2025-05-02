import { TagInfo, ScanKeep, GlobalParameterValue, RessourceInfo, GlobalParameter, AdvancedRessourceStock, ProjectFilter, PlayerPhase } from "../../interfaces/global.interface";
import { PlayableCardModel } from "../cards/project-card.model";
import { myUUID, PlayableCardType, RessourceType, RGB } from "../../types/global.type";
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
import { PlayerEventStateModel } from "./player-state-event";
import { EventBaseModel } from "../core-game/event.model";
import { EventDTO } from "../../interfaces/dto/event-dto.interface";


export class PlayerStateModel {
	private infoState: PlayerInfoStateModel
	private scoreState: PlayerScoreStateModel
	private tagState: PlayerTagStateModel
	private ressourceState: PlayerRessourceStateModel
	private projectCardState: PlayerProjectCardStateModel
	private phaseCardState: PlayerPhaseCardStateModel
	private globalParameterState: PlayerGlobalParameterStateModel
	private eventState: PlayerEventStateModel
	private otherState: PlayerOtherStateModel

	constructor(private injector: Injector, dto?: PlayerStateDTO) {
		if(dto){
			this.infoState = new PlayerInfoStateModel(dto.infoState)
			this.scoreState = new PlayerScoreStateModel(dto.scoreState)
			this.tagState = new PlayerTagStateModel(dto.tagState)
			this.ressourceState = new PlayerRessourceStateModel(dto.ressourceState)
			this.projectCardState = new PlayerProjectCardStateModel(injector, dto.projectCardState)
			this.phaseCardState = new PlayerPhaseCardStateModel(injector, dto.phaseCardState)
			this.globalParameterState = new PlayerGlobalParameterStateModel(dto.globalParameterState)
			this.eventState = new PlayerEventStateModel(dto.eventState)
			this.otherState = new PlayerOtherStateModel(dto.otherState)
		} else {
			this.infoState = PlayerInfoStateModel.empty()
			this.scoreState = PlayerScoreStateModel.empty()
			this.tagState = PlayerTagStateModel.empty()
			this.ressourceState = PlayerRessourceStateModel.empty()
			this.projectCardState = PlayerProjectCardStateModel.empty(injector)
			this.phaseCardState = PlayerPhaseCardStateModel.empty(injector)
			this.globalParameterState = PlayerGlobalParameterStateModel.empty()
			this.eventState = PlayerEventStateModel.empty()
			this.otherState = PlayerOtherStateModel.empty()
		}
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
	addForest(forest: number): void {this.scoreState.addForest(forest)}
	getForest(): number {return this.scoreState.getForest()}

	//tagState
	getTags(): TagInfo[] {return this.tagState.getTags()}
	addPlayedCardTags(card: PlayableCardModel): void {this.tagState.addPlayedCardTags(card)}

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
	getPreviousPhaseSelected(): SelectablePhaseEnum {return this.phaseCardState.getPreviousPhaseSelected()}
	setPhaseSelected(selection: SelectablePhaseEnum): void {this.phaseCardState.setPhaseSelected(selection)}
	getPhaseCards(onlyUpgraded: boolean = false): PhaseCardModel[] {return this.phaseCardState.getPhaseCards(onlyUpgraded)}
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
	removeCardsFromHand(cardIdList: number | number[], cardType: PlayableCardType): void {this.projectCardState.removeCardsFromHand(cardIdList, cardType)}
	getProjectHandIdList(filter?: ProjectFilter): number[] {return this.projectCardState.getProjectHandIdList(filter)}
	getHandCurrentSize(): number {return this.projectCardState.getHandCurrentSize()}
	getHandMaximumSize(): number {return this.projectCardState.getHandMaximumSize()}
	getCorporationHandIdList(): number[] {return this.projectCardState.getCorporationHandIdList()}
	addCardsToDiscard(cards: number | number[]) {this.projectCardState.addCardsToDiscard(cards)}

	addRessourceToCard(cardId: number, advancedRessourceStock: AdvancedRessourceStock): void {this.projectCardState.addRessourceToCard(cardId,advancedRessourceStock)}
	getProjectPlayedModelFromId(cardId:number): PlayableCardModel | undefined {return this.projectCardState.getProjectPlayedModelFromId(cardId)}
	getProjectPlayedIdList(filter?: ProjectFilter): number[] {return this.projectCardState.getProjectPlayedIdList(filter)}
	getProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.projectCardState.getProjectPlayedModelList(filter)}

	getEventQueueState(): EventDTO[] {return this.eventState.eventQueueState}

	//to refactor
	playCard(card:PlayableCardModel, cardType: PlayableCardType):void{
		this.projectCardState.playCard(card)
		this.removeCardsFromHand([card.id], cardType)
		this.payCardCost(card)
		this.addPlayedCardTags(card)
	}

	loadEventStateActivator(dto: EventDTO): void {this.projectCardState.loadEventStateActivator(dto)}

	private payCardCost(card: PlayableCardModel):void{
		this.addRessource('megacredit', -card.cost)
	}

	public toJson(eventQueue?: EventBaseModel[]): PlayerStateDTO {
		return {
			infoState: this.infoState.toJson(),
			scoreState: this.scoreState.toJson(),
			tagState: this.tagState.toJson(),
			ressourceState: this.ressourceState.toJson(),
			projectCardState: this.projectCardState.toJson(),
			phaseCardState: this.phaseCardState.toJson(),
			globalParameterState: this.globalParameterState.toJson(),
			eventState: this.eventState.toJson(eventQueue),
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
			|| !data.eventState
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
	public static toPlayerPhaseGroup(groupDto: PlayerStateDTO[]){
		let playerPhaseList: PlayerPhase[] = []
		for(let dto of groupDto){
			playerPhaseList.push({
				currentSelectedPhase: dto.phaseCardState.sp,
				currentPhaseType: "actionAbilityOnly",
				playerId: dto.infoState.i,
				previousSelectedPhase: dto.phaseCardState.psp
			})
		}
		return playerPhaseList
	}
}


export class PlayerReadyModel {
    id!: myUUID;
    name!:string;
    isReady: boolean = false;
}
