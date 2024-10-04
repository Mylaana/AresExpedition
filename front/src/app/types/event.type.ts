export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorPlayZone' | 'generic' | 'deck' | 'targetCard' | 'waiter'

export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell' | 'actionPhase'
| 'discardCards' | 'scanKeepResult' | 'researchPhaseResult'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardSelectorPlayZoneSubType = 'developmentPhase' | 'constructionPhase'
export type EventGenericSubType = 
'endOfPhase' | 'productionPhase' | 'planificationPhase' | 'upgradePhaseCards'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger' 
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery'
export type EventTechnical = 'default' | 'createEventOptionalSell' | 'cancelEventOptionalSell'
export type EventWaiterSubType = 'deckWaiter'
export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardSelectorPlayZoneSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType


//'selectCard' |