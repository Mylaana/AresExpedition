import { ProjectCardState } from "../../models/cards/project-card.model";
import { PlayerInfoStateModel } from "../../models/player-info/player-state-info.model";
import { PlayerPhaseCardState } from "../../models/player-info/player-state-phase-card.model";
import { PlayerRessourceStateModel } from "../../models/player-info/player-state-ressource.model";
import { PlayerScoreStateModel } from "../../models/player-info/player-state-score.model";
import { PlayerTagStateModel } from "../../models/player-info/player-state-tag.model";
import { ScanKeep } from "../global.interface";

export interface PlayerStateModelFullDTO {
    cards?: ProjectCardState
    research: ScanKeep
	sellCardValueMod: number
	globalParameter: any // = new GlobalParameterModel

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
	phaseCardState: PlayerPhaseCardState
}
export interface PlayerStateModelPublicDTO {
    research: ScanKeep
	sellCardValueMod: number

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
	phaseCardState: PlayerPhaseCardState
}
export interface PlayerStateModelSecretDTO {
    cards: any
	globalParameter: any
}

