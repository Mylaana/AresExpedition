import { RessourceInfo } from "../interfaces/global.interface"
import { ProjectCardModel } from "../models/cards/project-card.model"

export type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | undefined
export type CardType = 'redProject' | 'greenProject' | 'blueProject' | undefined
export type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr' | undefined
export type PrerequisiteTresholdType = 'min' | 'max' | undefined
export type CostMod = {tagList?:number[], steelState?: RessourceInfo, titaniumState?: RessourceInfo, playedTriggersList?: number[], buildDiscount?: number}
export type ProjectFilterType = undefined | "development" | "construction" | "action" | 'stockable'
export type PlayedProject = {
    playedIdList: number[],
    playedProjectList: ProjectCardModel[]
}
export type TriggerLimit = {
    value: number,
    limit: number
}

export type ProjectListType = 'none' | 'hand' | 'played' | 'selector' | 'builderSelector' | 'builderSelectedZone' | 'playedSelector'
export type ProjectListSubType = 'none' |'sell' | 'research' | 'startSelection'
