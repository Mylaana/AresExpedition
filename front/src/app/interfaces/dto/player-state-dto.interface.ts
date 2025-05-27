import { GlobalParameterNameEnum } from "../../enum/global.enum";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { myUUID, RGB } from "../../types/global.type";
import { PlayedCardStock } from "../../types/project-card.type";
import { AdvancedRessourceStock, RessourceInfo, ScanKeep, TagInfo } from "../global.interface";
import { EventStateDTO } from "./event-state-dto.interface";
import { PlayedCardDTO, TriggerStateDTO } from "./project-card-dto.interface";

export interface PlayerStateDTO {
	infoState: PlayerInfoStateDTO
	scoreState: PlayerScoreStateDTO
	tagState: PlayerTagStateDTO
	ressourceState: PlayerRessourceStateDTO
	projectCardState: PlayerProjectCardStateDTO
	phaseCardState: PlayerPhaseCardStateDTO
	globalParameterState: PlayerGlobalParameterStateDTO
	eventState: PlayerEventStateDTO
	otherState: PlayerOtherStateDTO
}
export interface PlayerInfoStateDTO {
	i: myUUID, //id
	n: string, //name
	c: RGB //color
}
export interface PlayerScoreStateDTO {
	mc: number,
	v: number,
	tr: number,
	f: number
}
export interface PlayerTagStateDTO {
	t: TagInfo[]
}
export interface PlayerRessourceStateDTO {
	r: RessourceInfo[]
}
export interface PlayerProjectCardStateDTO {
	h: number[],
	hc: number[],
	hd: number[],
	cp: PlayedCardStock[]
	t: TriggerStateDTO
	hms: number
}
export interface PlayerPhaseCardStateDTO {
	pc : PhaseCardDTO[]
	sp: SelectablePhaseEnum
	psp: SelectablePhaseEnum
}
export interface PlayerGlobalParameterStateDTO {
	gp: GlobalParameterDTO[]
	ofb: any[]
}
export interface PlayerOtherStateDTO {
	scvm: number,
	r: ScanKeep
}
export interface GlobalParameterDTO {
	n: GlobalParameterNameEnum
	s: number //step
	ae: number //addEndOfPhase
}
export interface PlayerEventStateDTO {
	e: EventStateDTO[]
}

export interface PhaseCardDTO {
	pi: number
	cl: number
}
