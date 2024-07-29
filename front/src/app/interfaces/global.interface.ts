import { GlobalParameterColor, SelectablePhase } from "../types/global.type";
import { PhaseCardType } from "../types/phase-card.type";
import { CardState } from "../types/project-card.type";
import { PhaseFilter } from "../types/phase-card.type";
import { ProjectCardModel } from "../models/player-hand/project-card.model";
import { MinMaxEqualType } from "../types/global.type";
import { ButtonNames } from "../types/global.type";
import { GlobalParameterName } from "../types/global.type";


export interface RessourceState {
    "id": number,
    "name": string,
    "valueMod": number,
    "valueProd": number,
    "valueStock": number,
    "hasStock": boolean,
    "imageUrlId": number,
}
export interface TagState {
    "id": number,
    "name": string,
    "idImageUrl": number;
    "valueMod": number;
    "valueCount": number;
}

export interface PlayerPhase {
    playerId: number;
    currentSelectedPhase: SelectablePhase;
    currentPhaseType: PhaseCardType;
    previousSelectedPhase: SelectablePhase;
}

export interface CardOptions {
    selectable?: boolean;
    playable?: boolean;
    initialState?: CardState;
}

export interface ChildButton {
    id: number
    enabled: boolean

    caption?: string
    value?: any
    name?: ButtonNames | SelectablePhase
    imageUrl?: string
}

export interface CardSelector {
    title: string;
    selectFrom: ProjectCardModel[];
    selectedIdList: number[];
    selectionQuantity: number;
    selectionQuantityTreshold: MinMaxEqualType;
    phaseFilter?: PhaseFilter;
    cardOptions?: CardOptions;
    playCardActive?: number;
}

export interface PlayableCardZone {
	cardList: ProjectCardModel[],
	selectionButtonId?: number,
	cardOptions?: CardOptions,
	phaseFilter?: PhaseFilter,
    currentButton?: ChildButton
}

export interface GlobalParameter {
    name: GlobalParameterName,
    value?: number,
    addEndOfPhase?: number,
    color?: GlobalParameterColor
    imageUrl?: string,
}