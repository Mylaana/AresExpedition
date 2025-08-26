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
	ringCom = 'O8',
	clm = 'O9'
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
	playedDisplayTriggersAndNonActivableCorps = 'playedDisplayTriggersAndNonActivableCorps',
	playedDisplayRed = 'playedDisplayRed',
	developmentPhaseSecondBuilder = 'developmentPhaseSecondBuilder',
	corporations = 'corporations',
	notCorporations = 'notCorporations',
	authorizedTag = 'authorizedTag',
	doubleProduction = 'doubleProduction',
	redProject = 'redProject',
	ceo_Animal = 'ceoAnimal',
	ceo_Microbe = 'ceoMicrobe',
	ceo_Science = 'ceoScience'
}
export enum DiscardOptionsEnum {
	marsUniversity = 'marsUniversity',
	redraftedContracts = 'redraftedContracts',
	matterGenerator = 'matterGenerator',
	clm = 'CLM'
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
	researchGrant = 'researchGrant',
	conscription = 'conscription',
}
export enum EffectPortalEnum {
	decomposers,
	importedHydrogen,
	largeConvoy,
	viralEnhancer,
	biomedicalImports,
	cryogenticShipment,
	cargoShips,
	localHeatTrapping,
	pushnikAction,
	pushnikProduction,
	secretLabs,
	clm,
	decomposingFungus,
	greenhouses,
	ceo
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
	localHeatTrapping_Animal,

	pushnikAction_Microbe,
	pushnikAction_Animal,
	pushnikAction_Science,

	pushnikProduction_mc,
	pushnikProduction_heat,
	pushnikProduction_plant,

	secretLabs_Ocean,
	secretLabs_Oxygen,
	secretLabs_Temperature,

	clm_0,
	clm_2,
	clm_4,
	clm_7,
	clm_8,
	clm_9,
	clm_10,

	decomposingFungus_Animal,
	decomposingFungus_Microbe,

	greenhouses_1,
	greenhouses_2,
	greenhouses_3,
	greenhouses_4,

	ceo_Animal,
	ceo_Microbe,
	ceo_Science
}
export enum AwardsEnum {
	/** most phase upgraded*/
	visionary = 'A_VISIONARY',
    /** most heat production*/
	generator = 'A_GENERATOR',
    /** most cards played*/
	projectManager = 'A_PROJECT_MANAGER',
    /** most ressources on cards*/
	collecter = 'A_COLLECTER',
	/** most MC prod (without TR)*/
    celebrity = 'A_CELEBRITY',
    /** most steel + titanium*/
	industrialist = 'A_INDUSTRIALIST',
    /** most science tags*/
	researcher = 'A_RESEARCHER',
}
export enum MilestonesEnum {
	/**6 space tags*/
    spaceBaron = 'M_SPACE_BARON',
	/**15 TR*/
    terraformer = 'M_TERRAFORMER',
	/**6 red cards*/
    legend = 'M_LEGEND',
	/**3 forest*/
    gardener = 'M_GARDENER',
	/**12 projects*/
    planner = 'M_PLANNER',
	/**5 plant production*/
    farmer = 'M_FARMER',
	/**8 building tags*/
    builder = 'M_BUILDER',
	/**10 heat production*/
    energizer = 'M_ENERGIZER',
	/**8 green cards*/
    magnate = 'M_MAGNATE',
	/**9 different tags*/
    diversifier = 'M_DIVERSIFIER',
	/**6 blue cards*/
    tycoon = 'M_TYCOON',
}
