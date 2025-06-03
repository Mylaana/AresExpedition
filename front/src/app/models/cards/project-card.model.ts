import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType, TriggerLimit, PlayedCardStock} from "../../types/project-card.type"
import { ProjectFilter } from "../../interfaces/global.interface"
import { PlayedCardDTO, TriggerStateDTO } from "../../interfaces/dto/project-card-dto.interface"
import { PlayableCardEffect, PlayableCardInterface } from "../../interfaces/card.interface"
import { Utils } from "../../utils/utils"

export class PlayableCardModel{
    id!: number;
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

    //not loaded from data

    //costMod?: number;
    tagsUrl?: string[];

    //delete
    description?: string;

    getCardTriggerLimit(): TriggerLimit | undefined{
        return this.triggerLimit
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
            case('development'):{
                if(this.cardType==='greenProject'){
                    return true
                }
                break
            }
            case('construction'):{
                if(this.cardType!='greenProject'){
                    return true
                }
                break
            }
            case('action'):{
				return this.hasSummaryType('action')
            }
            case('stockable'):{
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
			case('blueProject'):{
				return this.cardType === 'blueProject'
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
	toDTO(): PlayedCardStock {
		return {[this.id]: this.stock??[]}
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
    activeOnRessourceAddedToCard: string[] = []
    activeOnParameterIncrease: string[] = []
    activeOnPlayedCard: string[] = []
    activeOnGainedTag: string[] = []
    activeCostModTrigger: string[] = []

	constructor(dto?: TriggerStateDTO){
		if(!dto){return}
		this.playedCards = dto.pci
		this.activeCards = dto.aci
		this.activeOnRessourceAddedToCard = dto.aoratc
		this.activeOnParameterIncrease = dto.aopi
		this.activeOnPlayedCard = dto.aopc
		this.activeOnGainedTag = dto.aogt
		this.activeCostModTrigger = dto.acmt
	}

    getPlayedTriggers(): string[] {
        return this.playedCards
    }
    getActivePlayedTriggers(): string[] {
        return this.activeCards
    }
    getOnRessourceAddedToCard(): string[] {
        return this.activeOnRessourceAddedToCard
    }
    getOnParameterIncrease(): string[] {
        return this.activeOnParameterIncrease
    }
    getOnPlayedCard(): string[] {
        return this.activeOnPlayedCard
    }
    getOnGainedTag(): string[] {
        return this.activeOnGainedTag
    }
    getCostMod(): string[] {
        return this.activeCostModTrigger
    }
    playTrigger(cardCode: string): void {
        this.playedCards.push(cardCode)
        this.activeCards.push(cardCode)

        //adds played trigger to relevant lists
        this.addTriggerOnRessource(cardCode)
        this.addTriggerOnParameter(cardCode)
        this.addTriggerOnPlayedCard(cardCode)
        this.addTriggerOnGainedTag(cardCode)
        this.addTriggerToCostMod(cardCode)
    }
    private addTriggerOnRessource(cardCode: string): void {
        switch(cardCode){
            case('P19'):{break} //Bacterial Aggregate
			case('P04'):{break} //Filter Feeders
            default:{return}
        }
        this.activeOnRessourceAddedToCard.push(cardCode)
    }
    private addTriggerOnParameter(cardCode: string): void {
        switch(cardCode){
			case('8'):{break} //Arctic Algae
			case('30'):{break} //Fish
			case('33'):{break} //Herbivore
			case('39'):{break} //Herbivore
            case('46'):{break} //Physics Complex
			case('F07'):{break} //Pets

			case('CP06'):{break} //Zetasel
            default:{return}
        }
        this.activeOnParameterIncrease.push(cardCode)
    }
    private addTriggerOnPlayedCard(cardCode: string): void {
        switch(cardCode){
			case('6'):{break} //Antigravity Technology
            default:{return}
        }
        this.activeOnPlayedCard.push(cardCode)
    }
    private addTriggerOnGainedTag(cardCode: string): void {
        switch(cardCode){
			case('19'):{break} //Decomposers
			case('24'):{break} //Ecological Zone
            case('25'):{break} //Energy Subsidies
            case('37'):{break} //Interplanetary Conference
			case('44'):{break} //Olympus Conference
            case('45'):{break} //Optimal aerobreaking
			case('48'):{break} //Recycled Detritus
            case('P19'):{break} //Bacterial Aggregate

			case('C8'):{break} //Saturn Systems
			case('CP01'):{break} //Arklight
			case('CF1'):{break} //Point Luna
            default:{return}
        }
        this.activeOnGainedTag.push(cardCode)
    }
    private addTriggerToCostMod(cardCode: string): void {
        switch(cardCode){
			case('23'):{break} //Earth Catapult
            case('25'):{break} //Energy Subsidies
            case('37'):{break} //Interplanetary Conference
			case('42'):{break} //Media Group
			case('51'):{break} //Research Outpost

			case('C1'):{break} //CreditCor
			case('C4'):{break} //Interplanetary Cinematics
			case('C9'):{break} //Teractor
			case('C11'):{break} //Thorgate
            default:{return}
        }
        this.activeCostModTrigger.push(cardCode)
    }
    setTriggerInactive(cardCode: string): void {
        this.activeCards = this.activeCards.filter((e, i) => e !== cardCode)

        switch(cardCode){
            //Bacterial Aggregate
            case('P19'):{
                this.activeOnRessourceAddedToCard = this.activeOnRessourceAddedToCard.filter((e, i) => e !== cardCode)
                this.activeOnGainedTag = this.activeOnGainedTag.filter((e, i) => e !== cardCode)
                break
            }
        }
    }
	public static fromJson(data: TriggerStateDTO): TriggerState {
		if (!data.aci || !data.acmt || !data.aogt|| !data.aopc || !data.aopi || !data.aoratc || !data.pci){
			throw new Error("Invalid TriggerStateDTO: Missing required fields")
		}
		return new TriggerState(data)
	}
	public toJson(): TriggerStateDTO {
		return {
			aci: this.activeCards,
			acmt: this.activeCostModTrigger,
			aogt: this.activeOnGainedTag,
			aopc: this.activeOnPlayedCard,
			aopi: this.activeOnParameterIncrease,
			aoratc: this.activeOnRessourceAddedToCard,
			pci: this.playedCards
		}
	}
}
