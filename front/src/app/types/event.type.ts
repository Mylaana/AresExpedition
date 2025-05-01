export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorCardBuilder' | 'generic' | 'deck' | 'targetCard' | 'waiter' | 'phase' | 'cardActivator'

export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell'
| 'discardCards' | 'scanKeepResult' | 'researchPhaseResult' | 'selectStartingHand' | 'selectCorporation'
export type EventCardActivatorSubType = 'actionPhaseActivator'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardBuilderSubType = 'developmentPhaseBuilder' | 'constructionPhaseBuilder'
export type EventGenericSubType =  'endOfPhase' | 'planificationPhase' | 'upgradePhaseCards'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
| 'waitingGroupReady' | 'addForestPoint'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger'
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery'
export type EventTechnical = 'default'
export type EventWaiterSubType = 'deckWaiter'
export type EventPhaseSubType = 'developmentPhase' | 'constructionPhase' | 'productionPhase' | 'researchPhase' | 'actionPhase'

export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardBuilderSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType | EventPhaseSubType | EventCardActivatorSubType

//'selectCard' |
