type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | undefined
type CardType = 'redProject' | 'greenProject' | 'blueProject'
type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr'
type PrerequisiteTresholdType = 'min' | 'max'


export class ProjectCardModel {
    id!: number;
    cost!: number;
    costMod?: number;
    title!: string;
    tagsId!: number[];
    tagsUrl?: string[];
    cardSummaryType?: SummaryType;
    cardType!: CardType;
    vpNumber?: string;
    description?: string;
    descriptionVp?: string;
    descriptionSummary?: string;
    descriptionEffect?: string;
    descriptionPlayed?: string;
    descriptionPrerequisite?: string;
    descriptionPrerequisiteSummary?: string;
    prerequisiteType?: PrerequisiteType;
    prerequisiteTagId?: number;
    prerequisiteTresholdType?: PrerequisiteTresholdType;
    prerequisiteTresholdValue?: number;
}
/**
export class CardSelector {
    selectFrom!: ProjectCardModel[];
    selectedIdList!: number[];
    selectionQuantity!: number;
    phaseFilter?: PhaseFilter

    constructor(){
        this.selectionQuantity = 3
    }
    resetSelectionVariables():void{
        this.selectedIdList = []
        this.selectFrom = []
        this.selectionQuantity = 0
        this.phaseFilter = undefined
    }
    getLength(): number {
        return this.selectFrom.length
    }
} */

