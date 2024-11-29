import { ProjectCardState } from "../models/cards/project-card.model";
import { RGB } from "../types/global.type";
import { RessourceState, ScanKeep, TagState } from "./global.interface";

export interface PlayerStateModel_FullDTO {
    id: number;
    name: string;
    color: RGB;
    ressource: RessourceState[];
    terraformingRating: number;
    vp: number;
    tag: TagState[];
    cards: ProjectCardState
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number
	globalParameter: any // = new GlobalParameterModel
	milestoneCount: number
}
export interface PlayerStateModel_PublicDTO {
    id: number;
    name: string;
    color: RGB;
    ressource: RessourceState[];
    terraformingRating: number;
    vp: number;
    tag: TagState[];
    research: ScanKeep
	phaseCards: any// = new PhaseCardHolderModel
	phaseCardUpgradeCount: number
	sellCardValueMod: number
	milestoneCount: number
}
export interface PlayerStateModel_SecretDTO {
    cards: ProjectCardState
	globalParameter: any
}