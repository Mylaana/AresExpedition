import { CardBuilder } from "../models/core-game/card-builder.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { NonEventButtonNames } from "../types/global.type";

type EventBuilderCommandType = 'base' | 'alternativeOption' | 'alternativePay'

export interface EventBuilderCommand {
    commandType: EventBuilderCommandType
    buttonName: NonEventButtonNames
    builderIndex?: number
}

export interface GameEventHandler<T extends EventBaseModel = EventBaseModel> {
    supports(event: T): boolean
    onFinalizeEvent(event: T): void
    onSwitchEvent(event: T): void | Promise<void>
}