import { BuilderOption } from "../enum/global.enum";

export type RGB = `rgb(${number}, ${number}, ${number})`;
/**this should be used for player selection */
export type SelectablePhase = undefined | "development" | "construction" | "action" | "production" | "research"
/**this should only be used for non-player related events/core game mechanics as players cannot select planification phase*/
export type NonSelectablePhase = "planification" | "development" | "construction" | "action" | "production" | "research"
export type StandardState = 'default' | 'disabled'
export type MinMaxEqualType = 'min' | 'max' | 'equal'
export type ButtonNames =
'defaultValidate'
| 'validatePlanification' | 'validateResearch' | 'validateDevelopment' | 'validateConstruction'| 'validateAction' | 'validateProduction'
| 'sellCardsEndPhase' | 'callOptionalSellCards' | 'validateOptionalSellCards'
| 'selectAlternative'
| 'upgradePhase'
| 'drawCards' | 'discardCards' | 'scanKeep'
| 'addRessourceToSelectedCard'
export type ButtonType = 'image' | 'eventMain' | 'nonEvent' |  'color'

export type NonEventButtonNames = 'sellOptionalCard' | 'sellOptionalCardCancel' | 'rollBack' | 'settings' | 'closeSettings' | 'activateProjectOnce' | 'activateProjectTwice'
| 'convertForest' | 'buyForest' | 'convertTemperature' | 'buyTemperature' | 'buyOcean' | 'convertInfrastructure' | 'buyInfrastructure' | 'buyUpgrade'
| 'upgradePhase'
| 'routeCreateGame' | 'routeCardOverview' | 'routeBuy' | 'routeHome' | 'routeCreateNewGameValidation'
| 'createGamePlayerNumber' | 'tagGain' | 'displayUpgradedPhase' | 'killCard' | 'lockBuilder'
| 'settingToggleDebug'
export type EventCardBuilderButtonNames =  'selectCard' | 'cancelSelectCard' | 'discardSelectedCard' | 'buildCard' | BuilderOption
export type RessourceType = 'megacredit' | 'plant' | 'heat' | 'steel' | 'titanium' | 'card'
export type AdvancedRessourceType = 'microbe' | 'animal' | 'science'
export type TagType = 'building' | 'space' | 'science' | 'power' | 'earth' | 'jovian' | 'plant' | 'animal' | 'microbe' | 'event' | 'wild'
export type GameItemType = TagType | RessourceType
export type DrawRule = 'draw' | 'research' | 'scanKeep'
export type myUUID = string
export type PlayerColor = undefined | 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'purple' | 'white'
export type PlayableCardType = 'project' | 'corporation'
