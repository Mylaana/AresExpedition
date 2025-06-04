export enum EventStateTypeEnum {
	oceanFlipped = 'OCEAN_FLIPPED',
	discard = 'DISCARD',
	builderDevelopemntLocked =  'PHASE_BUILDER_DEVELOPMENT_LOCKED',
    builderConstructionLocked = 'PHASE_BUILDER_CONSTRUCTION_LOCKED',
	cardActivator = 'CARD_ACTIVATOR',
	drawCards = 'DRAW_CARDS',
	productionCards = 'PRODUCTION_CARDS',
	researchCardsQueried = 'RESEARCH_CARDS_QUERIED',

	undefined = 'UNDEFINED'
}

export enum EventStateOriginEnum {
	client = 'CLIENT',
	server = 'SERVER'
}
