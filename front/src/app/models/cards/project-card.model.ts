import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType } from "../../types/project-card.type"

export class ProjectCardModel {
    id!: number;
    cardCode!: string;
    origin!: string;
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

    //not loaded from data

    costMod?: number;
    tagsUrl?: string[];

    //delete
    description?: string;
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

