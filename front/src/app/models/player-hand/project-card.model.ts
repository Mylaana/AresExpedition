type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | undefined
type CardType = 'redProject' | 'greenProject' | 'blueProject'
type ConditionType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr'
type conditionTresholdType = 'min' | 'max'

export class ProjectCardModel {
    id!: number;
    cost!: number;
    costMod?: number;
    title!: string;
    tagsId!: number[];
    tagsUrl?: string[];
    cardSummaryType?: SummaryType;
    cardType!: CardType;
    vp?: string;
    conditionType?: ConditionType;
    conditionTagId?: number;
    conditionTresholdType?: conditionTresholdType;
    conditionTresholdValue?: number;
}