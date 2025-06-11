import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum"
import { BuilderOption, DeckQueryOptionsEnum } from "../enum/global.enum"
import { AdvancedRessourceStock, ScanKeep } from "./global.interface"

export interface EventStateDTO {
	o: EventStateOriginEnum
	t: EventStateTypeEnum
	v: any
}
export interface EventStateContentDTO {}
export interface EventStateBuilderContentDTO extends EventStateContentDTO {
	o: BuilderOption,
	s: BuilderStatusDTO[]
}
export interface EventStateContentOceanFlippedDTO extends EventStateContentDTO {
	MEGACREDIT?: number,
	CARD?: number,
	PLANT?: number
}
export interface EventStateContentDrawDTO extends EventStateContentDTO {
	cl: string[]
}
export interface EventStateContentDiscardDTO extends EventStateContentDTO {
	d: number
}
export interface EventStateContentResearchCardsQueriedDTO extends EventStateContentDTO {
	keep: number
	cards: string[]
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
export interface BuilderStatusDTO {
	l: boolean,
	cc: string | undefined
}
