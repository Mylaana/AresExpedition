import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType, TagType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType, TriggerLimit, PlayedCardStock} from "../../types/project-card.type"
import { ProjectFilter } from "../../interfaces/global.interface"
import {  TriggerStateDTO } from "../../interfaces/dto/project-card-dto.interface"
import { PlayableCardEffect, PlayableCardInterface } from "../../interfaces/card.interface"
import { Utils } from "../../utils/utils"
import { ProjectFilterNameEnum } from "../../enum/global.enum"

export class PlayableCardModel{
    cardCode!: string;
    origin!: string;
    costInitial!: number;
	cost!: number;
    tagsId!: number[];
    cardSummaryType?: SummaryType;
    cardType!: CardType;
    vpNumber?: string;
    prerequisiteTresholdType?: PrerequisiteTresholdType;
    prerequisiteType?: PrerequisiteType;
    prerequisiteTresholdValue?: number;
    phaseUp?: string;
    phaseDown?: string;
    title!: string;
    vpText?: string;
	effects: PlayableCardEffect[] = []
    effectSummaryText?: string;
    effectText?: string;
    playedText?: string;
    prerequisiteText?: string;
    prerequisiteSummaryText?: string;
    prerequisiteTagId?: number;
	stock?: AdvancedRessourceStock[];
    stockable?: AdvancedRessourceType[]
    triggerLimit!: TriggerLimit
	activated: number = 0
	startingMegacredits?: number
	status!: string
    effectSummaryOption!: string
    effectSummaryOption2!: string
	scalingVp!: boolean
	additionalTags!: number[]

    //not loaded from data

    //costMod?: number;
    tagsUrl?: string[];

    //delete
    description?: string;

    getCardTriggerLimit(): TriggerLimit | undefined{
        return this.triggerLimit
    }
	setCardTriggerLimit(limit: TriggerLimit){
		this.triggerLimit = limit
	}
    addRessourceToStock(ressource: AdvancedRessourceStock): void {
        if(this.checkStockable(ressource.name)===false){return}
        if(this.checkStockExists(ressource.name)===false){
            this.setInitialStock(ressource.name)
        }
        if(!this.stock){return}

        for(let s of this.stock){
            if(s.name===ressource.name){
                s.valueStock += ressource.valueStock
            }
        }
    }
    checkStockable(ressourceType: any): boolean {
        //add a check if ressource is stockable on this card
        if(this.stockable===undefined || this.stockable.length===0){return false}
        return this.stockable.includes(ressourceType)
    }
    checkStockExists(ressource:AdvancedRessourceType): boolean {
        if(!this.stock){return false}

        for(let s of this.stock){
            if(s.name===ressource){
                return true
            }
        }
        return false
    }
    setInitialStock(ressource: AdvancedRessourceType): void {
        if(!this.stock){
            this.stock = []
        }
        this.stock.push({name: ressource,valueStock: 0})
    }
    getStockValue(ressourceName:AdvancedRessourceType): number {
        if(!this.stock){return 0}
        for(let s of this.stock){
            if(s.name===ressourceName){
                return s.valueStock
            }
        }
        return 0
    }
    isFilterOk(filter: ProjectFilter): boolean {
        switch(filter.type){
            case(ProjectFilterNameEnum.greenProject):{
                if(this.cardType==='greenProject'){
                    return true
                }
                break
            }
            case(ProjectFilterNameEnum.blueOrRedProject):{
                if(this.cardType!='greenProject'){
                    return true
                }
                break
            }
            case(ProjectFilterNameEnum.action):{
				return this.hasSummaryType('action')
            }
            case(ProjectFilterNameEnum.stockable):{
                //converts filterValue into stockable name list
                if(!filter.stockableType){return false}
                let filterValueList: any[] = []
                if(!Array.isArray(filter.stockableType)){
                    filterValueList.push(filter.stockableType)
                } else {
                    filterValueList = filter.stockableType
                }

                for(let f of filterValueList){
                    if(this.checkStockable(f)){
                        return true
                    }
                }
                break
            }
			case(ProjectFilterNameEnum.blueProject):{
				return this.cardType === 'blueProject'
			}
			case(ProjectFilterNameEnum.hasTagEvent):{
				return this.hasTag('event')
			}
			case(ProjectFilterNameEnum.hasTagPlantOrScience):{
				return this.hasTag('science') || this.hasTag('plant')
			}
			case(ProjectFilterNameEnum.green9MCFree):{
				if(this.costInitial <= 9 && this.cardType==='greenProject'){return true}
				break
			}
			case(ProjectFilterNameEnum.maiNiProductions):{
				if(this.costInitial <= 12){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayCorpsAndActivable):{
				if(this.cardType==='corporation'){return true}
				if(this.cardType==='blueProject' && this.hasSummaryType('action')){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayTriggers):{
				if(this.cardType==='blueProject' && this.hasSummaryType('trigger')){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayRed):{
				if(this.cardType==='redProject'){return true}
				break
			}
			case(ProjectFilterNameEnum.developmentPhaseSecondBuilder):{
				if(this.cardType!='greenProject'){return false}
				return this.costInitial<=12
			}
        }
        return false
    }
	private hasSummaryType(summaryType: SummaryType): boolean {
		for(let effect of this.effects){
			if(effect.effectSummaryType===summaryType){return true}
		}
		return false
	}
	hasTrigger(): boolean {
		return this.hasSummaryType('trigger')
	}
	hasTagId(tagId: number): boolean {
		for(let t of this.tagsId){
			if(t===tagId){
				return true
			}
		}
		return false
	}
	hasTag(tag: TagType): boolean {
		return this.hasTagId(Utils.toTagId(tag))
	}
	toDTO(): PlayedCardStock {
		return {[this.cardCode]: this.stock??[]}
	}
	public static fromInterface(input: PlayableCardInterface): PlayableCardModel {
		let newCard: PlayableCardModel = Object.assign(new PlayableCardModel(), Utils.jsonCopy(input))
		newCard.cost = newCard.costInitial
		return newCard
	}
	loadStockFromJson(stock: AdvancedRessourceStock[]){
		this.stock = stock
	}
}

/**
 * This Class handles Blue project card with trigger effects
 */
export class TriggerState {
    playedCards: string[] = []
    activeCards: string[] = []
    activeCostModTrigger: string[] = []

	constructor(dto?: TriggerStateDTO){
		if(!dto){return}
		this.playedCards = dto.p
		this.activeCards = dto.a
	}

    getPlayedTriggers(): string[] {
        return this.playedCards
    }
    getActivePlayedTriggers(): string[] {
        return this.activeCards
    }
    getCostMod(): string[] {
        return this.activeCostModTrigger
    }
    playTrigger(cardCode: string): void {
        this.playedCards.push(cardCode)
        this.activeCards.push(cardCode)
    }
    setTriggerInactive(cardCode: string): void {
        this.activeCards = this.activeCards.filter((e, i) => e !== cardCode)
    }
	public static fromJson(data: TriggerStateDTO): TriggerState {
		if (!data.a || !data.p){
			throw new Error("Invalid TriggerStateDTO: Missing required fields")
		}
		return new TriggerState(data)
	}
	public toJson(): TriggerStateDTO {
		return {
			a: this.activeCards,
			p: this.playedCards
		}
	}
}
