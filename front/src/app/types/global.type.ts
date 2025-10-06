import { BuilderOption, MilestonesEnum } from "../enum/global.enum";
import { CarouselButton, NonEventButton, ToggleButton } from "../models/core-game/button.model";

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
| ToggleButtonNames | CarouselButtonNames | NonEventButtonNames
export type ButtonType = 'image' | 'eventMain' | 'nonEvent' |  'color' | 'toggle' | 'carousel'

export type NonEventButtonNames = 'sellOptionalCard' | 'sellOptionalCardCancel' | 'rollBack' | 'settings' | 'closeSettings' | 'activateProjectOnce' | 'activateProjectTwice'
| 'convertForest' | 'buyForest' | 'convertTemperature' | 'buyTemperature' | 'buyOcean' | 'convertInfrastructure' | 'buyInfrastructure' | 'buyUpgrade'
| 'upgradePhase'
| 'routeCreateGame' | 'routeCardOverview' | 'routeBuy' | 'routeHome' | 'routeCreateNewGameValidation' | 'routeDiscord'
| 'createGamePlayerNumber' | 'tagGain' | 'displayUpgradedPhase' | 'displayUpgradedPhaseCancel' | 'killCard' | 'lockBuilder'
| 'settingToggleDebug' | 'portalEffect'
| 'createGamePlayerNumber' | 'tagGain' | 'displayUpgradedPhase' | 'killCard' | 'lockBuilder'
| 'settingToggleDebug' | 'portalEffect' | 'settingToggleLanguage' | 'carouselLeft' | 'carouselRight'
| 'alternativePayAnaerobicMicroorganisms' | 'alternativePayRestructuredResources'
| 'cardOverviewInvertTagSelection' | 'cardOverviewResetTagSelection' | 'cardOverviewNoneTag' | 'cardOverviewDisplayAll' | 'cardOverviewDisplayBalanced'
| 'createGameOptionActivateAll' | 'createGameOptionDeactivateAll'
export type ToggleButtonNames = 'expansionDiscovery' | 'expansionFoundations' | 'expansionPromo'| 'expansionDevFanMade'
| 'expansionBalancedCards' | 'modeInitialDraft' | 'modeInfrastructureMandatory' | 'modeMerger' | 'modeStandardProjectPhaseUpgrade' | 'modeDeadHand'
| 'modeAdditionalAwards'
export type CarouselButtonNames = 'carousel'
export type EventCardBuilderButtonNames =  'selectCard' | 'cancelSelectCard' | 'discardSelectedCard' | 'buildCard' | BuilderOption
export type RessourceType = 'megacredit' | 'plant' | 'heat' | 'steel' | 'titanium' | 'card'
export type AdvancedRessourceType = 'microbe' | 'animal' | 'science'
export type TagType = 'building' | 'space' | 'science' | 'power' | 'earth' | 'jovian' | 'plant' | 'animal' | 'microbe' | 'event' | 'wild' | 'none'
export type GameItemType = TagType | RessourceType
export type DrawRule = 'draw' | 'research' | 'scanKeep'
export type myUUID = string
export type PlayerColor = undefined | 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'purple' | 'white' | 'grey'
export type PlayableCardType = 'project' | 'corporation'
export type AnyButton = NonEventButton | CarouselButton | ToggleButton

export type SettingSupportedLanguage = 'en' | 'fr'
export type SettingCardSize = 'small' | 'medium'
export type SettingInterfaceSize = 'small' | 'medium'
export type SettingPlayerPannelSize = 'small' | 'medium'
export type TextWithImageContext = 'default' | 'cardEffectSummary' | 'cardTextAndIcon' | 'cardVpText' | 'portalButton' | 'wildButton'
| 'commandButton' | 'commandButtonSmall' | 'convertButton' | 'convertButtonTwoLines' | 'activateCardButton' | 'builderButton' | 'cardPrerequisite'
| 'milestone' | 'milestoneClaimed' | 'award' | 'milestoneAwardHelper' | 'convertResource'
export type MilestoneState = Record<MilestonesEnum, boolean>
export type InputRuleType = 'number' | 'string'
export type GoToPage = 'cardOverviewBalanced'
