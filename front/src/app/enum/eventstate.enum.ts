export enum EventStateTypeEnum {
	oceanFlipped = 'OCEAN_FLIPPED',
	discard = 'DISCARD',
	builderDevelopemntLocked =  'PHASE_BUILDER_DEVELOPMENT_LOCKED',
    builderConstructionLocked = 'PHASE_BUILDER_CONSTRUCTION_LOCKED',
	cardActivator = 'CARD_ACTIVATOR',
	drawCards = 'DRAW_CARDS',
	drawCardsUnqueried = 'DRAW_CARDS_UNQUERIED',
	drawThenDiscardUnqueried = 'DRAW_THEN_DISCARD_UNQUERIED',
	researchCardsQueried = 'RESEARCH_CARDS_QUERIED',
	scanKeepQueried = 'SCAN_KEEP_QUERIED',
	scanKeepUnQueried = 'SCAN_KEEP_UNQUERIED',
	targetCardAddRessource = 'TARGET_CARD_ADD_RESSOURCE',
	specialBuilder = 'SPECIAL_BUILDER',
	increaseResearchScanKeep = 'INCREASE_RESEARCH_SCANKEEP',
	generic = 'GENERIC',
	productionCards = 'PRODUCTION_CARDS',
	tagSelection = 'TAG_SELECTION',

	/*
	addRessourceToPlayer = 'ADD_RESSOURCE_TO_PLAYER',
	upgradePhase = 'UPGRADE_PHASE',
	addProduction = 'ADD_PRODUCTION',
	*/

	undefined = 'UNDEFINED'
}

export enum EventStateOriginEnum {
	load = 'LOAD',
	create = 'CREATE'
}
