import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { PhaseCardGroupModel } from "../../models/cards/phase-card.model";
import { TriggerState } from "../../models/cards/project-card.model";
import { RGB } from "../../types/global.type";
import { PlayedProject } from "../../types/project-card.type";
import { GlobalParameter, RessourceInfo, ScanKeep, TagInfo } from "../global.interface";

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
	id: number,
	name: string,
	color: RGB
}
export interface PlayerScoreStateDTO {
	milestoneCount: number,
	vp: number,
	terraformingRating: number
}
export interface PlayerTagStateDTO {
	tags: TagInfo[]
}
export interface PlayerRessourceStateDTO {
	ressource: RessourceInfo[]
}
export interface PlayerProjectCardStateDTO {
	hand: number[],
	projects: PlayedProject
	triggers: TriggerState
	handMaximumSize: number
}
export interface PlayerPhaseCardStateDTO {
	phaseGroups : PhaseCardGroupModel[]
	phaseCardUpgradeCount: number
	selectedPhase: SelectablePhaseEnum
}
export interface PlayerGlobalParameterStateDTO {
	parameters: GlobalParameter[]
}
export interface PlayerOtherStateDTO {
	sellCardValueMod: number,
	research: ScanKeep
}
