export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'cardSelectorPlayZone' | 'generic' | 'deck' | 'targetCard'

export type EventCardSelectorSubType = 'selectCardOptionalSell' | 'selectCardForcedSell' | 'actionPhase'
| 'discardCards' | 'scanKeepResult' | 'researchPhaseResult'
export type EventCardSelectorRessourceSubType = 'addRessourceToSelectedCard'
export type EventCardSelectorPlayZoneSubType = 'developmentPhase' | 'constructionPhase'
export type EventGenericSubType = 
'endOfPhase' | 'productionPhase' | 'planificationPhase' | 'upgradePhaseCards'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep'
export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger' 
export type EventDeckQuerySubType = 'drawQuery' | 'scanKeepQuery'
export type EventTechnical = 'default' | 'createEeventOptionalSell' | 'cancelEventOptionalSell'
export type EventUnionSubTypes = EventCardSelectorSubType | EventCardSelectorRessourceSubType | EventCardSelectorPlayZoneSubType
| EventGenericSubType | EventTargetCardSubType | EventDeckQuerySubType | EventTechnical


//'selectCard' |