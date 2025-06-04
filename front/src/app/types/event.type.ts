export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorCardBuilder' | 'generic' | 'deck' | 'targetCard' | 'waiter' | 'phase' | 'cardActivator' | 'scanKeepSelector'
export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell'| 'discardCards' | 'researchPhaseResult'
| 'selectStartingHand' | 'selectCorporation' | 'scanKeepResult'
export type EventCardActivatorSubType = 'actionPhaseActivator'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardBuilderSubType = 'developmentPhaseBuilder' | 'constructionPhaseBuilder'
export type EventGenericSubType =  'endOfPhase' | 'planificationPhase' | 'upgradePhaseCards' | 'oceanQuery'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
| 'waitingGroupReady' | 'addForestPointAndOxygen' | 'addProduction' | 'addTr'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger'
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery'
export type EventTechnical = 'default'
export type EventWaiterSubType = 'deckWaiter'
export type EventPhaseSubType = 'developmentPhase' | 'constructionPhase' | 'productionPhase' | 'researchPhase' | 'actionPhase'
export type EventScanKeepResult = 'scanKeepResult'

export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardBuilderSubType | EventScanKeepResult
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType | EventPhaseSubType | EventCardActivatorSubType
