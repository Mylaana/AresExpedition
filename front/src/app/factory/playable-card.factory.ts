import { PlayerStateModel } from "../models/player-info/player-state.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { TriggerEffectEventFactory } from "./trigger-event.factoy";
import { ActivationOption } from "../types/project-card.type";
import { DEBUG_IGNORE_PREREQUISITES } from "../global/global-const";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { AltenativeCostButtonNames, NonEventButtonNames, StandardProjectButtonNames } from "../types/global.type";
import { ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS, ALTERNATIVE_PAY_BUTTON_NAME, ALTERNATIVE_PAY_REQUIREMENTS, ALTERNATIVE_PAY_TRIGGER_LIST, COST_MOD, PLAY_EVENTS, PLAY_REQUIREMENTS } from "../maps/playable-card-other-maps";
import { ACTIVATE_REQUIREMENTS, ACTIVATION_DOUBLE, ACTIVATION_EVENTS, ACTIVATION_NO_COST, ACTIVATION_SCALING_EFFECT_CAPTION, ACTIVATION_SCALING_EFFECT_VALUE } from "../maps/playable-card-activation-maps";
import { STANDARD_PROJECT_CAPTION, STANDARD_PROJECT_COST } from "../maps/standard-project-maps";
import { SCALING_PRODUCTION } from "../maps/playable-card-scaling-production-maps";

function getOnPlayedEvents(cardCode: string, clientstate: PlayerStateModel): EventBaseModel[] | undefined{
	return PLAY_EVENTS[cardCode]?.(clientstate)
}
function getOnActivationEvents(cardCode: string, clientState: PlayerStateModel, activationOption: ActivationOption): EventBaseModel[] | undefined {
	return ACTIVATION_EVENTS[cardCode]?.(cardCode, clientState, activationOption)
}
function getScalingCostActivation(cardCode: string, clientState: PlayerStateModel): number {
	return ACTIVATION_SCALING_EFFECT_VALUE[cardCode]?.(clientState)
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
function getStandardProjectCost(key: StandardProjectButtonNames, clientState: PlayerStateModel): number {
	return STANDARD_PROJECT_COST[key]?.(clientState)
}
function getStandardProjectCaption(key: StandardProjectButtonNames, clientState: PlayerStateModel): string{
	return STANDARD_PROJECT_CAPTION[key]?.(clientState)
}
const PlayableCardActivativable = {
	getOnActivationEvents,
	getActivationOption,
	getScalingCostActivationCaption,
	getScalingCostActivation,
	getStandardProjectCost,
	getStandardProjectCaption,
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
function calculateCostModFromTrigger(triggerCode: string, card: PlayableCardModel, clientState: PlayerStateModel): number {
	if (!card) return 0
	return COST_MOD[triggerCode]?.(card, clientState)??0
}
function hasScalingProduction(cardCode: string): boolean {
	if(!SCALING_PRODUCTION[cardCode]){return false}
	return true
}
function getRepeatProductionCaption(cardCode: string, clientState: PlayerStateModel): string {
	if(hasScalingProduction(cardCode)===false){return '[NO SCALING PRODUCTION]'}
	let production = SCALING_PRODUCTION[cardCode]?.(clientState)
	let result: string = ''
	for(let p of production){
		if(result!=''){result +=' '}
		switch(p.name){
			case('steel'):case('titanium'):{
				continue
			}
			case('megacredit'):{
				result = result + `$ressource_megacreditvoid_+${p.valueStock}$`
				break
			}
			default:{
				result = result + `+${p.valueStock}$ressource_${p.name}$`
			}
		}
	}
	return result
}
const CostModCalulator = {
	getCostMod(activeTriggers: string[], projectCard: PlayableCardModel, clientState: PlayerStateModel): number {
		let totalMod = 0
		for (const trigger of activeTriggers) {
			totalMod += calculateCostModFromTrigger(trigger, projectCard, clientState)
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
	getRepeatProductionCaption,
	hasScalingProduction,
	prerequisite: PlayableCardPrerequisite,
	activable: PlayableCardActivativable
}
