import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType } from "../../types/project-card.type"

type playedTrigger = {
    playedIdList: number[],
    playedIdListActive: number[], /*this is for when triggers have limited activation number, trigger detection
    effect uses this field.*/
    playedProjectList: ProjectCardModel[]
}
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
    checkStockable(ressourceType: AdvancedRessourceType): boolean {
        //add a check if ressource is stockable on this card
        return true
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
}
export class ProjectCardState {
    hand: number[] = []
    projects: playedProject = {
        playedIdList: [],
        playedProjectList: []
    }
    triggers: playedTrigger = {
        playedIdList: [],
        playedIdListActive: [],
        playedProjectList: []
    }
    maximum: number = 0

    playCard(card: ProjectCardModel): void {
        this.projects.playedIdList.push(card.id)
        this.projects.playedProjectList.push(card)

        if(card.cardSummaryType!='trigger'){return}
        this.triggers.playedIdList.push(card.id)
        this.triggers.playedIdListActive.push(card.id)
        this.triggers.playedProjectList.push(card)
		
    }
    getTriggersIdList(): number[] {
        return this.triggers.playedIdList
    }
    getTriggersIdListActive(): number[] {
        return this.triggers.playedIdListActive
    }
    getTriggersPlayedList(): ProjectCardModel[] {
        return this.triggers.playedProjectList
    }
    setTriggerAsInactive(triggerId: number): void {
        this.triggers.playedIdListActive = this.triggers.playedIdListActive.filter((e, i) => e !== triggerId); 
    }
    getProjectIdList(): number[] {
        return this.projects.playedIdList
    }
    getProjectPlayedList(): ProjectCardModel[] {
        return this.projects.playedProjectList
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
}