import { GAME_HAND_MAXIMUM_SIZE } from "../../global/global-const"
import { AdvancedRessourceStock, ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service"
import { ProjectCardInitializeService } from "../../services/cards/project-card-initialize.service"
import { AdvancedRessourceType } from "../../types/global.type"
import { PlayedProject } from "../../types/project-card.type"
import { Utils } from "../../utils/utils"
import { ProjectCardModel, TriggerState } from "../cards/project-card.model"

export class PlayerProjectCardState {
    private hand: number[] = []
    private projects: PlayedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    private triggers = new TriggerState
	private handMaximumSize = GAME_HAND_MAXIMUM_SIZE

    constructor(
		private cardInfo: ProjectCardInfoService,
		private cardInitializeService: ProjectCardInitializeService
	){}

    playCard(card: ProjectCardModel): void {
        this.projects.playedIdList.push(card.id)
        this.projects.playedProjectList.push(card)
		this.cardInitializeService.initialize(card)

        if(card.cardSummaryType!='trigger'){return}
        this.triggers.playTrigger(card.id)
    }
	addCardsToHand(cards: number | number[]){this.hand.concat(this.hand, Utils.toNumberArray(cards))}
	removeCardsFromHand(cards: number | number[]):void{
		let cardList = Utils.toNumberArray(cards)
		for(let card of cardList){
			let index = this.hand.indexOf(Number(card), 0);
			if (index > -1) {
				this.hand.splice(index, 1);
			}
		}
	}
	getHandCurrentSize(): number {return this.hand.length}
	getHandMaximumSize(): number {return this.handMaximumSize}
    getPlayedTriggersId(): number[] {return this.triggers.getPlayedTriggers()}
    getActivePlayedTriggersId(): number[] {return this.triggers.getActivePlayedTriggers()}
    getTriggersIdOnRessourceAddedToCard(): number[] {return this.triggers.getOnRessourceAddedToCard()}
    getTriggersIdOnParameterIncrease(): number[] {return this.triggers.getOnParameterIncrease()}
    getTriggersIdOnPlayedCard(): number[] {return this.triggers.getOnPlayedCard()}
    getTriggersIdOnGainedTag(): number[] {return this.triggers.getOnGainedTag()}
    getTriggerCostMod(): number[] {return this.triggers.getCostMod()}
    setTriggerInactive(triggerId: number): void {this.triggers.setTriggerInactive(triggerId)}
    getProjectPlayedIdList(): number[] {return this.projects.playedIdList}
    getProjectPlayedModelList(filter?: ProjectFilter): ProjectCardModel[] {
        if(!filter){return this.projects.playedProjectList}

        let projectList:ProjectCardModel[] = []

        for(let card of this.projects.playedProjectList){
            if(card.isFilterOk(filter)===true){
                projectList.push(card)
            }
        }
        return projectList
    }
    getProjectPlayedModelFromId(cardId: number): ProjectCardModel | undefined {
        for(let card of this.projects.playedProjectList){
            if(card.id===cardId){
                return card
            }
        }
        return
    }
    addRessourceToCard(cardId: number, ressource: AdvancedRessourceStock ): void {
        let card = this.getProjectPlayedModelFromId(cardId)
        if(!card){return}
        card.addRessourceToStock(ressource)
    }
    getCardStockValue(cardId:number, ressourceName: AdvancedRessourceType): number {
        let result = this.getProjectPlayedModelFromId(cardId)?.getStockValue(ressourceName)
        if(!result){return 0}
        return result
    }
    getProjectHandIdList(): number[] {return this.hand}
}
