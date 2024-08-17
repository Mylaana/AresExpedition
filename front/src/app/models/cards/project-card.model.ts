import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType } from "../../types/project-card.type"

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
	stock!: any;

    //not loaded from data

    costMod?: number;
    tagsUrl?: string[];

    //delete
    description?: string;

}
