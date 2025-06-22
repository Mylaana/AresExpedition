import { Utils } from "../../utils/utils"
import { MinMaxEqualTreshold } from "../../interfaces/global.interface"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonType, EventCardBuilderButtonNames, NonEventButtonNames, PlayerColor } from "../../types/global.type"
import { EffectPortalButtonEnum } from "../../enum/global.enum"

export abstract class ButtonBase {
    enabled: boolean = false
    startEnabled: boolean = false
	displayed: boolean = true
    caption?: string
	type!: ButtonType
	locked: boolean = false
	warning: boolean = false
    clicked(): any {}
	resetStartEnabled(){
		this.enabled = this.startEnabled
	}
	updateEnabled(enabled: boolean){
        this.enabled = enabled
    }
}
export class ImageButton extends ButtonBase{
	override type: ButtonType = 'image'
	name!: string
    value: any
    imageUrl!: string
}
export class ColorButton extends ButtonBase{
	override type: ButtonType = 'color'
	color: PlayerColor
}
export abstract class EventButtonBase extends ButtonBase {
	override type: ButtonType = 'eventMain'
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
	override type: ButtonType = 'nonEvent'
    imageUrl?: string
    name!: NonEventButtonNames
}
export class EffectPortalButton extends NonEventButton {
    override type: ButtonType = 'nonEvent'
    effect!: EffectPortalButtonEnum
}