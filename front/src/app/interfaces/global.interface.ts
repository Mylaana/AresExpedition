import { AdvancedRessourceType, GlobalParameterColor, SelectablePhase, TagType } from "../types/global.type";
import { PhaseCardType } from "../types/phase-card.type";
import { ProjectCardModel } from "../models/cards/project-card.model";
import { MinMaxEqualType } from "../types/global.type";
import { ButtonNames } from "../types/global.type";
import { GlobalParameterName } from "../types/global.type";
import { CardState } from "../models/cards/card-cost.model";
import { RessourceType } from "../types/global.type";
import { ProjectFilterType } from "../types/project-card.type";

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
    currentSelectedPhase: SelectablePhase;
    currentPhaseType: PhaseCardType;
    previousSelectedPhase: SelectablePhase;
}

export interface CardOptions {
	initialState?: CardState;
    selectable?: boolean;
    playable?: boolean;
	upgradable?: boolean;
	activable?:boolean;
}

export interface ChildButton {
    id: number
    enabled: boolean
    startEnabled: boolean

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
    phaseFilter?: ProjectFilter;
    cardInitialState?: CardState;
	stateFromParent?: CardState;
    playCardActive?: number;
}

export interface PlayableCardZone {
	cardList: ProjectCardModel[],
	selectionButtonId?: number,
	cardInitialState?: CardState,
	phaseFilter?: ProjectFilter,
    currentButton?: ChildButton
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

export interface ResearchState {
    scan: number,
    keep: number
}

export interface ProjectFilter {
    type: ProjectFilterType,
    value?: AdvancedRessourceType | AdvancedRessourceType[]
}