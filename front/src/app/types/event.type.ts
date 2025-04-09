export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorCardBuilder' | 'generic' | 'deck' | 'targetCard' | 'waiter' | 'phase'

export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell' | 'actionPhase'
| 'discardCards' | 'scanKeepResult' | 'researchPhaseResult' | 'selectStartingHand'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardBuilderSubType = 'developmentPhaseBuilder' | 'constructionPhaseBuilder'
export type EventGenericSubType =  'endOfPhase' | 'planificationPhase' | 'upgradePhaseCards'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
| 'waitingGroupReady' | 'addForestPoint'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger'
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery'
export type EventTechnical = 'default'
export type EventWaiterSubType = 'deckWaiter'
export type EventPhaseSubType = 'developmentPhase' | 'constructionPhase' | 'productionPhase' | 'researchPhase'

export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardBuilderSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType | EventPhaseSubType

//'selectCard' |
