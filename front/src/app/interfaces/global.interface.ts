import { AdvancedRessourceType, GameItemType, GlobalParameterColor, SelectablePhase, TagType } from "../types/global.type";
import { PhaseCardType } from "../types/phase-card.type";
import { ProjectCardModel } from "../models/cards/project-card.model";
import { MinMaxEqualType } from "../types/global.type";
import { GlobalParameterName } from "../types/global.type";
import { CardState } from "../models/cards/card-cost.model";
import { RessourceType } from "../types/global.type";
import { ProjectFilterType } from "../types/project-card.type";
import { SelectablePhaseEnum } from "../enum/phase.enum";

export interface RessourceState {
    "id": number,
    "name": RessourceType,
    "valueMod": number,
    "valueProd": number,
	"valueBaseProd": number,
    "valueStock": number,
    "hasStock": boolean,
    "imageUrlId": number,
}
export interface RessourceStock {
    "name": RessourceType,
    'valueStock': number
}
export interface AdvancedRessourceStock {
    "name": AdvancedRessourceType,
    'valueStock': number
}
export interface TagState {
    "id": number,
    "name": TagType,
    "idImageUrl": number;
    "valueMod": number;
    "valueCount": number;
}

export interface PlayerPhase {
    playerId: number;
    currentSelectedPhase: SelectablePhaseEnum;
    currentPhaseType: PhaseCardType;
    previousSelectedPhase: SelectablePhaseEnum;
}

export interface CardOptions {
	initialState?: CardState;
    selectable?: boolean;
    playable?: boolean;
	upgradable?: boolean;
	activable?:boolean;
}

export interface CardSelector {
    selectFrom: ProjectCardModel[];
    selectedList: ProjectCardModel[];
    selectionQuantity: number;
    selectionQuantityTreshold: MinMaxEqualType;

    filter?: ProjectFilter;
    cardInitialState?: CardState;
	stateFromParent?: CardState;
}

export interface GlobalParameter {
    name: GlobalParameterName,
    value: number,
    addEndOfPhase: number,
    color?: GlobalParameterColor
    imageUrl?: string,
}

export interface GlobalParameterValue {
    name: GlobalParameterName,
    steps: number
}

export interface CardRessourceStock {
    cardId: number,
    stock: AdvancedRessourceStock[]
}

export interface ScanKeep {
    scan: number,
    keep: number
}

export interface ProjectFilter {
    type: ProjectFilterType,
    value?: AdvancedRessourceType | AdvancedRessourceType[]
}

export interface DrawDiscard {
    draw: number,
    discard: number
}

export interface MinMaxEqualTreshold {
    tresholdValue: number,
    value: number,
    treshold: MinMaxEqualType
}
export interface GameItem {
    id: number,
    description: GameItemType,
    imageUrl: string,
    name: string
};