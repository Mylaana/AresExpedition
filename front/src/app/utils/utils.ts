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

type phaseName = 'development' | 'construction' | 'action' | 'production' | 'research'

export class Utils {
	public static jsonCopy(item: any): any{
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
	public static getValueVsTreshold(args: MinMaxEqualTreshold): boolean {
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
	public static logText(...text: any ): void {
		console.log(text)
	}
	public static logEventResolution(...text: any): void {
		if(!DEBUG_LOG_EVENT_RESOLUTION){return}
		this.logText(text)
	}
	public static logError(...text: any): void{
		console.log(text)
	}
	public static logPublishMessage(prefix: any, content: any): void {
		if(!DEBUG_LOG_WS_PUBLISH){return}
		console.log(`%cPUBLISHED: ${prefix}: `, 'color:red', content)
	}
	public static logReceivedMessage(prefix: any, content: any): void {
		if(!DEBUG_LOG_WS_RECEIVED){return}
		console.log(`%cRECEIVED: ${prefix}: `, 'color:green', content)
	}
	public static getSelectablePhaseFromPhaseUpgrade(upgrade: PhaseCardUpgradeType): SelectablePhaseEnum {

		return PhaseUpgrade.get(upgrade)??SelectablePhaseEnum.undefined
	}
	public static getPhaseCardsListFromPhaseGroupType(groupType: SelectablePhaseEnum): PhaseCardType[] {
		return PhaseGroupToPhaseCards.get(groupType)??[]
	}
	/**
	* Can use 'development' | 'construction' | 'action' | 'production' | 'research'
	*
	* Any other value returns SelectablePhaseEnum.undefined
	*
	* Input converted to lowercase before comparison
	*/
	public static toSelectablePhase(name: string): SelectablePhaseEnum {
		switch(name.toLowerCase()){
			case("development"):{return SelectablePhaseEnum.development}
			case("construction"):{return SelectablePhaseEnum.construction}
			case("action"):{return SelectablePhaseEnum.action}
			case("production"):{return SelectablePhaseEnum.production}
			case("research"):{return SelectablePhaseEnum.research}
			default:{return SelectablePhaseEnum.undefined}
		}
	}
	public static toNumberArray(value: number | number[]): number[] {
		if(Array.isArray(value)){return value}
		return [value]
	}
	public static toCardsIdList(modelList: PlayableCardModel[]): number[]{
		let list: number[] = []
		for(let card of modelList){
			list.push(card.id)
		}
		return list
	}
	public static toFullCardState(partialState: Partial<CardState>): CardState {
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
	public static newUUID(): myUUID {
		return uuidv4()
	}
	public static toCardTypeColor(cardType: CardType): CardTypeColor {
		switch(cardType){
			case('blueProject'):{return 'blue'}
			case('redProject'):{return 'red'}
			case('greenProject'):{return 'green'}
			case('corporation'):{return 'corporation'}
		}
		return undefined
	}
	public static toArray(input: any | any[]): any[] {
		if(Array.isArray(input)){return input}
		return [input]
	}
	public static toGlobalParameterColor(parameterName: GlobalParameterNameEnum, step: number): GlobalParameterColorEnum {
		switch(parameterName){
			case(GlobalParameterNameEnum.temperature):{
				if(step<=5){return GlobalParameterColorEnum.purple}
				if(step<=10){return GlobalParameterColorEnum.red}
				if(step<=15){return GlobalParameterColorEnum.yellow}
				return GlobalParameterColorEnum.white
			}
			case(GlobalParameterNameEnum.infrastructure):{
				if(step<=2){return GlobalParameterColorEnum.purple}
				if(step<=7){return GlobalParameterColorEnum.red}
				if(step<=11){return GlobalParameterColorEnum.yellow}
				return GlobalParameterColorEnum.white
			}
			case(GlobalParameterNameEnum.oxygen):{
				if(step<=2){return GlobalParameterColorEnum.purple}
				if(step<=6){return GlobalParameterColorEnum.red}
				if(step<=11){return GlobalParameterColorEnum.yellow}
				return GlobalParameterColorEnum.white
			}
		}
		return GlobalParameterColorEnum.purple
	}
	public static toTagId(tagType: TagType): number {
		for(let i=0; i<GAME_TAG_LIST.length; i++){
			if(GAME_TAG_LIST[i]===tagType){
				return i
			}
		}
		return -1
	}
}
