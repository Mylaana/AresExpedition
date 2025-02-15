import { Injector } from "@angular/core"
import { GAME_HAND_MAXIMUM_SIZE } from "../../global/global-const"
import { PlayerProjectCardStateDTO } from "../../interfaces/dto/player-state-dto.interface"
import { AdvancedRessourceStock, ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service"
import { ProjectCardInitializeService } from "../../services/cards/project-card-initialize.service"
import { AdvancedRessourceType } from "../../types/global.type"
import { PlayedProject } from "../../types/project-card.type"
import { Utils } from "../../utils/utils"
import { ProjectCardModel, TriggerState } from "../cards/project-card.model"

export class PlayerProjectCardStateModel {
    private hand: number[] = []
    private projects: PlayedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    private triggers = new TriggerState
	private handMaximumSize = GAME_HAND_MAXIMUM_SIZE

	private cardInfoService: ProjectCardInfoService
	private cardInitializeService: ProjectCardInitializeService

    constructor(private injector: Injector, dto: PlayerProjectCardStateDTO,
	){
		this.cardInfoService = this.injector.get(ProjectCardInfoService)
		this.cardInitializeService = this.injector.get(ProjectCardInitializeService)

		this.hand = dto.h,
		//this.projects = dto.p
		this.handMaximumSize = dto.hms
		this.projects = {
			playedIdList: dto.ppil,
			playedProjectList: this.cardInfoService.getProjectCardList(dto.ppil)
		}
		this.triggers = TriggerState.fromJson(dto.t)
	}

    playCard(card: ProjectCardModel): void {
        this.projects.playedIdList.push(card.id)
        this.projects.playedProjectList.push(card)
		this.cardInitializeService.initialize(card)

		console.log('card:', card)
        if(card.cardSummaryType!='trigger'){return}
		console.log(this.triggers)
        this.triggers.playTrigger(card.id)
    }
	addCardsToHand(cards: number | number[]){this.hand = this.hand.concat(Utils.toNumberArray(cards))}
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
    getProjectPlayedIdList(filter?: ProjectFilter): number[] {return this.filterCardIdList(this.projects.playedIdList, filter)}
    getProjectPlayedModelList(filter?: ProjectFilter): ProjectCardModel[] {return this.filterCardModelList(this.projects.playedProjectList, filter)}
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
    getProjectHandIdList(filter?: ProjectFilter): number[] {return this.filterCardIdList(this.hand, filter)}

	private filterCardModelList(cards: ProjectCardModel[],  filter: ProjectFilter | undefined): ProjectCardModel[] {
        if(!filter){return cards}
		let projectList:ProjectCardModel[] = []
        for(let card of cards){
            if(card.isFilterOk(filter)===true){
                projectList.push(card)
            }
        }
        return projectList
	}
	private filterCardIdList(cards:number[], filter: ProjectFilter | undefined): number[] {
		if(!filter){return cards}
		let projectList:ProjectCardModel[] = this.filterCardModelList(this.cardInfoService.getProjectCardList(cards), filter)
		let idList: number[] = []

		for(let project of projectList){
			idList.push(project.id)
		}
		return idList
	}

	toJson(): PlayerProjectCardStateDTO {
		return {
			h: this.hand,
			ppil: this.projects.playedIdList,
			ppcs: null,
			t: this.triggers.toJson(),
			hms: this.handMaximumSize
		}
	}
	static fromJson(data: PlayerProjectCardStateDTO, injector: Injector): PlayerProjectCardStateModel {
		if (!data.h || !data.ppil || data.ppcs|| !data.t || !data.hms){
			throw new Error("Invalid PlayerProjectCardStateDTO: Missing required fields")
		}
		return new PlayerProjectCardStateModel(injector, data)
	}
	static empty(injector: Injector): PlayerProjectCardStateModel {
		return new PlayerProjectCardStateModel(
			injector,
			{
				h: [],
				hms: 0,
				ppil: [],
				ppcs: [],
				t: {aci: [], acmt: [], aogt: [], aopc: [], aopi: [], aoratc: [], pci: []}
			}
		)
	}
}
