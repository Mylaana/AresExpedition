import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { PhaseCardGroupModel } from "../../models/cards/phase-card.model";
import { TriggerState } from "../../models/cards/project-card.model";
import { GlobalParameterName, RGB } from "../../types/global.type";
import { PlayedProject } from "../../types/project-card.type";
import { RessourceInfo, ScanKeep, TagInfo } from "../global.interface";

export interface PlayerStateDTO {
	infoState: PlayerInfoStateDTO
	scoreState: PlayerScoreStateDTO
	tagState: PlayerTagStateDTO
	ressourceState: PlayerRessourceStateDTO
	projectCardState: PlayerProjectCardStateDTO
	phaseCardState: PlayerPhaseCardStateDTO
	globalParameterState: PlayerGlobalParameterStateDTO
	otherState: PlayerOtherStateDTO
}
export interface PlayerInfoStateDTO {
	i: number, //id
	n: string, //name
	c: RGB //color
}
export interface PlayerScoreStateDTO {
	mc: number,
	v: number,
	tr: number
}
export interface PlayerTagStateDTO {
	t: TagInfo[]
}
export interface PlayerRessourceStateDTO {
	r: RessourceInfo[]
}
export interface PlayerProjectCardStateDTO {
	h: number[],
	p: PlayedProject
	t: TriggerState
	hms: number
}
export interface PlayerPhaseCardStateDTO {
	pg : PhaseCardGroupModel[]
	pcuc: number
	sp: SelectablePhaseEnum
}
export interface PlayerGlobalParameterStateDTO {
	gp: GlobalParameterDTO[]
}
export interface PlayerOtherStateDTO {
	scvm: number,
	r: ScanKeep
}
export interface GlobalParameterDTO {
	name: GlobalParameterName
	value?: number //value
	addEndOfPhase?: number //addEndOfPhase
}
