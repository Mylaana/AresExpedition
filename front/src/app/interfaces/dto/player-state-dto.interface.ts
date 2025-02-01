import { ProjectCardState } from "../../models/cards/project-card.model";
import { PlayerInfoStateModel } from "../../models/player-info/player-state-info.model";
import { PlayerScoreStateModel } from "../../models/player-info/player-state-score.model";
import { RGB } from "../../types/global.type";
import { RessourceState, ScanKeep, TagState } from "../global.interface";

export interface PlayerStateModelFullDTO {
    ressource: RessourceState[];
    tag: TagState[];
    cards?: ProjectCardState
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number
	globalParameter: any // = new GlobalParameterModel

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
}
export interface PlayerStateModelPublicDTO {
    ressource: RessourceState[];
    tag: TagState[];
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
}
export interface PlayerStateModelSecretDTO {
    cards: any
	globalParameter: any
}

