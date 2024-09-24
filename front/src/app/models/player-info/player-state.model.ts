import { RessourceState, TagState, ResearchState, GlobalParameterValue } from "../../interfaces/global.interface";
import { GlobalParameterName, RGB } from "../../types/global.type";
import { PhaseCardHolderModel } from "../cards/phase-card.model";
import { ProjectCardModel, ProjectCardState } from "../cards/project-card.model";
import { RessourceType } from "../../types/global.type";
import { GlobalParameterModel } from "../core-game/global-parameter.model";

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
    id!: number;
    name!: string;
    color!: RGB;
    ressource!: RessourceState[];
    terraformingRating!: number;
    vp!: number;
    tag!: TagState[];
    cards!: ProjectCardState
    research!: ResearchState
	phaseCard = new PhaseCardHolderModel
	phaseCardUpgradeNumber: number = 0
	sellCardValueMod: number = 0
	globalParameter = new GlobalParameterModel

	//private readonly scalingProd = inject(ProjectCardScalingProductionsService);
	//constructor(private scalingProductionService: ProjectCardScalingProductionsService){}

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
}


export class PlayerReadyModel {
    id!: number;
    name!:string;
    isReady: boolean = false;
}
