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
	actionPhaseScan = 'O6',
	modPro = 'O7',
	ringCom = 'O8'
}
export enum ProjectFilterNameEnum {
	undefined = 'undefined',
	greenProject = 'greenProject',
	blueOrRedProject = 'blueOrRedProject',
	blueProject = 'blueProject',
	syntheticCatastrophe = 'syntheticCatastrophe',
	action = 'action',
	stockable = 'stockable',
	hasTagEvent = 'hasTagEvent',
	hasTagPlantOrScience = 'hasTagPlantOrScience',
	green9MCFree = 'green9MCFree',
	maiNiProductions = 'maiNiProductions',
	playedDisplayCorpsAndActivable = 'playedDisplayCorpsAndActivable',
	playedDisplayCorpsAndTriggers = 'playedDisplayCorpsAndTriggers',
	playedDisplayRed = 'playedDisplayRed',
	developmentPhaseSecondBuilder = 'developmentPhaseSecondBuilder',
	corporations = 'corporations',
	notCorporations = 'notCorporations',
	authorizedTag = 'authorizedTag',
	doubleProduction = 'doubleProduction'
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
	researchGrant = 'researchGrant'
}
export enum EffectPortalEnum {
	decomposers,
	importedHydrogen,
	largeConvoy,
	viralEnhancer,
	biomedicalImports,
	cryogenticShipment,
	cargoShips,
	localHeatTrapping
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
	cargoShips_Heat,

	localHeatTrapping_Microbe,
	localHeatTrapping_Animal
}
