export type RGB = `rgb(${number}, ${number}, ${number})`;
/**this should be used for player selection */
export type SelectablePhase = undefined | "development" | "construction" | "action" | "production" | "research"
/**this should only be used for non-player related events/core game mechanics as players cannot select planification phase*/
export type NonSelectablePhase = "planification" | "development" | "construction" | "action" | "production" | "research"
export type StandardState = 'default' | 'disabled'
export type MinMaxEqualType = 'min' | 'max' | 'equal'
export type EventType = 
'endOfPhase' | 'optionalSell' | 'forcedSell' | 'selectCard' | 'selectCardToBuild' | 'selectCardToActivate' 
| 'production' | 'planification' | 'upgradePhase' | 'research' | 'drawCards' | 'discardCards'
| 'increaseGlobalParameter' | 'ressourceGain' | 'cardRessourceGain' | 'increaseResearchScanValue' | 'increaseResearchKeepValue'
| 'deactivateTrigger' | 'addRessourceToTargetCard'
export type ButtonNames =
'defaultValidate' 
| 'validatePlanification' | 'validateResearch' | 'validateDevelopment' | 'validateConstruction'| 'validateAction' | 'validateProduction'
| 'sellCardsEndPhase' | 'callOptionalSellCards' | 'validateOptionalSellCards'
| 'selectFirstCard' | 'cancelFirstCard' | 'buildFirstCard'
| 'selectSecondCard' | 'cancelSecondCard' | 'buildSecondCard'
| 'selectAlternative'
| 'upgradePhase'
| 'drawCards' | 'discardCards'
| 'addRessourceToSelectedCard'
export type GlobalParameterName = 'oxygen' | 'temperature' | 'ocean' | 'infrastructure'
export type GlobalParameterColor = 'purple' | 'red' | 'yellow' | 'white'
export type RessourceType = 'megacredit' | 'plant' | 'heat' | 'steel' | 'titanium' | 'card'
export type AdvancedRessourceType = 'microbe' | 'animal' | 'science'
export type TagType = 'building' | 'space' | 'science' | 'power' | 'earth' | 'jovian' | 'plant' | 'animal' | 'microbe' | 'event' | 'wild'
export type TagInfo = {
    id: number;
    description: TagType;
    imageUrl: string;
    textTagName: string;
};