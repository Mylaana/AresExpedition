import { SelectablePhaseEnum } from "../enum/phase.enum"
import { RessourceType, SupportedLanguage, TagType } from "../types/global.type"
import { ActionPhaseType, ConstructionPhaseType, DevelopmentPhaseType, ProductionPhaseType, ResearchPhaseType } from "../types/phase-card.type"

//export const GLOBAL_GAME_ID = "1"
//export const GLOBAL_CLIENT_ID = "0"
export const GLOBAL_WS_PLAYER = '/topic/player/'
export const GLOBAL_WS_GROUP = '/topic/group/'
export const GLOBAL_WS_ACKNOWLEDGE = '/topic/ack/'
export const GLOBAL_WS_APP_PLAYER = '/app/player'
export const GLOBAL_WS_APP_DEBUG = '/app/debug'
export const GLOBAL_API_NEWGAME = '/api/create-game'

export const ROUTE_NEWGAMELINKS = 'new-game-links'
export const ROUTE_CREATEGAME = 'create-game'
export const ROUTE_CARD_OVERVIEW = 'card-overview'
export const ROUTE_GAME = 'game/:gameId/:playerId'

export const EXTERNAL_LINK_FRYXGAMES = 'https://fryxgames.se/'

export const DEBUG_LOG_EVENT_RESOLUTION = false
export const DEBUG_LOG_WS_PUBLISH = true
export const DEBUG_LOG_WS_RECEIVED = true
export const DEBUG_IGNORE_PREREQUISITES = false

export const GAME_TAG_LIST: TagType[] = ['building','space','science','power','earth','jovian','plant','animal','microbe','event']
export const GAME_RESSOURCE_LIST: RessourceType[] = ['megacredit', 'heat', 'plant', 'steel', 'titanium', 'card']
export const GAME_PHASE_DEVELOPMENT_CARDS_LIST: DevelopmentPhaseType[] = ['development_base', 'development_6mc', 'development_second_card']
export const GAME_PHASE_CONSTRUCTION_CARDS_LIST: ConstructionPhaseType[] = ['construction_base', 'construction_6mc', 'construction_draw_card']
export const GAME_PHASE_ACTION_CARDS_LIST: ActionPhaseType[] = ['action_base', 'action_scan_cards', 'action_repeat_two']
export const GAME_PHASE_PRODUCTION_CARDS_LIST: ProductionPhaseType[] = ['production_base', 'production_7mc', 'production_1mc_activate_card']
export const GAME_PHASE_RESEARCH_CARDS_LIST: ResearchPhaseType[] = ['research_base', 'research_scan6_keep1', 'research_scan2_keep2']
export const GAME_SELECTABLE_PHASE_LIST: SelectablePhaseEnum[] = [SelectablePhaseEnum.development, SelectablePhaseEnum.construction, SelectablePhaseEnum.action, SelectablePhaseEnum.production, SelectablePhaseEnum.research]
export const GAME_HAND_MAXIMUM_SIZE = 10
export const GAME_MAXIMUM_PLAYER_NUMBER = 6
export const GAME_CARD_DEFAULT_TAG_NUMBER = 3
export const GAME_GLOBAL_PARAMETER_OXYGEN_MAX_STEP = 15
export const GAME_GLOBAL_PARAMETER_INFRASTRUCTURE_MAX_STEP = 15
export const GAME_GLOBAL_PARAMETER_TEMPERATURE_MAX_STEP = 20
export const GAME_GLOBAL_PARAMETER_OCEAN_MAX_STEP = 9
export const GAME_RESSOURCE_TITANIUM_BASE_REDUCTION = 3
export const GAME_RESSOURCE_STEEL_BASE_REDUCTION = 2
export const GAME_CARD_SELL_VALUE = 3;
export const GAME_SUPPORTED_LANGUAGE: SupportedLanguage[] = ['en', 'fr']
export const GAME_DEFAULT_LANGUAGE: SupportedLanguage = 'en'
