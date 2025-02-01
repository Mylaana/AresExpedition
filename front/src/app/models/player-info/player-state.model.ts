import { RessourceState, TagState, ScanKeep, GlobalParameterValue } from "../../interfaces/global.interface";
import { PhaseCardHolderModel } from "../cards/phase-card.model";
import { ProjectCardModel, ProjectCardState } from "../cards/project-card.model";
import { RessourceType, RGB } from "../../types/global.type";
import { GlobalParameterModel } from "../core-game/global-parameter.model";
import { PlayerStateModelFullDTO, PlayerStateModelPublicDTO, PlayerStateModelSecretDTO } from "../../interfaces/dto/player-state-dto.interface";
import { PlayerScoreStateModel } from "./player-state-score.model";
import { PlayerInfoStateModel } from "./player-state-info.model";

const ressourceIndex = new  Map<RessourceType, number>(
	[
		['megacredit', 0],
		['heat', 1],
		['plant', 2],
		['steel', 3],
		['titanium', 4],
		['card', 5],
	]
)
export class PlayerStateModel {
    ressource!: RessourceState[];
    tag!: TagState[];
    cards!: ProjectCardState
    research!: ScanKeep
	phaseCards = new PhaseCardHolderModel
	phaseCardUpgradeCount: number = 0
	sellCardValueMod: number = 0
	globalParameter = new GlobalParameterModel

	private infoState = new PlayerInfoStateModel
	private scoreState = new PlayerScoreStateModel

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

    getRessourceStateFromId(ressourceId: number): RessourceState | undefined{
        for(let i=0; i<this.ressource.length; i++){
            if(this.ressource[i].id === ressourceId){
                return this.ressource[i]
            }
        }
        return
    }
    getRessourceStateFromName(ressourceName: string): RessourceState | undefined{
        for(let i=0; i<this.ressource.length; i++){
            if(this.ressource[i].name === ressourceName){
                return this.ressource[i]
            }
        }
        return
    }
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
	addProduction(ressource: RessourceType, quantity: number){
		this.ressource[Number(ressourceIndex.get(ressource))].valueBaseProd += quantity
	}
	addRessource(ressource: RessourceType, quantity: number){
		this.ressource[Number(ressourceIndex.get(ressource))].valueStock += quantity
	}
	addPlayedCardTags(card: ProjectCardModel):void{
		for(let tagId of card.tagsId){
			this.addTag(tagId)
		}
	}
	addTag(tagId:number):void{
		if(tagId===-1){return}
		this.tag[tagId].valueCount += 1
	}
	/**update productions with flat + scaling values*/
	updateProductions(ressource: RessourceType, scalingProduction:number):void{
		this.ressource[Number(ressourceIndex.get(ressource))].valueProd =
			this.ressource[Number(ressourceIndex.get(ressource))].valueBaseProd + scalingProduction
	}
	addGlobalParameterStep(parameter: GlobalParameterValue): void {
		this.globalParameter.addStepToParameterEOP(parameter)
	}
	public toFullDTO(): PlayerStateModelFullDTO {
		return {
			ressource: this.ressource,
			tag: this.tag,
			research: this.research,
			phaseCards: undefined, //this.phaseCards,
			phaseCardUpgradeCount: this.phaseCardUpgradeCount,
			sellCardValueMod: this.sellCardValueMod,

			cards: undefined, //this.cards,
			globalParameter: this.globalParameter,

			scoreState: this.scoreState,
			infoState: this.infoState
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
			ressource: this.ressource,
			tag: this.tag,
			research: this.research,
			phaseCards: undefined, //to change
			phaseCardUpgradeCount: this.phaseCardUpgradeCount,
			sellCardValueMod: this.sellCardValueMod,

			infoState: this.infoState,
			scoreState: this.scoreState,
		}
	}
}


export class PlayerReadyModel {
    id!: number;
    name!:string;
    isReady: boolean = false;
}
