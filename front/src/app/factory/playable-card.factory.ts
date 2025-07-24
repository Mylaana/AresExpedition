import { PlayerStateModel } from "../models/player-info/player-state.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { TriggerEffectEventFactory } from "./trigger-event.factoy";
import { ACTIVATE_REQUIREMENTS, ACTIVATION_DOUBLE, ACTIVATION_EVENTS, ACTIVATION_NO_COST, ACTIVATION_SCALING_EFFECT, ACTIVATION_SCALING_EFFECT_CAPTION, ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS, ALTERNATIVE_PAY_BUTTON_NAME, ALTERNATIVE_PAY_REQUIREMENTS, ALTERNATIVE_PAY_TRIGGER_LIST, COST_MOD, PLAY_EVENTS, PLAY_REQUIREMENTS } from "../maps/playable-card-maps";
import { ActivationOption } from "../types/project-card.type";
import { DEBUG_IGNORE_PREREQUISITES } from "../global/global-const";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { NonEventButtonNames } from "../types/global.type";

function getOnPlayedEvents(cardCode: string, clientstate: PlayerStateModel): EventBaseModel[] | undefined{
	return PLAY_EVENTS[cardCode]?.(clientstate)
}
function getOnActivationEvents(cardCode: string, clientState: PlayerStateModel, activationOption: ActivationOption): EventBaseModel[] | undefined {
	return ACTIVATION_EVENTS[cardCode]?.(cardCode, clientState, activationOption)
}
function getScalingCostActivation(cardCode: string, clientState: PlayerStateModel): number {
	return ACTIVATION_SCALING_EFFECT[cardCode]?.(clientState)
}
function getScalingCostActivationCaption(cardCode: string, clientState: PlayerStateModel): string{
	return ACTIVATION_SCALING_EFFECT_CAPTION[cardCode]?.(clientState)
}
function getActivationOption(cardCode: string): ActivationOption[]{
	if(ACTIVATION_DOUBLE.includes(cardCode)){return [1,2]}
	return [1]
}
function getAlternativePayActiveCodeList(clientState: PlayerStateModel):string[]{
	let result: string[] = []
	for(let triggerCode of clientState.getTriggersIdActive()){
		if(ALTERNATIVE_PAY_TRIGGER_LIST.includes(triggerCode)){result.push(triggerCode)}
	}
	return result
}
function getAlternativePayButtonClickedEvents(buttonName: NonEventButtonNames): EventBaseModel[]{
	const fn = ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS[buttonName]
	if (typeof fn !== 'function') return []
	return fn()
}
function getAlternativePayCaption(cardCode: string): NonEventButtonNames | undefined{
	if(!ALTERNATIVE_PAY_BUTTON_NAME[cardCode]){return}
	return ALTERNATIVE_PAY_BUTTON_NAME[cardCode]()
}
const PlayableCardActivativable = {
	getOnActivationEvents,
	getActivationOption,
	getScalingCostActivationCaption,
	getScalingCostActivation
}
const PlayableCardPrerequisite = {
	canBePlayed(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		if (DEBUG_IGNORE_PREREQUISITES) return true

		const checkFn = PLAY_REQUIREMENTS[card.cardCode]
		return checkFn ? checkFn(clientState) : true
	},
	canBeActivated(card: PlayableCardModel, clientState: PlayerStateModel, activationOption: ActivationOption = 1): boolean {
		if (ACTIVATION_NO_COST.includes(card.cardCode)) return true

		return ACTIVATE_REQUIREMENTS[card.cardCode]?.(activationOption, clientState) ?? false
	},
	canBeAlternativePaid(name: NonEventButtonNames, clientState: PlayerStateModel): boolean {
		return ALTERNATIVE_PAY_REQUIREMENTS[name]?.(clientState) ?? false
	}
}
function calculateCostModFromTrigger(triggerCode: string, card?: PlayableCardModel): number {
	if (!card) return 0
	return COST_MOD[triggerCode]?.(card)??0
}
const CostModCalulator = {
	getCostMod(activeTriggers: string[], projectCard: PlayableCardModel): number {
		let totalMod = 0
		for (const trigger of activeTriggers) {
			totalMod += calculateCostModFromTrigger(trigger, projectCard)
		}

		return totalMod
	},
}
export const PlayableCard = {
	getOnPlayedEvents,
	getOnTriggerredEvents: TriggerEffectEventFactory.getTriggerred,
	getOnActivationEvents: PlayableCardActivativable.getOnActivationEvents,
	getCostMod: CostModCalulator.getCostMod,
	getAlternativePayActiveCodeList,
	getAlternativePayCaption,
	getAlternativePayButtonClickedEvents,
	prerequisite: PlayableCardPrerequisite,
	activable: PlayableCardActivativable
}
