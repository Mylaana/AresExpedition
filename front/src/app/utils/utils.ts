import { SelectablePhaseEnum } from "../enum/phase.enum"
import { DEBUG_LOG_EVENT_RESOLUTION, DEBUG_LOG_WS_PUBLISH, DEBUG_LOG_WS_RECEIVED, GAME_PHASE_ACTION_CARDS_LIST, GAME_PHASE_CONSTRUCTION_CARDS_LIST, GAME_PHASE_DEVELOPMENT_CARDS_LIST, GAME_PHASE_PRODUCTION_CARDS_LIST, GAME_PHASE_RESEARCH_CARDS_LIST, GAME_TAG_LIST } from "../global/global-const"
import { CardState } from "../interfaces/card.interface"
import { MinMaxEqualTreshold } from "../interfaces/global.interface"
import { PlayableCardModel } from "../models/cards/project-card.model"
import { myUUID, TagType } from "../types/global.type"
import { PhaseCardType, PhaseCardUpgradeType } from "../types/phase-card.type"
import { v4 as uuidv4 } from 'uuid'
import { CardType, CardTypeColor } from "../types/project-card.type"
import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../enum/global.enum"
import { environment } from "../../environments/environment"

const PhaseUpgrade: Map<PhaseCardUpgradeType, SelectablePhaseEnum> = new Map<PhaseCardUpgradeType, SelectablePhaseEnum>([
	['development_6mc', SelectablePhaseEnum.development],
	['development_second_card', SelectablePhaseEnum.development],
	['construction_6mc', SelectablePhaseEnum.construction],
	['construction_draw_card', SelectablePhaseEnum.construction],
	['action_repeat_two', SelectablePhaseEnum.action],
	['action_scan_cards', SelectablePhaseEnum.action],
	['production_1mc_activate_card', SelectablePhaseEnum.production],
	['production_7mc', SelectablePhaseEnum.production],
	['research_scan2_keep2', SelectablePhaseEnum.research],
	['research_scan6_keep1', SelectablePhaseEnum.research]
])

const PhaseGroupToPhaseCards: Map<SelectablePhaseEnum, PhaseCardType[]> = new Map<SelectablePhaseEnum, PhaseCardType[]>(
	[
		[SelectablePhaseEnum.development, GAME_PHASE_DEVELOPMENT_CARDS_LIST],
		[SelectablePhaseEnum.construction, GAME_PHASE_CONSTRUCTION_CARDS_LIST],
		[SelectablePhaseEnum.action, GAME_PHASE_ACTION_CARDS_LIST],
		[SelectablePhaseEnum.production, GAME_PHASE_PRODUCTION_CARDS_LIST],
		[SelectablePhaseEnum.research, GAME_PHASE_RESEARCH_CARDS_LIST]
	]
)

function jsonCopy(item: any): any{
		return JSON.parse(JSON.stringify(item))
}
/**
 *
 * @param treshold
 * @param value
 * @param tresholdType
 * @returns boolean
 * returns true if value is in treshold limit
 */
