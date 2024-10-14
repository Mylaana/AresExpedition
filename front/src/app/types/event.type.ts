export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorCardBuilder' | 'generic' | 'deck' | 'targetCard' | 'waiter'

export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell' | 'actionPhase'
| 'discardCards' | 'scanKeepResult' | 'researchPhaseResult'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardBuilderSubType = 'developmentPhaseBuilder' | 'constructionPhaseBuilder'
export type EventGenericSubType = 
'endOfPhase' | 'developmentPhase' | 'constructionPhase' | 'productionPhase' | 'researchPhase'| 'planificationPhase' | 'upgradePhaseCards'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep' | 'buildCard' | 'drawResult'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger' 
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery' | 'researchPhaseQuery'
export type EventTechnical = 'default' | 'createEventOptionalSell' | 'cancelEventOptionalSell'
export type EventWaiterSubType = 'deckWaiter'
export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardBuilderSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical | EventWaiterSubType

//'selectCard' |