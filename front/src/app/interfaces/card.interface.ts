import { AdvancedRessourceType } from "../types/global.type"
import { SummaryType, CardType, PrerequisiteTresholdType, PrerequisiteType } from "../types/project-card.type"
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
	effectSummaryText: string
	effectText: string
	effectSummaryType: SummaryType
}

export interface PlayableCardInterface {
	id: number
	cardCode: string
	origin: string
	costInitial: number
	tagsId: number[]
	cardType: CardType
	vpNumber?: string
	prerequisiteTresholdType?: PrerequisiteTresholdType
	prerequisiteType?: PrerequisiteType
	prerequisiteTresholdValue?: number
	phaseUp?: string
	phaseDown?: string
	title: string
	vpText?: string
	effectSummaryText?: string
	effectText?: string
	cardSummaryType?: SummaryType
	effects: PlayableCardEffect[]
	playedText?: string
	prerequisiteText?: string
	prerequisiteSummaryText?: string
	prerequisiteTagId?: number
	stock?: AdvancedRessourceStock[]
	stockable?: AdvancedRessourceType[]
	startingMegacredits?: number
	status: string

	//not loaded from data

	//costMod?: number
	tagsUrl?: string[]

	//delete
	description?: string
}
export interface CardBuildable {
	costOk: boolean
	prerequisiteOk: boolean
}
