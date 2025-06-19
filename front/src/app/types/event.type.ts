export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorCardBuilder' | 'generic' | 'deck' | 'targetCard' | 'waiter' | 'phase' | 'cardActivator' | 'ComplexSelector' | 'tagSelector'
export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell' | 'researchPhaseResult'
| 'selectStartingHand' | 'selectCorporation' | 'scanKeepResult'
export type EventCardActivatorSubType = 'actionPhaseActivator'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardBuilderSubType = 'developmentPhaseBuilder' | 'constructionPhaseBuilder' | 'specialBuilder'
export type EventGenericSubType =  'endOfPhase' | 'planificationPhase' | 'upgradePhaseCards' | 'oceanQuery'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
| 'waitingGroupReady' | 'addForestPointAndOxygen' | 'addProduction' | 'addTr' | 'loadProductionPhaseCards' | 'drawResultThenDiscard'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger' | 'addTagToCardId'
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery' | 'drawThenDiscard'
export type EventTechnical = 'default'
export type EventWaiterSubType = 'deckWaiter'
export type EventPhaseSubType = 'developmentPhase' | 'constructionPhase' | 'productionPhase' | 'researchPhase' | 'actionPhase'
export type EventComplexCardSelectorSubType = 'scanKeepResult' | 'discardCards'
export type EventTagSelectorSubType = 'tagSelector'

export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardBuilderSubType | EventComplexCardSelectorSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType | EventPhaseSubType | EventCardActivatorSubType
| EventTagSelectorSubType
