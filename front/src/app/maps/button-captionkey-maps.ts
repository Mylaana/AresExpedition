import { EventUnionSubTypes } from "../types/event.type";
import { ButtonNames } from "../types/global.type";
import { ButtonCaptionKey } from "../types/text.type";

export const BUTTON_CAPTIONKEY_FROM_EVENTSUBTYPE: Partial<Record<EventUnionSubTypes, () => ButtonCaptionKey>> = {
	//'':() => ''
}
export const BUTTON_CAPTIONKEY_FROM_BUTTONNAME: Partial<Record<ButtonNames, () => ButtonCaptionKey>> = {
	//Create Game Route
	'routeCreateNewGameValidation':() => 'buttonCreateGameCreate',
	'createGameOptionActivateAll':() => 'buttonCreateGameEnableAll',
	'createGameOptionDeactivateAll':() => 'buttonCreateGameDisableAll',

	//Home Route
	'routeCreateGame':() => 'buttonHomeNewGame',
	'routeCardOverview':() => 'buttonHomeCardOverview',
	'routeDiscord':() => 'buttonHomeDiscord',
	'routeBuy':() => 'buttonHomeBuyAres',

	//Card Overview Route
	'cardOverviewDisplayAll':() => 'buttonCardOverviewDisplayAll',
	'cardOverviewDisplayBalanced':() => 'buttonCardOverviewDisplayBalanced'
}
