import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType} from "../../types/project-card.type"
import { ProjectFilter } from "../../interfaces/global.interface"
import { ProjectCardInfoService } from "../../services/cards/project-card-info.service"

type playedProject = {
    playedIdList: number[],
    playedProjectList: ProjectCardModel[]
}

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

    //not loaded from data

    costMod?: number;
    tagsUrl?: string[];

    //delete
    description?: string;

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
}
export class ProjectCardState {
    hand: number[] = []
    projects: playedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    triggers = new TriggerState
    maximum: number = 0

    constructor(private cardInfo: ProjectCardInfoService){}

    playCard(card: ProjectCardModel): void {
        this.projects.playedIdList.push(card.id)
        this.projects.playedProjectList.push(card)
        
        if(card.cardSummaryType!='trigger'){return}
        this.triggers.playTrigger(card.id)
    }
    getPlayedTriggersId(): number[] {
        return this.triggers.getPlayedTriggers()
    }
    getActivePlayedTriggersId(): number[] {
        return this.triggers.getActivePlayedTriggers()
    }
    getTriggersOnRessourceAddedToCardId(): number[] {
        return this.triggers.getOnRessourceAddedToCard()
    }
    getTriggersOnParameterIncreaseId(): number[] {
        return this.triggers.getOnParameterIncrease()
    }
    getTriggersOnPlayedCard(): number[] {
        return this.triggers.getOnPlayedCard()
    }
    getTriggersOnGainedTag(): number[] {
        return this.triggers.getOnGainedTag()
    }
    getTriggerCostMod(): number[] {
        return this.triggers.getCostMod()
    }
    setTriggerAsInactive(triggerId: number): void {
        this.triggers.setTriggerInactive(triggerId)
    }
    getProjectIdList(): number[] {
        return this.projects.playedIdList
    }
    getProjectPlayedList(filter?: ProjectFilter): ProjectCardModel[] {
        if(!filter){return this.projects.playedProjectList}
        
        let projectList:ProjectCardModel[] = []

        for(let card of this.projects.playedProjectList){
            if(card.isFilterOk(filter)===true){
                projectList.push(card)
            }
        }
        return projectList
    }
    getPlayedProjectCardFromId(cardId: number): ProjectCardModel | undefined {
        for(let card of this.projects.playedProjectList){
            if(card.id===cardId){
                return card
            }
        }
        return
    }
    addRessourceToCard(cardId: number, ressource: AdvancedRessourceStock ): void {
        let card = this.getPlayedProjectCardFromId(cardId)
        if(!card){return}
        card.addRessourceToStock(ressource)
    }
    getCardStockValue(cardId:number, ressourceName: AdvancedRessourceType): number {
        let result = this.getPlayedProjectCardFromId(cardId)?.getStockValue(ressourceName)
        if(!result){return 0}
        return result
    }
    getHandId(): number[] {
        return this.hand
    }
    getHandProject(): ProjectCardModel[] {
        return this.cardInfo.getProjectCardList(this.hand)
    }
}

/**
 * This Class handles Blue project card with trigger effects
 */
class TriggerState {
    playedCardsId: number[] = []
    activeCardsId: number[] = []
    activeOnRessourceAddedToCard: number[] = []
    activeOnParameterIncrease: number[] = []
    activeOnPlayedCard: number[] = []
    activeOnGainedTag: number[] = []
    activeCostModTrigger: number[] = []

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
    }
    addTriggerOnRessource(cardId: number): void {
        switch(cardId){
            case(222):{break} //Bacterial Aggregate
            default:{return}
        }
        this.activeOnRessourceAddedToCard.push(cardId)
    }

    
    addTriggerOnParameter(cardId: number): void {
        switch(cardId){
            case(46):{break} //Physics Complex
            case(279):{break} //Pets
            default:{return}
        }
        this.activeOnParameterIncrease.push(cardId)
    }
    addTriggerOnPlayedCard(cardId: number): void {
        switch(cardId){
            default:{return}
        }
        this.activeOnPlayedCard.push(cardId)
    }
    addTriggerOnGainedTag(cardId: number): void {
        switch(cardId){
            case(25):{break} //Energy Subsidies
            case(37):{break} //Interplanetary Conference
            case(45):{break} //Optimal aerobreaking
            case(222):{break} //Bacterial Aggregate
            default:{return}
        }
        this.activeOnGainedTag.push(cardId)
    }
    addCostModTrigger(cardId: number): void {
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
}