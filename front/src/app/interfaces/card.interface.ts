import { AdvancedRessourceType } from "../types/global.type"
import { SummaryType, PrerequisiteTresholdType, PrerequisiteType, LocalizedText, CardType, CardTypeUndefined } from "../types/project-card.type"
import { AdvancedRessourceStock } from "./global.interface"

export interface CardState{
	selectable: boolean
	selected: boolean
	upgradable: boolean
	upgraded: boolean
	buildable: boolean
	activable: boolean
	ignoreCost: boolean
}

export interface PlayableCardEffect {
	effectSummaryText: LocalizedText
	effectText: LocalizedText
	effectSummaryType: SummaryType
}

export interface PlayableCardInterface {
	cardCode: string
	origin: string
	costInitial: number
	tagsId: number[]
	cardType: CardTypeUndefined
	vpNumber?: string
	prerequisiteTresholdType?: PrerequisiteTresholdType
	prerequisiteType?: PrerequisiteType
	prerequisiteTresholdValue?: number
	phaseUp?: string
	phaseDown?: string
	title: LocalizedText
	vpText?: LocalizedText
	effectSummaryText?: string
	effectText?: string
	cardSummaryType?: SummaryType
	effects: PlayableCardEffect[]
	playedText?: LocalizedText
	prerequisiteText?: LocalizedText
	prerequisiteSummaryText?: LocalizedText
	prerequisiteTagId?: number
	stock?: AdvancedRessourceStock[]
	stockable?: AdvancedRessourceType[]
	startingMegacredits?: number
	status: string,
	effectSummaryOption?: string,
    effectSummaryOption2?: string,
	scalingVp: boolean,
	actionCaption?: LocalizedText[]
	balancedVersion?: string

	//not loaded from data

	//costMod?: number
	tagsUrl?: string[]
}

export interface CardScalingVP {
	cardCode: string,
	vp: number
}

export interface CardStats {
	code: string,
	played: number,
	win: number,
	type: CardType,
	winrate: number
	score: number
	duration: number
}
