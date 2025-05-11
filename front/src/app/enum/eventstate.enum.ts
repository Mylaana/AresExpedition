export enum EventStateTypeEnum {
	oceanFlipped = 'OCEAN_FLIPPED',
	discard = 'DISCARD',
	builderDevelopemntLocked =  'PHASE_BUILDER_DEVELOPMENT_LOCKED',
    builderConstructionLocked = 'PHASE_BUILDER_CONSTRUCTION_LOCKED',
	cardActivator = 'CARD_ACTIVATOR',

	undefined = 'UNDEFINED'
}

export enum EventStateOriginEnum {
	client = 'CLIENT',
	server = 'SERVER'
}
