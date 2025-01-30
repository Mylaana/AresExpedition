import { Utils } from "../../utils/utils"
import { MinMaxEqualTreshold } from "../../interfaces/global.interface"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonNames, EventCardBuilderButtonNames, EventSecondaryButtonNames } from "../../types/global.type"

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
}

export abstract class EventButtonBase extends ButtonBase {
    eventSubType!: EventUnionSubTypes
    updateEnabled(enabled: boolean){
        this.enabled = enabled
    }
}

export class EventMainButton extends EventButtonBase {}

export class EventMainButtonSelector extends EventMainButton {
    updateEnabledTreshold(args: MinMaxEqualTreshold): void {
        console.log('before getValue')
        this.enabled = Utils.getValueVsTreshold(args)
    }
}

export class EventSecondaryButton extends EventButtonBase {
    imageUrl?: string
    name!: EventSecondaryButtonNames
}
export class EventCardBuilderButton extends EventButtonBase {
    name!: EventCardBuilderButtonNames
    parentCardBuilderId!: number
}