function getValueVsTreshold(args: MinMaxEqualTreshold): boolean {
	switch(args.treshold){
		case('equal'):{
			return args.value === args.tresholdValue
		}
		case('min'): {
			return  args.value >= args.tresholdValue
		}
		case('max'): {
			return  args.value <= args.tresholdValue
		}
	}
}
function logText(...text: any ): void {
	if(environment.production===true){return}
	console.log(text)
}
function logEventResolution(...text: any): void {
	if(environment.production===true){return}
	if(DEBUG_LOG_EVENT_RESOLUTION===false){return}
	Logger.logText(text)
}
function logError(...text: any): void{
	if(environment.production===true){return}
	console.log(text)
}
function logPublishMessage(prefix: any, content: any): void {
	if(environment.production===true){return}
	console.log(`%cPUBLISHED: ${prefix}: `, 'color:red', content)
}
function logReceivedMessage(prefix: any, content: any): void {
	if(environment.production===true){return}
	console.log(`%cRECEIVED: ${prefix}: `, 'color:green', content)
}
function getSelectablePhaseFromPhaseUpgrade(upgrade: PhaseCardUpgradeType): SelectablePhaseEnum {

	return PhaseUpgrade.get(upgrade)??SelectablePhaseEnum.undefined
}
function getPhaseCardsListFromPhaseGroupType(groupType: SelectablePhaseEnum): PhaseCardType[] {
	return PhaseGroupToPhaseCards.get(groupType)??[]
}
/**
* Can use 'development' | 'construction' | 'action' | 'production' | 'research'
*
* Any other value returns SelectablePhaseEnum.undefined
*
* Input converted to lowercase before comparison
*/
function toSelectablePhase(name: string): SelectablePhaseEnum {
	switch(name.toLowerCase()){
		case("development"):{return SelectablePhaseEnum.development}
		case("construction"):{return SelectablePhaseEnum.construction}
		case("action"):{return SelectablePhaseEnum.action}
		case("production"):{return SelectablePhaseEnum.production}
		case("research"):{return SelectablePhaseEnum.research}
		default:{return SelectablePhaseEnum.undefined}
	}
}
function toNumberArray(value: number | number[]): number[] {
	if(Array.isArray(value)){return value}
	return [value]
}
function toCardsIdList(modelList: PlayableCardModel[]): string[]{
	let list: string[] = []
	for(let card of modelList){
		list.push(card.cardCode)
	}
	return list
}
function toFullCardState(partialState: Partial<CardState>): CardState {
	return Object.assign({
		selectable: false,
		selected: false,
		upgradable: false,
		upgraded: false,
		buildable: false,
		activable: false,
		ignoreCost: false
	}, partialState);
}
function newUUID(): myUUID {
	return uuidv4()
}
function toCardTypeColor(cardType: CardType): CardTypeColor {
	switch(cardType){
		case('blueProject'):{return 'blue'}
		case('redProject'):{return 'red'}
		case('greenProject'):{return 'green'}
		case('corporation'):{return 'corporation'}
	}
	return undefined
}
function toArray(input: any | any[]): any[] {
	if(Array.isArray(input)){return input}
	return [input]
}
function toGlobalParameterColor(parameterName: GlobalParameterNameEnum, step: number): GlobalParameterColorEnum {
	switch(parameterName){
		case(GlobalParameterNameEnum.temperature):{
			if(step<=6){return GlobalParameterColorEnum.purple}
			if(step<=11){return GlobalParameterColorEnum.red}
			if(step<=16){return GlobalParameterColorEnum.yellow}
			return GlobalParameterColorEnum.white
		}
		case(GlobalParameterNameEnum.infrastructure):{
			if(step<=3){return GlobalParameterColorEnum.purple}
			if(step<=8){return GlobalParameterColorEnum.red}
			if(step<=12){return GlobalParameterColorEnum.yellow}
			return GlobalParameterColorEnum.white
		}
		case(GlobalParameterNameEnum.oxygen):{
			if(step<=3){return GlobalParameterColorEnum.purple}
			if(step<=7){return GlobalParameterColorEnum.red}
			if(step<=12){return GlobalParameterColorEnum.yellow}
			return GlobalParameterColorEnum.white
		}
	}
	return GlobalParameterColorEnum.purple
}
function toTagId(tagType: TagType): number {
	for(let i=0; i<GAME_TAG_LIST.length; i++){
		if(GAME_TAG_LIST[i]===tagType){
			return i
		}
	}
	return -1
}
function toTagType(tagId: number): TagType {
	return GAME_TAG_LIST[tagId]
}

export const Logger = {
	logText,
	logEventResolution,
	logError,
	logPublishMessage,
	logReceivedMessage
}

export const Utils = {
	jsonCopy,
	getValueVsTreshold,
	getSelectablePhaseFromPhaseUpgrade,
	getPhaseCardsListFromPhaseGroupType,
	toSelectablePhase,
	toNumberArray,
	toCardsIdList,
	toFullCardState,
	newUUID,
	toCardTypeColor,
	toArray,
	toGlobalParameterColor,
	toTagId,
	toTagType
}
