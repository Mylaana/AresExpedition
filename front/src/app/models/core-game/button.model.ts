import { Utils } from "../../utils/utils"
import { MinMaxEqualTreshold } from "../../interfaces/global.interface"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonType, CarouselButtonNames, EventCardBuilderButtonNames, NonEventButtonNames, PlayerColor, SettingSupportedLanguage, ToggleButtonNames } from "../../types/global.type"
import { EffectPortalButtonEnum } from "../../enum/global.enum"
import { SETTING_DEFAULT_LANGUAGE } from "../../global/global-const"

export abstract class ButtonBase {
	private static language: SettingSupportedLanguage = SETTING_DEFAULT_LANGUAGE
    private enabled: boolean = false
    startEnabled: boolean = false
	resetEnabledOnEventSwitch: boolean = true
	displayed: boolean = true
    caption?: string
	type!: ButtonType
	locked: boolean = false
	warning: boolean = false
    clicked(): any {}
	resetStartEnabled(){
		this.enabled = this.startEnabled
	}
	setEnabled(enabled: boolean){
		this.enabled = enabled
    }
	isEnabled(): boolean {
		return this.enabled
	}
	static setLanguage(lang: SettingSupportedLanguage) {
		ButtonBase.language = lang;
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
export class EventMainButton extends EventButtonBase {
}
export class EventMainButtonSelector extends EventMainButton {
    updateEnabledTreshold(args: MinMaxEqualTreshold): void {
        this.setEnabled(Utils.getValueVsTreshold(args))
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
export class CarouselButton extends ButtonBase {
	override type: ButtonType = 'carousel'
    name!: CarouselButtonNames
	valueList!: string[]
	value: string = ''
}
export class ToggleButton extends ButtonBase {
	override type: ButtonType = 'toggle'
	name!: ToggleButtonNames
    value: boolean = true
}
