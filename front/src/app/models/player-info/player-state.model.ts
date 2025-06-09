import { TagInfo, ScanKeep, GlobalParameterValue, RessourceInfo, GlobalParameter, AdvancedRessourceStock, PlayerPhase, OceanBonus, RessourceStock, ProjectFilter, GlobalParameterOffset } from "../../interfaces/global.interface";
import { PlayableCardModel } from "../cards/project-card.model";
import { myUUID, PlayableCardType, RessourceType, RGB, TagType } from "../../types/global.type";
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
import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../../enum/global.enum";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { ProjectCardScalingVPService } from "../../services/cards/project-card-scaling-VP.service";
import { ProjectCardScalingProductionsService } from "../../services/cards/project-card-scaling-productions.service";
import { Utils } from "../../utils/utils";


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

	private scalingVp!: ProjectCardScalingVPService

	constructor(
		private injector: Injector,
		dto?: PlayerStateDTO
	) {
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
		this.scalingVp = injector.get(ProjectCardScalingVPService)
		this.setScalingVp()
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
	getBaseVP(): number {return this.scoreState.getBaseVP()}
	getTotalVP(): number {return this.scoreState.getTotalVP()}
	addVP(vp: number){this.scoreState.addBaseVP(vp)}
	setScalingVp(){
		this.scalingVp.updateCardScalingVPList(this)
		this.scoreState.setScalingVP(this.scalingVp.getTotalScalingVP())
	}
	getCardScaledVp(cardCode: string): number {
		return this.scalingVp.getCardScaledVp(cardCode)
	}
	getTR(): number {return this.scoreState.getTR()}
	addTR(tr: number){this.scoreState.addTR(tr)}
	addForest(forest: number): void {this.scoreState.addForest(forest)}
	getForest(): number {return this.scoreState.getForest()}

	//tagState
	getTags(): TagInfo[] {return this.tagState.getTags()}
	getTagsOfType(tagType: TagType): number {return this.tagState.getTagsOfType(tagType)}
	addTagsFromPlayedCard(card: PlayableCardModel): void {
		this.tagState.addPlayedCardTags(card)
	}
	addTagFromOtherSource(tagId: number, quantity: number){
		this.tagState.addTag(tagId, quantity)
		this.setScalingProduction()
		this.setScalingVp()
	}

	//ressourceState
	getRessources(): RessourceInfo[] {return this.ressourceState.getRessources()}
	setRessources(ressources: RessourceInfo[]){this.ressourceState.setRessources(ressources)}
	getRessourceInfoFromId(id: number): RessourceInfo | undefined {return this.ressourceState.getRessourceInfoFromId(id)}
	getRessourceInfoFromType(type: RessourceType): RessourceInfo | undefined {return this.ressourceState.getRessourceStateFromType(type)}
	addRessource(type: RessourceType, quantity: number): void {this.ressourceState.addRessource(type, quantity)}
	addProduction(ressources: RessourceStock | RessourceStock[]): void {
		let production: RessourceStock[] = Utils.toArray(ressources)
		for(let p of production){
			this.ressourceState.addProduction(p.name, p.valueStock)
		}
		this.setScalingProduction()
	}
	setScalingProduction(): void {
		let ressources: RessourceInfo[] = this.getRessources()
		for(let i=0 ;i<ressources.length; i++){
			let scalingProd =
				ProjectCardScalingProductionsService.getScalingProduction(
					ressources[i].name,
					this.getProjectPlayedIdList(),
					this.getTags()
				)
			this.ressourceState.setScalingProduction(ressources[i].name, scalingProd)
		}
	}
	increaseProductionModValue(ressourceType: Extract<RessourceType, 'steel' | 'titanium'>) {this.ressourceState.increaseProductionModValue(ressourceType)}

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
	addGlobalParameterStepEOP(parameter: GlobalParameterValue): void {
		this.globalParameterState.addGlobalParameterStepEOP(parameter)
	}
	getGlobalParameters(): GlobalParameter[] {return this.globalParameterState.getGlobalParameters()}
	getGlobalParameterFromName(parameterName: GlobalParameterNameEnum): GlobalParameter | undefined {
		for(let param of this.getGlobalParameters()){
			if(param.name===parameterName){
				return param
			}
		}
		return
	}
	isGlobalParameterMaxedOutAtPhaseBeginning(parameterName: GlobalParameterNameEnum): boolean {return this.globalParameterState.isGlobalParameterMaxedOutAtPhaseBeginning(parameterName)}
	getGlobalParameterColorAtPhaseBeginning(parameterName: GlobalParameterNameEnum): GlobalParameterColorEnum {return this.globalParameterState.getGlobalParameterColorAtPhaseBegining(parameterName)}
	getOceanFlippedNumberAtPhaseBeginning(): number {return this.globalParameterState.getOceanFlippedNumberAtPhaseBeginning()}
	addOceanFlippedBonus(bonus: OceanBonus){this.globalParameterState.addOceanFlippedBonus(bonus)}
	getOceanFlippedBonus(): OceanBonus[] {return this.globalParameterState.getOceanFlippedBonus()}

	//otherState
	getResearch(): ScanKeep {return this.otherState.getResearch()}
	setResearch(research: ScanKeep): void {this.otherState.setResearch(research)}
	addResearchValue(research: Partial<ScanKeep>): void {this.otherState.addResearchValue(research)}
	getResearchScan(): number {return this.otherState.getResearchScan()}
	getResearchKeep(): number {return this.otherState.getResearchKeep()}
	getSellCardValueMod(): number {return this.otherState.getSellCardValueMod()}
	addSellCardValueMod(value: number): void {this.otherState.addSellCardValueMod(value)}

	//cardState
	getTriggersIdActive(): string[] {return this.projectCardState.getActivePlayedTriggersId()}
	setTriggerInactive(trigger: string): void {this.projectCardState.setTriggerInactive(trigger)}

	addCardsToHand(cards: string | string[]) {this.projectCardState.addCardsToHand(cards)}
	removeCardsFromHand(cardCodeList: string | string[], cardType: PlayableCardType, addRemovedCardsToDiscard: boolean = true): void {this.projectCardState.removeCardsFromHand(cardCodeList, cardType, addRemovedCardsToDiscard)}
	getProjectHandIdList(filter?: ProjectFilter): string[] {return this.projectCardState.getProjectHandIdList(filter)}
	getHandCurrentSize(): number {return this.projectCardState.getHandCurrentSize()}
	getHandMaximumSize(): number {return this.projectCardState.getHandMaximumSize()}
	getCorporationHandIdList(): string[] {return this.projectCardState.getCorporationHandIdList()}
	addCardsToDiscard(cards: string | string[]) {this.projectCardState.addCardsToDiscard(cards)}
	addRessourceToCard(cardCode: string, advancedRessourceStock: AdvancedRessourceStock): void {
		this.projectCardState.addRessourceToCard(cardCode,advancedRessourceStock)
		this.setScalingVp()
	}
	getProjectPlayedModelFromId(cardCode:string): PlayableCardModel | undefined {return this.projectCardState.getProjectPlayedModelFromCode(cardCode)}
	getProjectPlayedIdList(filter?: ProjectFilter): string[] {return this.projectCardState.getProjectPlayedIdList(filter)}
	getProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.projectCardState.getProjectPlayedModelList(filter)}
	hasProjectPlayedOfFilterType(filter: ProjectFilter): boolean {return this.projectCardState.hasProjectPlayedOfFilterType(filter)}
	getProjectPlayedStock(cardCode: string): AdvancedRessourceStock[] {return this.projectCardState.getProjectPlayedStock(cardCode)}
	getEventQueueState(): EventStateDTO[] {return this.eventState.eventQueueState}
	setPrerequisiteOffset(offset: GlobalParameterOffset | GlobalParameterOffset[]){this.projectCardState.setPrerequisiteOffset(offset)}
	getPrerequisiteOffset(parameter: GlobalParameterNameEnum): number {return this.projectCardState.getPrerequisiteOffset(parameter)}

	//to refactor
	playCard(card:PlayableCardModel, cardType: PlayableCardType):void{
		this.projectCardState.playCard(card)
		this.removeCardsFromHand([card.cardCode], cardType, false)
		this.payCardCost(card)
		this.addTagsFromPlayedCard(card)
		if(Number(card.vpNumber??'')!=0 && !isNaN(Number(card.vpNumber??''))){
			this.addVP(parseInt(card.vpNumber??''))
		}
		if(cardType==='corporation'){
			this.addRessource('megacredit', card.startingMegacredits??0)
		}
		this.setScalingVp()
		this.setScalingProduction()
	}

	loadEventStateActivator(dto: EventStateDTO): void {this.projectCardState.loadEventStateActivator(dto)}

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
