import { TagInfo, ScanKeep, GlobalParameterValue, RessourceInfo } from "../../interfaces/global.interface";
import { PhaseCardHolderModel } from "../cards/phase-card.model";
import { ProjectCardModel, ProjectCardState } from "../cards/project-card.model";
import { RessourceType, RGB } from "../../types/global.type";
import { GlobalParameterModel } from "../core-game/global-parameter.model";
import { PlayerStateModelFullDTO, PlayerStateModelPublicDTO, PlayerStateModelSecretDTO } from "../../interfaces/dto/player-state-dto.interface";
import { PlayerScoreStateModel } from "./player-state-score.model";
import { PlayerInfoStateModel } from "./player-state-info.model";
import { PlayerTagStateModel } from "./player-state-tag.model";
import { PlayerRessourceStateModel } from "./player-state-ressource.model";

export class PlayerStateModel {
    cards!: ProjectCardState
    research!: ScanKeep
	phaseCards = new PhaseCardHolderModel
	phaseCardUpgradeCount: number = 0
	sellCardValueMod: number = 0
	globalParameter = new GlobalParameterModel

	private infoState = new PlayerInfoStateModel
	private scoreState = new PlayerScoreStateModel
	private tagState = new PlayerTagStateModel
	private ressourceState = new PlayerRessourceStateModel

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

	//to refactor
	playCard(card:ProjectCardModel):void{
		this.cards.playCard(card)
		this.removeCardsFromHand([card.id])
		this.payCardCost(card)
		this.addPlayedCardTags(card)
	}
	removeCardsFromHand(cardList: number[]):void{
		for(let card of cardList){
			let index = this.cards.hand.indexOf(Number(card), 0);
			if (index > -1) {
				this.cards.hand.splice(index, 1);
			}
		}
	}
	payCardCost(card: ProjectCardModel):void{
		this.addRessource('megacredit', -card.cost)
	}

	addGlobalParameterStep(parameter: GlobalParameterValue): void {
		this.globalParameter.addStepToParameterEOP(parameter)
	}
	public toFullDTO(): PlayerStateModelFullDTO {
		return {
			research: this.research,
			phaseCards: undefined, //this.phaseCards,
			phaseCardUpgradeCount: this.phaseCardUpgradeCount,
			sellCardValueMod: this.sellCardValueMod,

			cards: undefined, //this.cards,
			globalParameter: this.globalParameter,

			scoreState: this.scoreState,
			infoState: this.infoState,
			tagState: this.tagState,
			ressourceState: this.ressourceState
		}
	}
	public toSecretDTO(): PlayerStateModelSecretDTO {
		return {
			cards: undefined,
			globalParameter: this.globalParameter
		}
	}
	public toPublicDTO(): PlayerStateModelPublicDTO {
		return {
			research: this.research,
			phaseCards: undefined, //to change
			phaseCardUpgradeCount: this.phaseCardUpgradeCount,
			sellCardValueMod: this.sellCardValueMod,

			infoState: this.infoState,
			scoreState: this.scoreState,
			tagState: this.tagState,
			ressourceState: this.ressourceState
		}
	}
}


export class PlayerReadyModel {
    id!: number;
    name!:string;
    isReady: boolean = false;
}
