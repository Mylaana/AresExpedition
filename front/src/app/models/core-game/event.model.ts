import { EventCardSelectorSubType, EventType, EventTargetCardSubType } from "../../types/event.type";
import { CardSelector, ChildButton, EventValue, PlayableCardZone } from "../../interfaces/global.interface";
import { ScanKeep } from "../../interfaces/global.interface";

/**
 * isFinalized should become true when object should go to garbage
 */
export class EventBaseModel {
    readonly type!: EventType
    readonly subType!: any
    readonly locksEventpile: boolean = false
    finalized: boolean = false
    autoFinalize: boolean = false
    id?: number
    button?: ChildButton
    readonly value!: any
}

export class EventCardSelector extends EventBaseModel{
    override readonly type: EventType = 'cardSelector'
    override subType!: EventCardSelectorSubType;
    title: string = 'no title provided'
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedIdList: [],
        selectionQuantity: 0,
    }
    selectionActive: boolean = false
}

export class EventCardSelectorRessource extends EventCardSelector {
    override subType!: EventCardSelectorSubType;
    override value!:EventValue
}

export class EventCardSelectorPlayZone extends EventCardSelector {
    playCardZone: PlayableCardZone [] = []
}

export class EventTargetCard extends EventBaseModel {
    override subType!: EventTargetCardSubType;
    override value!: EventValue
    targetCardId!: number
    override autoFinalize: boolean = true
}

export class EventGeneric extends EventBaseModel {
    override subType!: EventGeneric;
    override value!: EventValue
    override autoFinalize: boolean = true
    title!: string
}

export class EventDraw extends EventBaseModel {
    override subType!: EventGeneric;
    override value!: EventValue
    override autoFinalize: boolean = true
    title!: string
}