import { Injector } from "@angular/core"
import { GAME_HAND_MAXIMUM_SIZE } from "../../global/global-const"
import { PlayerProjectCardStateDTO } from "../../interfaces/dto/player-state-dto.interface"
import { AdvancedRessourceStock, ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service"
import { ProjectCardInitializeService } from "../../services/cards/project-card-initialize.service"
import { AdvancedRessourceType, PlayableCardType } from "../../types/global.type"
import { PlayedProject } from "../../types/project-card.type"
import { Utils } from "../../utils/utils"
import { PlayableCardModel, TriggerState } from "../cards/project-card.model"
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface"

export class PlayerProjectCardStateModel {
    private hand: number[] = []
	private handCorporation: number[] = []
	private handDiscard: number[] = []
    private projects: PlayedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    private triggers = new TriggerState
	private handMaximumSize

	private cardInfoService: ProjectCardInfoService
	private cardInitializeService: ProjectCardInitializeService

    constructor(private injector: Injector, dto: PlayerProjectCardStateDTO,
	){
		this.cardInfoService = this.injector.get(ProjectCardInfoService)
		this.cardInitializeService = this.injector.get(ProjectCardInitializeService)

		this.hand = dto.h,
		this.handCorporation = dto.hc,
		this.handMaximumSize = dto.hms
		this.projects = {
			playedIdList: dto.ppil,
			playedProjectList: this.cardInfoService.getProjectCardList(dto.ppil)
		}
		this.triggers = TriggerState.fromJson(dto.t)
	}

    playCard(card: PlayableCardModel): void {
        this.projects.playedIdList.push(card.id)
		let cardCopy = this.cardInfoService.getCardById(card.id)
		if(!cardCopy){return}
        this.projects.playedProjectList.push(cardCopy)
		this.cardInitializeService.initialize(cardCopy)

        if(!cardCopy.hasTrigger()){return}
        this.triggers.playTrigger(cardCopy.id)
    }
	addCardsToHand(cards: number | number[]){this.hand = this.hand.concat(Utils.toNumberArray(cards))}
	addCardsToDiscard(cards: number | number[]){this.handDiscard = this.handDiscard.concat(Utils.toNumberArray(cards))}
	removeCardsFromHand(cards: number | number[], cardType: PlayableCardType):void{
		let cardList = Utils.toNumberArray(cards)
		for(let card of cardList){
			switch(cardType){
				case('project'):{
					let index = this.hand.indexOf(Number(card), 0);
					if (index > -1) {
						this.addCardsToDiscard(this.hand.splice(index, 1)[0])
					}
					break
				}
				case('corporation'):{
					let index = this.handCorporation.indexOf(Number(card), 0);
					if (index > -1) {
						this.handCorporation.splice(index, 1)
					}
					break
				}
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
    getProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.filterCardModelList(this.projects.playedProjectList, filter)}
    getProjectPlayedModelFromId(cardId: number): PlayableCardModel | undefined {
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
	getCorporationHandIdList(): number[] {return this.handCorporation}

	private filterCardModelList(cards: PlayableCardModel[],  filter: ProjectFilter | undefined): PlayableCardModel[] {
        if(!filter){return cards}
		let projectList:PlayableCardModel[] = []
        for(let card of cards){
            if(card.isFilterOk(filter)===true){
                projectList.push(card)
            }
        }
        return projectList
	}
	private filterCardIdList(cards:number[], filter: ProjectFilter | undefined): number[] {
		if(!filter){return cards}
		let projectList:PlayableCardModel[] = this.filterCardModelList(this.cardInfoService.getProjectCardList(cards), filter)
		let idList: number[] = []

		for(let project of projectList){
			idList.push(project.id)
		}
		return idList
	}

	loadEventStateActivator(dto: EventStateDTO){
		const raw = dto.v;

		if (!raw || typeof raw !== 'object') {
			console.warn('Invalid event state format:', raw);
			return;
		}

		for (const [key, value] of Object.entries(raw)) {
			if (typeof key === 'string' && typeof value === 'number') {
				this.loadCardActivationCount(key, value);
			} else {
				console.warn(`Invalid entry in event state activator:`, key, value);
			}
		}
	}
	private loadCardActivationCount(cardId: string, activationCount: number){
		for(let card of this.projects.playedProjectList){
			if(card.id.toString()===cardId){
				card.activated = activationCount
				return
			}
		}
	}
	toJson(): PlayerProjectCardStateDTO {
		return {
			h: this.hand,
			hc: this.handCorporation,
			hd: this.handDiscard,
			ppil: this.projects.playedIdList,
			ppcs: null,
			t: this.triggers.toJson(),
			hms: this.handMaximumSize
		}
	}
	newGame(dto: PlayerProjectCardStateDTO): void {
		this.hand = dto.h
	}
	static fromJson(data: PlayerProjectCardStateDTO, injector: Injector): PlayerProjectCardStateModel {
		if (!data.h || !data.ppil || data.ppcs|| !data.t || !data.hms || !data.hd){
			throw new Error("Invalid PlayerProjectCardStateDTO: Missing required fields")
		}
		return new PlayerProjectCardStateModel(injector, data)
	}
	static empty(injector: Injector): PlayerProjectCardStateModel {
		return new PlayerProjectCardStateModel(
			injector,
			{
				h: [],
				hc: [],
				hd: [],
				hms: GAME_HAND_MAXIMUM_SIZE,
				ppil: [],
				ppcs: [],
				t: {aci: [], acmt: [], aogt: [], aopc: [], aopi: [], aoratc: [], pci: []}
			}
		)
	}
}
