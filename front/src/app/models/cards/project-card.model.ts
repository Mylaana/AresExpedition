import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType, TriggerLimit} from "../../types/project-card.type"
import { ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardDTO, TriggerStateDTO } from "../../interfaces/dto/project-card-dto.interface"

export class ProjectCardModel {
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
    effectSummaryText?: string;
    effectText?: string;
    playedText?: string;
    prerequisiteText?: string;
    prerequisiteSummaryText?: string;
    prerequisiteTagId?: number;
	stock?: AdvancedRessourceStock[];
    stockable?: AdvancedRessourceType[]
    triggerLimit!: TriggerLimit
	activated!: number

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
                if(this.cardSummaryType==='action'){
                    return true
                }
                break
            }
            case('stockable'):{
                //converts filterValue into stockable name list
                if(!filter.value){return false}
                let filterValueList: any[] = []
                if(!Array.isArray(filter.value)){
                    filterValueList.push(filter.value)
                } else {
                    filterValueList = filter.value
                }

                for(let f of filterValueList){
                    if(this.checkStockable(f)){
                        return true
                    }
                }
                break
            }
        }
        return false
    }
	toDTO(): ProjectCardDTO {
		return {
			i: this.id,
			s: this.stock??[]
		}
	}
}

/**
 * This Class handles Blue project card with trigger effects
 */
export class TriggerState {
    playedCardsId: number[] = []
    activeCardsId: number[] = []
    activeOnRessourceAddedToCard: number[] = []
    activeOnParameterIncrease: number[] = []
    activeOnPlayedCard: number[] = []
    activeOnGainedTag: number[] = []
    activeCostModTrigger: number[] = []

	constructor(dto?: TriggerStateDTO){
		if(!dto){return}
		this.playedCardsId = dto.pci
		this.activeCardsId = dto.aci
		this.activeOnRessourceAddedToCard = dto.aoratc
		this.activeOnParameterIncrease = dto.aopi
		this.activeOnPlayedCard = dto.aopc
		this.activeOnGainedTag = dto.aogt
		this.activeCostModTrigger = dto.acmt
	}

    getPlayedTriggers(): number[] {
        return this.playedCardsId
    }
    getActivePlayedTriggers(): number[] {
        return this.activeCardsId
    }
    getOnRessourceAddedToCard(): number[] {
        return this.activeOnRessourceAddedToCard
    }
    getOnParameterIncrease(): number[] {
        return this.activeOnParameterIncrease
    }
    getOnPlayedCard(): number[] {
        return this.activeOnPlayedCard
    }
    getOnGainedTag(): number [] {
        return this.activeOnGainedTag
    }
    getCostMod(): number [] {
        return this.activeCostModTrigger
    }
    playTrigger(cardId: number): void {
        this.playedCardsId.push(cardId)
        this.activeCardsId.push(cardId)

        //adds played trigger to relevant lists
        this.addTriggerOnRessource(cardId)
        this.addTriggerOnParameter(cardId)
        this.addTriggerOnPlayedCard(cardId)
        this.addTriggerOnGainedTag(cardId)
        this.addTriggerToCostMod(cardId)
    }
    private addTriggerOnRessource(cardId: number): void {
        switch(cardId){
            case(222):{break} //Bacterial Aggregate
            default:{return}
        }
        this.activeOnRessourceAddedToCard.push(cardId)
    }
    private addTriggerOnParameter(cardId: number): void {
        switch(cardId){
            case(46):{break} //Physics Complex
            case(279):{break} //Pets
            default:{return}
        }
        this.activeOnParameterIncrease.push(cardId)
    }
    private addTriggerOnPlayedCard(cardId: number): void {
        switch(cardId){
            default:{return}
        }
        this.activeOnPlayedCard.push(cardId)
    }
    private addTriggerOnGainedTag(cardId: number): void {
        switch(cardId){
            case(25):{break} //Energy Subsidies
            case(37):{break} //Interplanetary Conference
            case(45):{break} //Optimal aerobreaking
            case(222):{break} //Bacterial Aggregate
            default:{return}
        }
        this.activeOnGainedTag.push(cardId)
    }
    private addTriggerToCostMod(cardId: number): void {
        switch(cardId){
            case(25):{break} //Energy Subsidies
            case(37):{break} //Interplanetary Conference
            default:{return}
        }
        this.activeCostModTrigger.push(cardId)
    }
    setTriggerInactive(cardId: number): void {
        this.activeCardsId = this.activeCardsId.filter((e, i) => e !== cardId)

        switch(cardId){
            //Bacterial Aggregate
            case(222):{
                this.activeOnRessourceAddedToCard = this.activeOnRessourceAddedToCard.filter((e, i) => e !== cardId)
                this.activeOnGainedTag = this.activeOnGainedTag.filter((e, i) => e !== cardId)
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
			aci: this.activeCardsId,
			acmt: this.activeCostModTrigger,
			aogt: this.activeOnGainedTag,
			aopc: this.activeOnPlayedCard,
			aopi: this.activeOnParameterIncrease,
			aoratc: this.activeOnRessourceAddedToCard,
			pci: this.playedCardsId
		}
	}
}
