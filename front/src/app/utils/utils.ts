import { DEBUG_LOG_EVENT_RESOLUTION, DEBUG_LOG_WS_PUBLISH, DEBUG_LOG_WS_RECEIVED, GAME_PHASE_ACTION_CARDS_LIST, GAME_PHASE_CONSTRUCTION_CARDS_LIST, GAME_PHASE_DEVELOPMENT_CARDS_LIST, GAME_PHASE_PRODUCTION_CARDS_LIST, GAME_PHASE_RESEARCH_CARDS_LIST, GLOBAL_CLIENT_ID } from "../global/global-const"
import { MinMaxEqualTreshold } from "../interfaces/global.interface"
import { PhaseCardGroupType, PhaseCardType, PhaseCardUpgradeType } from "../types/phase-card.type"

const PhaseUpgrade: Map<PhaseCardUpgradeType, PhaseCardGroupType> = new Map<PhaseCardUpgradeType, PhaseCardGroupType>([
	['development_6mc', 'development'],
	['development_second_card', 'development'],
	['construction_6mc', 'construction'],
	['construction_draw_card', 'construction'],
	['action_repeat_two', 'action'],
	['action_scan_cards', 'action'],
	['production_1mc_activate_card', 'production'],
	['production_7mc', 'production'],
	['research_scan2_keep2', 'research'],
	['research_scan6_keep1', 'research']
])

const PhaseGroupToPhaseCards: Map<PhaseCardGroupType, PhaseCardType[]> = new Map<PhaseCardGroupType, PhaseCardType[]>(
	[
		['development', GAME_PHASE_DEVELOPMENT_CARDS_LIST],
		['construction', GAME_PHASE_CONSTRUCTION_CARDS_LIST],
		['action', GAME_PHASE_ACTION_CARDS_LIST],
		['production', GAME_PHASE_PRODUCTION_CARDS_LIST],
		['research', GAME_PHASE_RESEARCH_CARDS_LIST]
	]
)

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
	public static getPhaseGroupFromPhaseUpgrade(upgrade: PhaseCardUpgradeType): PhaseCardGroupType | undefined {
		return PhaseUpgrade.get(upgrade)
	}
	public static getPhaseCardsListFromPhaseGroupType(groupType: PhaseCardGroupType): PhaseCardType[] | undefined {
		return PhaseGroupToPhaseCards.get(groupType)
	}
}
