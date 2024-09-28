export type EventType = 'cardSelector' | 'cardSelectorRessource' | 'generic' | 'draw' | 'targetCard'

export type EventCardSelectorSubType = 'optionalSell' | 'forcedSell' | 'selectCard' | 'selectCardToBuild' | 'selectCardToActivate'
| 'discardCards' | 'scanKeepResult' | 'addRessourceToSelectedCard'

export type EventGenericSubType = 
'endOfPhase' | 'production' | 'planification' | 'upgradePhase' | 'research'
| 'increaseGlobalParameter' | 'addRessourceToPlayer' | 'increaseResearchScanKeep'

export type EventTargetCardSubType = 'addRessourceToCardId' | 'deactivateTrigger' 

export type EventDrawSubType = 'drawQuery' | 'scanKeepQuery'