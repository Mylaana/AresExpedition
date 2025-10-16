import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum"
import { BuilderOption, DeckQueryOptionsEnum, EffectPortalEnum } from "../enum/global.enum"
import { EventCardSelectorSubType } from "../types/event.type"
import { NonEventButtonNames, TagType } from "../types/global.type"
import { AdvancedRessourceStock, GlobalParameterValue, MoonTile, RessourceStock, ScanKeep } from "./global.interface"

export interface EventStateDTO {
	o: EventStateOriginEnum
	t: EventStateTypeEnum
	v: any
}
export interface EventStateContentDTO {}
export interface EventStateBuilderContentDTO extends EventStateContentDTO {
	o: BuilderOption,
	s: BuilderStatusDTO[],
	ac: NonEventButtonNames[] // alternative cost used
	d: number // discount
}
export interface EventStateContentOceanFlippedDTO extends EventStateContentDTO {
	MEGACREDIT?: number,
	CARD?: number,
	PLANT?: number
}
export interface EventStateContentDrawResultDTO extends EventStateContentDTO {
	cl: string[]
	td: number
}
export interface EventStateContentDiscardDTO extends EventStateContentDTO {
	d: number
}
export interface EventStateContentResearchCardsQueriedDTO extends EventStateContentDTO {
	keep: number
	cards: string[]
}
export interface EventStateContentDrawQueryDTO extends EventStateContentDTO {
	d: number
}
export interface EventStateContentDrawQueryThenDiscardDTO extends EventStateContentDTO {
	dr: number
	di: number
}
export interface EventStateContentScanKeepQueriedDTO extends EventStateContentDTO {
	keep: number
	cards: string[]
	options: DeckQueryOptionsEnum
}
export interface EventStateContentScanKeepUnqueriedDTO extends EventStateContentDTO {
	scanKeep: Partial<ScanKeep> | undefined
	options: DeckQueryOptionsEnum | undefined
}
export interface EventStateContentTargetCardDTO extends EventStateContentDTO {
	cardId: string
	ressources: AdvancedRessourceStock | AdvancedRessourceStock [] | undefined
}
export interface EventStateIncreaseResearchScanKeep extends EventStateContentDTO {
	s: ScanKeep
}
export interface EventStateCardProduction extends EventStateContentDTO {
	cl: string[]
}
export interface EventStateGenericDTO extends EventStateContentDTO {
	igp?: GlobalParameterValue, // increase global parameter
	fo?: number //forest and oxygen
	tr?: number //add tr
	r?: RessourceStock | RessourceStock[] //add flat ressource
	u?: number // upgrade phase quantity
	l?: number[] | undefined // upgrade phase authorized list
	p?: RessourceStock | RessourceStock[] // increase production
	ep?: EffectPortalEnum // effect portal
	mt?: MoonTile | MoonTile[] // moon tile
}
export interface BuilderStatusDTO {
	l: boolean,
	cc: string | undefined
}
export interface EventStateActivator extends EventStateContentDTO {
	cl: {[key: string]: number}, //cardList
	ca: number //current doubleActivation count
	ma: number //max activation
	su: boolean //scan used
}
export interface EventStateContentTagSelectorDTO extends EventStateContentDTO {
	atl: TagType[]
	cc: string
}
export interface EventStateContentCardSelectorDTO extends EventStateContentDTO {
	st: EventCardSelectorSubType //type
}
export interface EventStateContentPhaseDTO extends EventStateContentDTO {
	pda: boolean //doubleProductionApplied
	cl: string[] //card List
}
