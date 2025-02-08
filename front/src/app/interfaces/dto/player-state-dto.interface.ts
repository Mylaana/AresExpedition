import { PlayerInfoStateModel } from "../../models/player-info/player-state-info.model";
import { PlayerOtherStateModel } from "../../models/player-info/player-state-other.model";
import { PlayerPhaseCardState } from "../../models/player-info/player-state-phase-card.model";
import { PlayerProjectCardState } from "../../models/player-info/player-state-project-card.model";
import { PlayerRessourceStateModel } from "../../models/player-info/player-state-ressource.model";
import { PlayerScoreStateModel } from "../../models/player-info/player-state-score.model";
import { PlayerTagStateModel } from "../../models/player-info/player-state-tag.model";

export interface PlayerStateModelFullDTO {
    cards?: PlayerProjectCardState
	globalParameter: any // = new GlobalParameterModel

	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
	phaseCardState: PlayerPhaseCardState
	otherState: PlayerOtherStateModel
}
export interface PlayerStateModelPublicDTO {
	infoState: PlayerInfoStateModel
	scoreState: PlayerScoreStateModel
	tagState: PlayerTagStateModel
	ressourceState: PlayerRessourceStateModel
	phaseCardState: PlayerPhaseCardState
	otherState: PlayerOtherStateModel
}
export interface PlayerStateModelSecretDTO {
    cards: any
	globalParameter: any
}

