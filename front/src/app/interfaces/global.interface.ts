import { AdvancedRessourceType, GameItemType, myUUID, PlayerColor, TagType } from "../types/global.type"
import { PhaseCardType } from "../types/phase-card.type"
import { PlayableCardModel } from "../models/cards/project-card.model"
import { MinMaxEqualType } from "../types/global.type"
import { RessourceType } from "../types/global.type"
import { SelectablePhaseEnum } from "../enum/phase.enum"
import { CardState } from "./card.interface"
import { GlobalParameterNameEnum, ProjectFilterNameEnum } from "../enum/global.enum"

export interface RessourceInfo {
    id: number,
    name: RessourceType,
    valueMod: number,
    valueProd: number,
	valueBaseProd: number,
    valueStock: number,
    hasStock: boolean,
    imageUrlId: number,
}
export interface RessourceStock {
    "name": RessourceType,
    'valueStock': number
}
export interface AdvancedRessourceStock {
    "name": AdvancedRessourceType,
    'valueStock': number
}
export interface TagInfo {
    id: number,
    name: TagType,
    idImageUrl: number
    valueMod: number
    valueCount: number
}

export interface PlayerPhase {
    playerId: myUUID
    currentSelectedPhase: SelectablePhaseEnum
    currentPhaseType: PhaseCardType
    previousSelectedPhase: SelectablePhaseEnum
}

export interface CardOptions {
	initialState?: CardState
    selectable?: boolean
    playable?: boolean
	upgradable?: boolean
	activable?:boolean
}

export interface CardSelector {
    selectFrom: PlayableCardModel[]
    selectedList: PlayableCardModel[]
    selectionQuantity: number
    selectionQuantityTreshold: MinMaxEqualType

    filter?: ProjectFilter
    cardInitialState?: Partial<CardState>
	stateFromParent?: Partial<CardState>
}

export interface GlobalParameter {
    name: GlobalParameterNameEnum,
    step: number,
    addEndOfPhase: number,
}

export interface GlobalParameterValue {
    name: GlobalParameterNameEnum,
    steps: number
}

export interface CardRessourceStock {
    cardCode: string,
    stock: AdvancedRessourceStock[]
}

export interface ScanKeep {
    scan: number,
    keep: number
}

export interface ProjectFilter {
    type: ProjectFilterNameEnum,
    stockableType?: AdvancedRessourceType | AdvancedRessourceType[]
	authorizedTag?: TagType[]
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
}
export interface CreatePlayer {
	index: number,
	name: string,
	color: PlayerColor,
}
export interface OceanBonus {
	megacredit: number
	plant: number
	card: number
}
export interface GlobalParameterOffset {
	name: GlobalParameterNameEnum
	offset: number
}
