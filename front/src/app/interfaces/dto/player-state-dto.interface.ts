import { GlobalParameterNameEnum, MilestonesEnum } from "../../enum/global.enum";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { myUUID, RGB } from "../../types/global.type";
import { PlayedCardDTO } from "../../types/project-card.type";
import { RessourceInfo, ScanKeep, TagInfo } from "../global.interface";
import { EventStateDTO } from "../event-state.interface";
import { TriggerStateDTO } from "./project-card-dto.interface";

export interface PlayerStateDTO {
	infoState: PlayerInfoStateDTO
	scoreState: PlayerScoreStateDTO
	tagState: PlayerTagStateDTO
	ressourceState: PlayerRessourceStateDTO
	projectCardState: PlayerProjectCardStateDTO
	phaseCardState: PlayerPhaseCardStateDTO
	globalParameterState: PlayerGlobalParameterStateDTO
	eventState: PlayerEventStateDTO
	statState: PlayerStatStateDTO
	otherState: PlayerOtherStateDTO
}
export interface PlayerInfoStateDTO {
	i: myUUID, //id
	n: string, //name
	c: RGB //color
}
export interface PlayerScoreStateDTO {
	cm: MilestonesEnum[],
	v: number,
	tr: number,
	f: number,
	a: number,
	mh: number,
	mr: number,
	mm: number
}
export interface PlayerTagStateDTO {
	t: TagInfo[]
}
export interface PlayerRessourceStateDTO {
	r: RessourceInfo[]
}
export interface PlayerProjectCardStateDTO {
	h: string[],
	hc: string[],
	hd: string[],
	cp: PlayedCardDTO,
	t: TriggerStateDTO
	o: {[key: string]: number}
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
export interface PlayerStatStateDTO {
	/** slected phase round */
	spr: {[key: number]: SelectablePhaseEnum}
	/** increased parameter */
	ip: Record<GlobalParameterNameEnum, number>
}
