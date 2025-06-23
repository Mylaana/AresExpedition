export enum GlobalParameterNameEnum {
	infrastructure = 'INFRASTRUCTURE',
	ocean = 'OCEAN',
	temperature = 'TEMPERATURE',
	oxygen = 'OXYGEN'
}
export enum GlobalParameterColorEnum {
	purple = 'PURPLE',
	red = 'RED',
	yellow = 'YELLOW',
	white = 'WHITE'
}
export enum OceanBonusEnum {
	megacredit = 'MEGACREDIT',
	card = 'CARD',
	plant = 'PLANT'
}
export enum DeckQueryOptionsEnum {
	brainstormingSession = 'O1',
	celestior = 'O2',
	devTechs = 'O3',
	advancedScreeningTechnology = 'O4',
	inventionContest = 'O5',
	actionPhaseScan = 'O6'
}
export enum ProjectFilterNameEnum {
	undefined = 'undefined',
	greenProject = 'greenProject',
	blueOrRedProject = 'blueOrRedProject',
	action = 'action',
	stockable = 'stockable',
	blueProject = 'blueProject',
	hasTagEvent = 'hasTagEvent',
	hasTagPlantOrScience = 'hasTagPlantOrScience',
	green9MCFree = 'green9MCFree',
	maiNiProductions = 'maiNiProductions',
	playedDisplayCorpsAndActivable = 'playedDisplayCorpsAndActivable',
	playedDisplayTriggers = 'playedDisplayTriggers',
	playedDisplayRed = 'playedDisplayRed',
	developmentPhaseSecondBuilder = 'developmentPhaseSecondBuilder'
}
export enum DiscardOptionsEnum {
	marsUniversity = 'marsUniversity',
	redraftedContracts = 'redraftedContracts',
	matterGenerator = 'matterGenerator'
}
export enum BuilderOption {
	//Phase builders
	gain6MC = 'gain6MC',
	drawCard = 'drawCard',
	developmentSecondBuilder = 'developmentSecondBuilder',

	//Special builders
	workCrews = 'workCrews',
	assetLiquidation = 'assetLiquidation',
	green9MCFree = 'green9MCFree',
	assortedEnterprises = 'assortedEnterprises',
	selfReplicatingBacteria = 'selfReplicatingBacteria',
	maiNiProductions = 'maiNiProductions',
}
export enum EffectPortalEnum {
	decomposers,
	importedHydrogen,
	largeConvoy,
	viralEnhancer,
	biomedicalImports,
	cryogenticShipment,
	cargoShips,
}
export enum EffectPortalButtonEnum {
	decomposers_Add,
	decomposers_Draw,

	importedHydrogen_Plant,
	importedHydrogen_Microbe,
	importedHydrogen_Animal,

	largeConvoy_Plant,
	largeConvoy_Animal,

	viralEnhancer_Plant,
	viralEnhancer_Microbe,
	viralEnhancer_Animal,

	biomedicalImports_Oxygen,
	biomedicalImports_Upgrade,

	cryogenticShipment_Microbe,
	cryogenticShipment_Animal,

	cargoShips_Plant,
	cargoShips_Heat
}