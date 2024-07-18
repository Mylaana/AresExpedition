export type RGB = `rgb(${number}, ${number}, ${number})`;
/**this should be used for player selection */
export type SelectablePhase = undefined | "development" | "construction" | "action" | "production" | "research"
/**this should only be used for non-player related events/core game mechanics as players cannot select planification phase*/
export type NonSelectablePhase = "planification" | "development" | "construction" | "action" | "production" | "research"
export type StandardState = 'default' | 'disabled'
export type MinMaxEqualType = 'min' | 'max' | 'equal'
export type EventType = 'endOfPhase' | 'optionalSell' | 'forcedSell' | 'selectCard' | 'selectCardToBuild' | 'selectCardToActivate' | 'production' | 'planification'
export type ButtonNames =
 'validatePlanification' | 'validateResearch' | 'validateDevelopment' | 'validateConstruction'| 'validateAction' | 'validateProduction'
| 'sellCardsEndPhase' | 'defaultValidate'
| 'selectFirstCard' | 'cancelFirstCard' | 'buildFirstCard'
| 'selectSecondCard' | 'cancelSecondCard' | 'buildSecondCard'
| 'selectAlternative'
export type GlobalParameterName = 'oxygen' | 'temperature' | 'ocean' | 'infrastructure'
export type GlobalParameterColor = 'purple' | 'red' | 'yellow' | 'white'