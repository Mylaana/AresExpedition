import { ProjectCardState } from "../../models/cards/project-card.model";
import { PlayerInfoStateModel } from "../../models/player-info/player-state-info.model";
import { PlayerRessourceStateModel } from "../../models/player-info/player-state-ressource.model";
import { PlayerScoreStateModel } from "../../models/player-info/player-state-score.model";
import { PlayerTagStateModel } from "../../models/player-info/player-state-tag.model";
import { ScanKeep } from "../global.interface";

export interface PlayerStateModelFullDTO {
    cards?: ProjectCardState
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number
	globalParameter: any // = new GlobalParameterModel

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
}
export interface PlayerStateModelPublicDTO {
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
}
export interface PlayerStateModelSecretDTO {
    cards: any
	globalParameter: any
}

