import { RessourceInfo } from "../interfaces/global.interface"
import { PlayableCardModel } from "../models/cards/project-card.model"
import { PlayedCardStocksDTO } from "../interfaces/dto/project-card-dto.interface"
import { SettingSupportedLanguage } from "./global.type"

export type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | 'mixedProduction' | undefined
export type CardTypeUndefined = undefined | CardType
export type CardTypeColor = 'red' | 'green' | 'blue' | 'corporation' | undefined
export type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr' | undefined
export type PrerequisiteTresholdType = 'min' | 'max' | undefined
export type CostMod = {tagList?:number[], steelState?: RessourceInfo, titaniumState?: RessourceInfo, playedTriggersList?: string[], buildDiscount?: number}
export type PlayedProject = {
	playedIdList: string[],
    playedProjectList: PlayableCardModel[]
}
export type TriggerLimit = {
	value: number,
    limit: number
}

export type ProjectListType = 'none' | 'hand' | 'played' | 'selector' | 'builderSelector' | 'builderSelectedZone' | 'playedSelector' | 'cardOverviewBalanced' | 'statsRoute'
export type ProjectListSubType = 'none' | 'sell' | 'research' | 'recycleStartingProject' | 'selectCorporation' | 'selectMerger' | 'discard' | 'addRessource' | 'scanKeepResult' | 'repeatProduction'
export type PlayedCardDTO = {[key: string]: PlayedCardStocksDTO}
export type ActivationOption = 1 | 2
export type LocalizedText = Partial<Record<SettingSupportedLanguage, string>>;
export type StatsRanking = 'descending' | 'ascending'
export type StatsCardSubFamily = 'activableProject' | 'triggerProject'
export type CardType = 'redProject' | 'greenProject' | 'blueProject' | 'corporation' | 'triggerProject' | 'activableProject' | 'project' | 'blueProject'
export type ListBehavior = 'display' | 'selector' | 'activator'