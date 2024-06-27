import { SelectablePhase } from "../types/global.type";
import { PhaseCardType } from "../types/phase-card.type";
import { CardState } from "../types/project-card.type";
import { PhaseFilter } from "../types/phase-card.type";
import { ProjectCardModel } from "../models/player-hand/project-card.model";
import { MinMaxEqualType } from "../types/global.type";


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
    initialState?: CardState;
}

export interface ChildButton {
    id: number,
    caption?: string,
    value?: any,
    enabled: boolean
}

export interface CardSelector {
    title: string;
    buttonId: number;
    buttonName: any;
    selectFrom: ProjectCardModel[];
    selectedIdList: number[];
    selectionQuantity: number;
    selectionQuantityTreshold: MinMaxEqualType;
    phaseFilter?: PhaseFilter;
    cardOptions?: CardOptions;
}