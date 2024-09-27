import { RessourceState } from "../interfaces/global.interface"
export type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | undefined
export type CardType = 'redProject' | 'greenProject' | 'blueProject' | undefined
export type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr' | undefined
export type PrerequisiteTresholdType = 'min' | 'max' | undefined
export type CostMod = {tagList?:number[], steelState?: RessourceState, titaniumState?: RessourceState, playedTriggersList?: number[]}
export type ProjectFilterType = undefined | "development" | "construction" | "action" | 'stockable'