import { Utils } from "../../utils/utils"
import { MinMaxEqualTreshold } from "../../interfaces/global.interface"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonType, EventCardBuilderButtonNames, NonEventButtonNames } from "../../types/global.type"

export abstract class ButtonBase {
    enabled: boolean = false
    startEnabled: boolean = false
    caption?: string
	type!: ButtonType
    clicked(): any {}
	resetStartEnabled(){
		this.enabled = this.startEnabled
	}
	updateEnabled(enabled: boolean){
        this.enabled = enabled
    }
}
export class ImageButton extends ButtonBase{
	override type: ButtonType = 'Image'
	name!: string
    value: any
    imageUrl!: string
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
