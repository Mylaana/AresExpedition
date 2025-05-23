import { RessourceInfo } from "../interfaces/global.interface"
import { PlayableCardModel } from "../models/cards/project-card.model"

export type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | 'mixedProduction' | undefined
export type CardType = 'redProject' | 'greenProject' | 'blueProject' | undefined | 'corporation'
export type CardTypeColor = 'red' | 'green' | 'blue' | 'corporation' | undefined
export type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr' | undefined
export type PrerequisiteTresholdType = 'min' | 'max' | undefined
export type CostMod = {tagList?:number[], steelState?: RessourceInfo, titaniumState?: RessourceInfo, playedTriggersList?: number[], buildDiscount?: number}
export type ProjectFilterType = undefined | "development" | "construction" | "action" | 'stockable'
export type PlayedProject = {
    playedIdList: number[],
    playedProjectList: PlayableCardModel[]
}
export type TriggerLimit = {
    value: number,
    limit: number
}

export type ProjectListType = 'none' | 'hand' | 'played' | 'selector' | 'builderSelector' | 'builderSelectedZone' | 'playedSelector'
export type ProjectListSubType = 'none' |'sell' | 'research' | 'recycleStartingProject' | 'selectCorporation'
