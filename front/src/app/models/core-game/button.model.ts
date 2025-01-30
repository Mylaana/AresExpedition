import { Utils } from "../../utils/utils"
import { MinMaxEqualTreshold } from "../../interfaces/global.interface"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonNames, EventCardBuilderButtonNames, NonEventButtonNames } from "../../types/global.type"

export class ChildButton {
    id!: number
    enabled: boolean = false
    startEnabled: boolean = false

    caption?: string
    value?: any
    name?: ButtonNames
    imageUrl?: string
}

export abstract class ButtonBase {
    enabled: boolean = false
    startEnabled: boolean = false
    caption?: string
    clicked(): any {}
	resetStartEnabled(){
		this.enabled = this.startEnabled
	}
	updateEnabled(enabled: boolean){
        this.enabled = enabled
    }
}

export abstract class EventButtonBase extends ButtonBase {
    eventSubType!: EventUnionSubTypes
}

export class EventMainButton extends EventButtonBase {}

export class EventMainButtonSelector extends EventMainButton {
    updateEnabledTreshold(args: MinMaxEqualTreshold): void {
        this.enabled = Utils.getValueVsTreshold(args)
    }
}

export class EventCardBuilderButton extends EventButtonBase {
    name!: EventCardBuilderButtonNames
    parentCardBuilderId!: number
}

export class NonEventButton extends ButtonBase {
    imageUrl?: string
    name!: NonEventButtonNames
}
