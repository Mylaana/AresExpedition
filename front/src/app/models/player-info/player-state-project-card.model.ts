import { Injector } from "@angular/core"
import { GAME_HAND_MAXIMUM_SIZE } from "../../global/global-const"
import { PlayerProjectCardStateDTO } from "../../interfaces/dto/player-state-dto.interface"
import { AdvancedRessourceStock, GlobalParameterOffset, ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service"
import { AdvancedRessourceType, PlayableCardType } from "../../types/global.type"
import { PlayedCardStock, PlayedProject } from "../../types/project-card.type"
import { Utils } from "../../utils/utils"
import { PlayableCardModel, TriggerState } from "../cards/project-card.model"
import { EventStateActivator } from "../../interfaces/event-state.interface"
import { GlobalParameterNameEnum, ProjectFilterNameEnum } from "../../enum/global.enum"
import { TRIGGER_LIMIT } from "../../maps/playable-card-maps"

export class PlayerProjectCardStateModel {
    private hand: string[] = []
	private handCorporation: string[] = []
	private handDiscard: string[] = []
    private projects: PlayedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    private triggers = new TriggerState
	private handMaximumSize

	private cardInfoService: ProjectCardInfoService
	private prerequisiteOffset: Map<GlobalParameterNameEnum, number> = new Map


    constructor(private injector: Injector, dto: PlayerProjectCardStateDTO,
	){
		this.cardInfoService = this.injector.get(ProjectCardInfoService)

		this.hand = dto.h,
		this.handCorporation = dto.hc,
		this.handMaximumSize = dto.hms

		this.loadPlayedCardsFromJson(dto.cp)
		this.triggers = TriggerState.fromJson(dto.t)
		this.prerequisiteOffset = new Map<GlobalParameterNameEnum, number>(
			Object.entries(dto.o).map(([key, value]) => [key as GlobalParameterNameEnum, value])
		)
	}

    playCard(card: PlayableCardModel): void {
        this.projects.playedIdList.push(card.cardCode)
		let cardCopy = this.cardInfoService.getCardById(card.cardCode)
		if(!cardCopy){return}
        this.projects.playedProjectList.push(cardCopy)

        if(!cardCopy.hasTrigger()){return}
        this.triggers.playTrigger(cardCopy.cardCode)
		let limitFunction = TRIGGER_LIMIT[cardCopy.cardCode]
		if(!limitFunction){return}
		cardCopy.setCardTriggerLimit(limitFunction())
    }
	addCardsToHand(cards: string | string[]){this.hand = this.hand.concat(Utils.toArray(cards))}
	addCardsToDiscard(cards: string | string[]){this.handDiscard = this.handDiscard.concat(Utils.toArray(cards))}
	removeCardsFromHand(cards: string | string[], cardType: PlayableCardType, addRemovedCardsToDiscard: boolean = true):void{
		let cardList = Utils.toArray(cards)
		for(let card of cardList){
			switch(cardType){
				case('project'):{
					let index = this.hand.indexOf(card, 0);
					let discarded = this.hand.splice(index, 1)[0]
					if (index > -1 && addRemovedCardsToDiscard) {
						this.addCardsToDiscard(discarded)
					}
					break
				}
				case('corporation'):{
					let index = this.handCorporation.indexOf(card, 0);
					let discarded = this.handCorporation.splice(index, 1)[0]
					break
				}
			}

		}
	}
	removeCorporationsFromHand(){
		this.handCorporation = []
	}
	getHandCurrentSize(): number {return this.hand.length}
	getHandMaximumSize(): number {return this.handMaximumSize}
    getPlayedTriggersId(): string[] {return this.triggers.getPlayedTriggers()}
    getActivePlayedTriggersId(): string[] {return this.triggers.getActivePlayedTriggers()}
    setTriggerInactive(triggerId: string): void {this.triggers.setTriggerInactive(triggerId)}
    getProjectPlayedIdList(filter?: ProjectFilter): string[] {return this.filterCardIdList(this.projects.playedIdList, filter)}
    getProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.filterCardModelList(this.projects.playedProjectList, filter)}
    getProjectPlayedModelFromCode(cardCode: string): PlayableCardModel | undefined {
        for(let card of this.projects.playedProjectList){
            if(card.cardCode===cardCode){
                return card
            }
        }
        return
    }
    addRessourceToCard(cardCode: string, ressource: AdvancedRessourceStock ): void {
        let card = this.getProjectPlayedModelFromCode(cardCode)
        if(!card){return}
        card.addRessourceToStock(ressource)
    }
    getCardStockValue(cardCode:string, ressourceName: AdvancedRessourceType): number {
        let result = this.getProjectPlayedModelFromCode(cardCode)?.getStockValue(ressourceName)
        if(!result){return 0}
        return result
    }
    getProjectHandIdList(filter?: ProjectFilter): string[] {return this.filterCardIdList(this.hand, filter)}
	getCorporationHandIdList(): string[] {return this.handCorporation}

	setPrerequisiteOffset(offset: GlobalParameterOffset | GlobalParameterOffset[]) {
		let offsets: GlobalParameterOffset[] = Utils.toArray(offset)
		for(let newOffset of offsets){
			let currentOffset = this.prerequisiteOffset.get(newOffset.name)
			if(!currentOffset || currentOffset && currentOffset<newOffset.offset){
				this.prerequisiteOffset.set(newOffset.name, newOffset.offset)
			}
		}
	}
	getPrerequisiteOffset(parameter: GlobalParameterNameEnum): number {
		return this.prerequisiteOffset.get(parameter)??0
	}
	private filterCardModelList(cards: PlayableCardModel[],  filter: ProjectFilter | undefined, returnOnlyFirst: boolean = false): PlayableCardModel[] {
        if(!filter){return cards}
		let projectList:PlayableCardModel[] = []
        for(let card of cards){
            if(card.isFilterOk(filter)===true){
                projectList.push(card)
				if(returnOnlyFirst){return projectList}
            }
        }
        return projectList
	}
	private filterCardIdList(cards:string[], filter: ProjectFilter | undefined): string[] {
		if(!filter){return cards}
		let projectList:PlayableCardModel[] = this.filterCardModelList(this.cardInfoService.getProjectCardList(cards), filter)
		let idList: string[] = []

		for(let project of projectList){
			idList.push(project.cardCode)
		}
		return idList
	}

	loadEventStateActivator(dto: EventStateActivator){
		const raw = dto.cl;

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
	hasProjectPlayedOfFilterType(filter: ProjectFilter): boolean {
		return this.filterCardModelList(this.projects.playedProjectList, filter).length>0
	}
	getProjectPlayedStock(cardCode:string): AdvancedRessourceStock[]{
		return this.getProjectPlayedModelFromCode(cardCode)?.stock??[]
	}
	getPlayedListWithStockableTypes(stockType: AdvancedRessourceType | AdvancedRessourceType[]): PlayableCardModel[] {
		return this.filterCardModelList(this.projects.playedProjectList, {type:ProjectFilterNameEnum.stockable, stockableType:stockType})
	}
	private loadCardActivationCount(cardId: string, activationCount: number){
		for(let card of this.projects.playedProjectList){
			if(card.cardCode.toString()===cardId){
				card.activated = activationCount
				return
			}
		}
	}
	getPlayedCorporations(): PlayableCardModel[] {
		return this.getProjectPlayedModelList({type:ProjectFilterNameEnum.corporations})
	}
	removeCardFromPlayed(card: PlayableCardModel){
		this.projects.playedIdList = this.projects.playedIdList.filter((el) => el!=card.cardCode)
		this.projects.playedProjectList = this.projects.playedProjectList.filter((el) => el!=card)
	}
	toJson(): PlayerProjectCardStateDTO {
		return {
			h: this.hand,
			hc: this.handCorporation,
			hd: this.handDiscard,
			cp: this.projectCardPlayedStockToJson(),
			t: this.triggers.toJson(),
			hms: this.handMaximumSize,
			o: this.prerequisiteOffsetToJson()
		}
	}
	private projectCardPlayedStockToJson(): PlayedCardStock[] {
		let result: PlayedCardStock[] = []
		for(let card of this.getProjectPlayedModelList()){
			result.push(card.toDTO())
		}

		return result
	}
	private prerequisiteOffsetToJson(): {[key: string]: number} {
		let dto: {[key: string]: number} = Object.fromEntries(this.prerequisiteOffset)
		return dto
	}
	newGame(dto: PlayerProjectCardStateDTO): void {
		this.hand = dto.h
	}
	static fromJson(data: PlayerProjectCardStateDTO, injector: Injector): PlayerProjectCardStateModel {
		if (!data.h|| data.cp|| !data.t || !data.hms || !data.hd){
			throw new Error("Invalid PlayerProjectCardStateDTO: Missing required fields")
		}
		return new PlayerProjectCardStateModel(injector, data)
	}
	private cardPlayedIdListFromJson(dto: PlayedCardStock[]): number[] {
		if(!dto){return []}
		let list: number[] = []
		for (const stockMap of dto) {
			for (const key in stockMap) {
				const numericKey = parseInt(key)
				const value = stockMap[numericKey]
				list.push(numericKey)
			}
		}
		return list
	}
	private loadPlayedCardsFromJson(dto: PlayedCardStock[]) {
		if(!dto){return}
		let playedIdList: string[] = []
		let playedModelList: PlayableCardModel[] = []
		for (let stockMap of dto) {
			for (let key in stockMap) {
				let value = stockMap[key]
				playedIdList.push(key)
				let card = this.cardInfoService.getCardById(key)
				if(!card){continue}
				card.loadStockFromJson(value)
				playedModelList.push(card)
			}
		}
		this.projects = {
			playedIdList: playedIdList,
			playedProjectList: playedModelList
		}
	}
	static empty(injector: Injector): PlayerProjectCardStateModel {
		return new PlayerProjectCardStateModel(
			injector,
			{
				h: [],
				hc: [],
				hd: [],
				hms: GAME_HAND_MAXIMUM_SIZE,
				cp: [],
				t: {a: [], p: []},
				o: {}
			}
		)
	}
}
