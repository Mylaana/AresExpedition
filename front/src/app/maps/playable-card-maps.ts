import { DeckQueryOptionsEnum, GlobalParameterNameEnum, DiscardOptionsEnum, ProjectFilterNameEnum, GlobalParameterColorEnum, BuilderOption } from "../enum/global.enum";
import { SelectablePhaseEnum } from "../enum/phase.enum";
import { EventFactory } from "../factory/event factory/event-factory";
import { RessourceStock } from "../interfaces/global.interface";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { PlayableCard } from "../factory/playable-card.factory";
import { ActivationOption } from "../types/project-card.type";
import { Checker } from "../utils/checker";

const S = EventFactory.simple
function getScaling(cardCode: string, clientState: PlayerStateModel){
	return PlayableCard.activable.getScalingCostActivation(cardCode, clientState)
}
export const ACTIVATION_DOUBLE: string[] = [
	'18', //Conserved Biome
	'27', //Extreme-Cold Fungus
	'31', //GHG Producing Bacteria
	'43', //Nitrite Reducing Bacteria
	'50', //Regolith Eaters,
	'P11', //Self Replicating Bacteria
]
export const ACTIVATION_NO_COST: string[] = ['3', '4', '13', '15', '16', '18', 'CP02', 'P20']

export const ACTIVATION_EVENTS: Record<string, (cardCode: string, clientState: PlayerStateModel, activationOption: ActivationOption) => EventBaseModel[]> = {
	// Advanced Screening Technology
	'3': () => [S.scanKeep({ scan: 3, keep: 1 }, DeckQueryOptionsEnum.advancedScreeningTechnology)],
	// AI Central
	'4': () => [S.draw(2)],
	// Aquifer Pumping
	'7': (cardCode, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Artificial Jungle
	'9': () => [S.addRessource({ name: 'plant', valueStock: -1 }), S.draw(1)],
	// Asset Liquidation
	'11': () => [
		S.addTR(-1),
		S.draw(3)
	],
	// Birds
	'12': (cardCode) => [S.addRessourceToCardId({ name: 'animal', valueStock: 1 }, cardCode)],
	// BrainStorming Session
	'13': () => [S.scanKeep({ scan: 1, keep: 0 }, DeckQueryOptionsEnum.brainstormingSession)],
	// Caretaker Contract
	'14': () => [S.addRessource({ name: 'heat', valueStock: -8 }), S.addTR(1)],
	// Circuit Board Factory
	'15': () => [S.draw(1)],
	// Community Gardens
	'16': (_, clientState) => {
		const ressources: RessourceStock[] = [{ name: 'megacredit', valueStock: 2 }];
		if (clientState.getPhaseSelected() === SelectablePhaseEnum.action) {
		ressources.push({ name: 'plant', valueStock: 1 });
		}
		return [S.addRessource(ressources)];
	},
	// Conserved Biomes (Activation 1 or 2)
	'18': (_, __, option) => [
		option === 1 ? S.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 }) :
		option === 2 ? S.addRessourceToSelectedCard({ name: 'animal', valueStock: 1 }) :
		undefined
	].filter(Boolean) as EventBaseModel[],
	// Decomposing Fungus
	'20': () => [S.addRessource({ name: 'plant', valueStock: 3 })],
	// Developed Infrastructure
	'21': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	// Development Center
	'22': () => [
		S.addRessource({ name: 'heat', valueStock: -2 }),
		S.draw(1)],
	// Conserved Biomes
	'27': (_, __, option) => [
		option === 1 ? S.addRessource({ name: 'plant', valueStock: 1 }) :
		option === 2 ? S.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 }) :
		undefined
	].filter(Boolean) as EventBaseModel[],
	// Farmers Market
	'28': () => [
		S.addRessource([
		{ name: 'megacredit', valueStock: -1 },
		{ name: 'plant', valueStock: 2 }
		])],
	// Farming Co-ops
	'29': () => [
		S.discard(1),
		S.addRessource({ name: 'plant', valueStock: 3 })],
	// GHG Producing Bacteria
	'31': (cardCode, _, option) => option === 1
		? [S.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			S.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
			]
		: [],
	// Hydro-Electric Energy
	'34': (_, clientState) => {
		let value = 2;
		if (clientState.getPhaseSelected() === SelectablePhaseEnum.action) value++;
		return [
		S.addRessource([
			{ name: 'megacredit', valueStock: -1 },
			{ name: 'heat', valueStock: value }
		])
		];
	},
	// Ironworks
	'38': () => [
		S.addRessource({ name: 'heat', valueStock: -4 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	// Matter Manufacturing
	'41': () => [
		S.addRessource({ name: 'megacredit', valueStock: -1 }),
		S.draw(1)],
	// Nitrite Reducing Bacteria
	'43': (cardCode, _, option) => option === 1
		? [S.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			S.addRessourceToCardId({ name: 'microbe', valueStock: -3 }, cardCode),
			S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
			]
		: [],
	// Redrafted Contracts
	'49': () => [S.discardOptions(1, 'min', DiscardOptionsEnum.redraftedContracts)],
	// Regolith Eaters
	'50': (cardCode, _, option) => option === 1
		? [S.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			S.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)
			]
		: [],
	// Solarpunk
	'54': (cardCode, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState) }),
		S.addForestAndOxygen(1)],
	// Steelworks
	'56': () => [
		S.addRessource([
		{ name: 'heat', valueStock: -6 },
		{ name: 'megacredit', valueStock: 2 }
		]),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	// Symbiotic Fungus
	'57': () => [S.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 })],
	// Tardigrades
	'58': (cardCode) => [S.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)],
	// Think Tank
	'59': () => [S.draw(1)],
	// Volcanic Pools
	'62': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Water Import from Europa
	'63': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Wood Burning Stoves
	'64': (card, clientState) => [
		S.addRessource({ name: 'plant', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	// Sawmill
	'F08': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)],
	// Matter Generator
	'P06': () => [
		S.discard(1),
		S.addRessource({ name: 'megacredit', valueStock: 6 })],
	// Progressive Policies
	'P09': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	// Self Replicating Bacteria
	'P11': (cardCode, _, option) => option === 1
		? [S.addRessourceToCardId({ name: 'microbe', valueStock: 1}, cardCode)]
		: option === 2
		? [
			S.addRessourceToCardId({ name: 'microbe', valueStock: -5}, cardCode),
			S.specialBuilder(BuilderOption.selfReplicatingBacteria)
			]
		: [],
	// Community Afforestation
	'P20': (_, clientState) => [S.draw(1 + clientState.getMilestoneCompleted())],
	// Community Afforestation
	'P21': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState)}),
		S.addForestAndOxygen(1)],
	// Gas-Cooled Reactors
	'P23': (card, clientState) => [
		S.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState)}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	// Celestior
	'CP02': () => [S.scanKeep({ scan: 3, keep: 1 }, DeckQueryOptionsEnum.celestior)]
}
export const ACTIVATION_SCALING_COST: Record<string, (clientstate: PlayerStateModel) => number> = {
	//Aquifer Pumping
	'7': (clientstate) => Math.max(0, 10 - (clientstate.getRessourceInfoFromType('steel')?.valueProd??0) * 2),
	// Developed Infrastructure
	'21': (state) => state.getProjectPlayedModelList({ type: ProjectFilterNameEnum.blueProject }).length >= 5 ? 5 : 10,
	// Solarpunk
	'54': (state) => Math.max(0, 15 - (state.getRessourceInfoFromType('titanium')?.valueProd ?? 0) * 2),
	// Volcanic Pools
	'62': (state) => Math.max(0, 12 - state.getTagsOfType('power')),
	// Water Import from Europa
	'63': (state) => Math.max(0, 12 - (state.getRessourceInfoFromType('titanium')?.valueProd ?? 0)),
	// Wood Burning Stoves
	'64': (state) => Math.max(0, 4 - Number(state.getPhaseSelected() === SelectablePhaseEnum.action)),
	// Sawmill
	'F08': (state) => Math.max(0, 10 - state.getTagsOfType('plant') * 2),
	// Progressive Policies
	'P09': (state) => state.getTagsOfType('event') >= 4 ? 5 : 10,
	// Community Afforestation
	'P21': (state) => 14 - state.getMilestoneCompleted() * 4,
	// Gas-Cooled Reactors
	'P23': (state) => 12 - state.getPhaseCardUpgradedCount() * 2,

	// SPECIALS
	// Convert Forest - Ecoline
	'ConvertForest': (state) => state.getTriggersIdActive().includes('C2') ? 7 : 8,
	// Buy Forest - Standard Technology
	'buyForest': (state) => state.getTriggersIdActive().includes('55') ? 10 : 14,
	// Buy Infrastructure - Standard Technology
	'buyInfrastructure': (state) => state.getTriggersIdActive().includes('55') ? 11 : 15,
	// Buy Ocean - Standard Technology
	'buyOcean': (state) => state.getTriggersIdActive().includes('55') ? 12 : 16,
	// Buy Temperature - Standard Technology
	'buyTemperature': (state) => state.getTriggersIdActive().includes('55') ? 10 : 14,
}
export const ACTIVATION_SCALING_COST_CAPTION: Record<string, (clientState: PlayerStateModel) => string> = {
	//Aquifer Pumping
	'7': (state) => `$ressource_megacreditvoid_${getScaling('7', state)}$: $other_ocean$`,
	//Developed Infrastructure
	'21': (state) => `$ressource_megacreditvoid_${getScaling('21', state)}$: $other_temperature$`,
	//Solarpunk
	'54': (state) => `$ressource_megacreditvoid_${getScaling('54', state)}$: $other_forest$`,
	//Volcanic Pools
	'62': (state) => `$ressource_megacreditvoid_${getScaling('62', state)}$: $other_ocean$`,
	//Water Import from Europa
	'63': (state) => `$ressource_megacreditvoid_${getScaling('63', state)}$: $other_ocean$`,
	//Wood Burning Stoves
	'64': (state) => `$-${getScaling('64', state)}$ressource_plant$: $other_temperature$`,
	//Sawmill
	'F08': (state) => `$ressource_megacreditvoid_${getScaling('F08', state)}$: $other_infrastructure$`,
	//Progressive Policies
	'P09': (state) => `$ressource_megacreditvoid_${getScaling('P09', state)}$: $other_oxygen$`,
	//City Council
	'P20': (state) => {
		let caption :string = ''
		for(let i=0; i< (1 + state.getMilestoneCompleted()); i++){
			caption += '$ressource_card$'
		}
		return caption
	},
	//Community Afforestation
	'P21': (state) => `$ressource_megacreditvoid_${getScaling('P21', state)}$: $other_forest$`,
	//Gas-Cooled Reactors
	'P23': (state) => `$ressource_megacreditvoid_${getScaling('P23', state)}$: $other_temperature$`,

	// SPECIAL
	'ConvertForest': (state) => `${getScaling('ConvertForest', state)}$ressource_plant$ $other_arrow$ $other_forest$`,
	'buyForest': (state) => `$ressource_megacreditvoid_${getScaling('buyForest', state)}$ $other_arrow$ $other_forest$`,
	'buyInfrastructure': (state) => `$ressource_megacreditvoid_${getScaling('buyInfrastructure', state)}$ $other_arrow$ $skipline$ $other_infrastructure$ + $ressource_card$`,
	'buyOcean': (state) => `$ressource_megacreditvoid_${getScaling('buyOcean', state)}$ $other_arrow$ $other_ocean$`,
	'buyTemperature': (state) => `$ressource_megacreditvoid_${getScaling('buyTemperature', state)}$ $other_arrow$$other_temperature$`,
}
export const ACTIVATE_REQUIREMENTS: Record<string, (activationOption: ActivationOption, clientState: PlayerStateModel) => boolean> = {
	// Aquifer Pumping
	'7': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('7', clientState), 'min', clientState),
	// Artificial Jungle
	'9': (_, clientState) => Checker.isRessourceOk('plant', 1, 'min', clientState),
	// Asset Liquidation
	'11': (_, clientState) => Checker.isTrOk(1, 'min', clientState),
	// Caretaker Contract
	'14': (_, clientState) => Checker.isRessourceOk('heat', 8, 'min', clientState),
	// Decomposing Fungus
	'20': () => false,
	// Developed Infrastructure
	'21': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('21', clientState), 'min', clientState),
	// Development Center
	'22': (_, clientState) => Checker.isRessourceOk('heat', 2, 'min', clientState),
	// Extreme-Cold Fungus
	'27': (activationOption, clientState) => activationOption === 1 || clientState.hasProjectPlayedOfFilterType({ type: ProjectFilterNameEnum.stockable, stockableType: 'microbe' }),
	// Farmers Market
	'28': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	// Farming Co-ops
	'29': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	// GHG Producing Bacteria
	'31': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('31').some(s => s.name === 'microbe' && s.valueStock >= 2),
	// Hydro-Electric Energy
	'34': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	// Ironworks
	'38': (_, clientState) => Checker.isRessourceOk('heat', 4, 'min', clientState),
	// Matter Manufacturing
	'41': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	// Nitrite Reducing Bacteria
	'43': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('43').some(s => s.name === 'microbe' && s.valueStock >= 3),
	// Redrafted contracts
	'49': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	// Regolith Eaters
	'50': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('50').some(s => s.name === 'microbe' && s.valueStock >= 2),
	// Solarpunk
	'54': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('54', clientState), 'min', clientState),
	// Steelworks
	'56': (_, clientState) => Checker.isRessourceOk('heat', 6, 'min', clientState),
	// Steelworks (duplicate ID?)
	'59': (_, clientState) => Checker.isRessourceOk('megacredit', 2, 'min', clientState),
	// Volcanic Pools
	'62': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('62', clientState), 'min', clientState),
	// Water Import from Europa
	'63': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('63', clientState), 'min', clientState),
	// Wood Burning Stoves
	'64': (_, clientState) =>  Checker.isRessourceOk('plant', getScaling('64', clientState), 'min', clientState),
	// Sawmill
	'F08': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('F08', clientState), 'min', clientState),
	// Matter Generator
	'P06': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	// Progressive Policies
	'P09': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P09', clientState), 'min', clientState),
	// Self Replicating Bacteria
	'P11': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('P11').some(s => s.name === 'microbe' && s.valueStock >= 5),
	// Community Afforestation
	'P21': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P21', clientState), 'min', clientState),
	// Gas-Cooled Reactors
	'P23': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P23', clientState), 'min', clientState),
}
export const PLAY_REQUIREMENTS: Record<string, (clientState: PlayerStateModel) => boolean> = {
	//AI Central
	'4':  (s) => Checker.isTagOk('science', 5, 'min', s),
	//Antigravity Technology
	'6':  (s) => Checker.isTagOk('science', 5, 'min', s),
	//Arctic Algae
	'8':  (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Birds
	'12': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.white, 'min', s),
	//Caretaker Contract
	'14': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Extreme-Cold Fungus
	'27': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', s),
	//Fish
	'30': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//GHG Producing Bacteria
	'31': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Herbivores
	'33': (s) => Checker.isOceanOk(5, 'min', s),
	//Livestock
	'39': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.yellow, 'min', s),
	//Physics Complex
	'46': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Regolith Eaters
	'50': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Small Animals
	'53': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Symbiotic Fungus
	'57': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Advanced Ecosystems
	'65': (s) =>
		Checker.isTagOk('animal', 1, 'min', s) &&
		Checker.isTagOk('plant', 1, 'min', s) &&
		Checker.isTagOk('microbe', 1, 'min', s),
	//Artificial Lake
	'66': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Atmosphere filtering
	'67': (s) => Checker.isTagOk('science', 2, 'min', s),
	//Breathing Filters
	'68': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.yellow, 'min', s),
	//Colonizer Training Camp
	'72': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'max', s),
	//Crater
	'75': (s) => Checker.isTagOk('event', 3, 'min', s),
	//Ice Cap Melting
	'79': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', s),
	//Interstellar Colony Ship
	'82': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Investment Loan
	'84': (s) => Checker.isTrOk(1, 'min', s),
	//Lake Marineris
	'86': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Mangrove
	'90': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Permafrost Extraction
	'92': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', s),
	//Plantation
	'94': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Aerated Magma
	'105': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Airborne Radiation
	'106': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Algae
	'107': (s) => Checker.isOceanOk(5, 'min', s),
	//Archaebacteria
	'108': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', s),
	//Beam from a Thorium Asteroid
	'116': (s) => Checker.isTagOk('jovian', 1, 'min', s),
	//Biomass Combustors
	'117': (s) => Checker.isTagOk('plant', 2, 'min', s),
	//Building Industries
	'120': (s) => Checker.isRessourceOk('heat', 4, 'min', s),
	//Bushes
	'121': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Designed Microorganisms
	'127': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'max', s),
	//Designed Microorganisms
	'129': (s) => Checker.isOceanOk(3, 'max', s),
	//Energy Storage
	'131': (s) => Checker.isTrOk(7, 'min', s),
	//Eos Chasma National Park
	'132': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Farming
	'133': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', s),
	//Food factory
	'134': (s) => Checker.isRessourceOk('plant', 2, 'min', s),
	//Fuel factory
	'135': (s) => Checker.isRessourceOk('heat', 3, 'min', s),
	//Fuel Generators
	'136': (s) => Checker.isTrOk(1, 'min', s),
	//Fusion Power
	'137': (s) => Checker.isTagOk('power', 2, 'min', s),
	//Gene Repair
	'139': (s) => Checker.isTagOk('science', 3, 'min', s),
	//Grass
	'142': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Great Dam
	'143': (s) => Checker.isOceanOk(2, 'min', s),
	//Kelp Farming
	'154': (s) => Checker.isOceanOk(6, 'min', s),
	//Low-Atmo Shields
	'157': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Lunar Beam
	'158': (s) => Checker.isTrOk(1, 'min', s),
	//Mass Converter
	'159': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Methane from Titan
	'161': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Monocultures
	'167': (s) => Checker.isTrOk(1, 'min', s),
	//Moss
	'168': (s) => Checker.isOceanOk(3, 'min', s) && Checker.isRessourceOk('plant', 1, 'min', s),
	//Natural Preserve
	'169': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Noctis Farming
	'172': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Quantum Extractor
	'178': (s) => Checker.isTagOk('science', 3, 'min', s),
	//Rad Suits
	'179': (s) => Checker.isOceanOk(2, 'min', s),
	//Strip Mine
	'191': (s) => Checker.isTrOk(1, 'min', s),
	//Trapped Heat
	'197': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Trees
	'198': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Tropical Forest
	'199': (s) => Checker.isRessourceOk('heat', 5, 'min', s),
	//Tundra Farming
	'200': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Wave Power
	'203': (s) => Checker.isOceanOk(3, 'min', s),
	//Worms
	'207': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Zeppelins
	'208': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Dandelions
	'D24': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Urban Forestry
	'F20': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.yellow, 'min', s),
	//Filter Feeders
	'P04': (s) => Checker.isOceanOk(2, 'min', s),
}
export const PLAY_EVENTS: Record<string, (clientstate: PlayerStateModel) => EventBaseModel[]> = {
	// Adaptation Technology
	'1': (state) => {
		state.setPrerequisiteOffset([
			{name: GlobalParameterNameEnum.infrastructure, offset: 1},
			{name: GlobalParameterNameEnum.oxygen, offset: 1},
			{name: GlobalParameterNameEnum.temperature, offset: 1}
		])
		return []
	},
	// Advanced Alloys
	'2': (state) => {
		state.increaseProductionModValue('steel')
		state.increaseProductionModValue('titanium')
		return []
	},
	// Assets Liquidation
	'11': () => [S.specialBuilder(BuilderOption.assetLiquidation)],
	// Composting Factory
	'17': (state) => {
		state.addSellCardValueMod(1)
		return []
	},
	// Decomposing Fungus
	'20': () => [S.addRessourceToSelectedCard({name: 'microbe', valueStock: 2})],
	// Extended Resources
	'26': () => [S.increaseResearchScanKeep({keep: 1, scan: 0})],
	// Farming Co-ops
	'29': () => [S.addRessource({name: 'plant', valueStock: 3})],
	// Interplanetary Relations
	'35': () => [S.increaseResearchScanKeep({keep: 1, scan: 1})],
	// Interns
	'36': () => [S.increaseResearchScanKeep({keep: 0, scan: 2})],
	// United Planetary Alliance
	'60': () => [S.increaseResearchScanKeep({keep: 1, scan: 1})],
	// Wood Burning Stoves
	'64': () => [
		S.addRessource({name: 'plant', valueStock: 4})],
	// Artificial Lake
	'66': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Atmosphere Filtering
	'67': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	// Bribed Committee
	'69': () => [
		S.addTR(2)],
	// Business Contact
	'70': () => [
		S.draw(4),
		S.discard(2)],
	// Comet
	'73': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Convoy from Europa
	'74': () => [
		S.draw(1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Crater
	'75': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Deimos Down
	'76': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 3),
		S.addRessource({name: 'megacredit', valueStock: 7})],
	// Giant Ice Asteroid
	'77': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	// Ice Asteroid
	'78': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	// Ice Cap Melting
	'79': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Imported Nitrogen
	'81': () => [
		S.addRessourceToSelectedCard({name: 'animal', valueStock: 2}),
		S.addRessourceToSelectedCard({name: 'microbe', valueStock: 3}),
		S.addRessource({name: 'plant', valueStock: 4}),
		S.addTR(1)],
	// Invention Contest
	'83': () => [
		S.scanKeep({scan: 3, keep: 1})],
	// Investment Loan
	'84': () => [
		S.addRessource({name: 'megacredit', valueStock: 10}),
		S.addTR(-1)],
	// Lagrange Observatory
	'85': () => [
		S.draw(1)],
	// Lake Marineris
	'86': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	// Lava Flows
	'88': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2)],
	// Mangrove
	'90': () => [
		S.addForestAndOxygen(1)],
	// Nitrogen-Rich Asteroid
	'91': (state) => {
		let plants = 2
		if (state.getTagsOfType('plant') >= 3) plants += 4
		return [
			S.addTR(2),
			S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
			S.addRessource({name: 'plant', valueStock: plants})
		]
	},
	// Permafrost Extraction
	'92': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Phobos Falls
	'93': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		S.draw(2)],
	// Plantation
	'94': () => [
		S.addForestAndOxygen(2)],
	// Release of Inert Gases
	'95': () => [
		S.addTR(2)],
	// Research
	'96': () => [
		S.draw(2)],
	// Subterranean Reservoir
	'98': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Technology Demonstration
	'99': () => [
		S.draw(2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Terraforming Ganymede
	'100': (state) => [
		S.addTR(state.getTagsOfType('jovian'))],
	// Towing a Comet
	'101': () => [
		S.addRessource({name: 'plant', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	// Work Crews
	'102': () => [S.specialBuilder(BuilderOption.workCrews)],
	// Acquired Company
	'103': () => [
		S.addProduction({name: 'card', valueStock: 1})],
	// Adaptated Lichen
	'104': () => [
		S.addProduction({name: 'plant', valueStock: 1})],
	// Aerated Magma
	'105': () => [
		S.addProduction([
			{name: 'card', valueStock: 1},
			{name: 'heat', valueStock: 2}
		])],
	// Airborne Radiation
	'106': () => [
		S.addProduction({name: 'heat', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	// Cultivated Land (erreur dans ton ancien code, code 107 → nom corrigé)
	'107': () => [
		S.addProduction({name: 'plant', valueStock: 2})],
	// Archaebacteria
	'108': () => [
		S.addProduction({name: 'plant', valueStock: 1})],
	// Artificial Photosynthesis
	'109': () => [
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 1}
		])],
	// Asteroid Mining
	'110': () => [
		S.addProduction({name: 'titanium', valueStock: 2})],
	// Asteroid Mining Consortium
	'111': () => [
		S.addProduction({name: 'titanium', valueStock: 1})],
	// Astrofarm
	'112': () => [
		S.addRessourceToSelectedCard({name: 'microbe', valueStock: 2}),
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	// Automated Factories
	'114': () => [
		S.addProduction({name:'card', valueStock: 1}),
		S.specialBuilder(BuilderOption.green9MCFree)
	],
	// Beam from a Thorium Asteroid
	'116': () => [
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	// Biomass Combustors
	'117': () => [
		S.addProduction({name: 'heat', valueStock: 5}),
		S.addRessource({name: 'plant', valueStock: -2})],
	// BioThermal Power
	'118': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.addForestAndOxygen(1),
	],
	//Blueprints
	'119': () => [
		S.addProduction([
		{ name: 'card', valueStock: 1 },
		{ name: 'heat', valueStock: 1 },
		]),
	],
	//Building Industries
	'120': () => [
		S.addProduction({ name: 'steel', valueStock: 2 }),
		S.addRessource({ name: 'heat', valueStock: -4 }),
	],
	//Bushes
	'121': () => [
		S.addProduction({ name: 'plant', valueStock: 2 }),
		S.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Callisto Penal Mines
	'122': () => [
		S.addProduction({ name: 'card', valueStock: 1 }),
	],
	//Coal Imports
	'124': () => [
		S.addProduction({ name: 'heat', valueStock: 3 }),
	],
	//Commercial Districts
	'125': () => [
		S.addProduction({ name: 'megacredit', valueStock: 4 }),
	],
	//Deep Well Heating
	'126': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
	],
	//Designed Microorganisms
	'127': () => [
		S.addProduction({ name: 'plant', valueStock: 2 }),
	],
	//Diversified Interests
	'128': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource([
		{ name: 'plant', valueStock: 3 },
		{ name: 'heat', valueStock: 3 },
		]),
	],
	//Dust Quarry
	'129': () => [
		S.addProduction({ name: 'steel', valueStock: 1 }),
	],
	//Economic Growth
	'130': () => [
		S.addProduction({ name: 'megacredit', valueStock: 3 }),
	],
	//Energy Storage
	'131': () => [
		S.addProduction({ name: 'card', valueStock: 2 }),
	],
	//Eos Chasma National Park
	'132': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
		S.addRessource({ name: 'plant', valueStock: 3 }),
		S.addRessourceToSelectedCard({ name: 'animal', valueStock: 1 }),
	],
	//Farming
	'133': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'plant', valueStock: 2 },
		]),
		S.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Food Factory
	'134': () => [
		S.addProduction({ name: 'megacredit', valueStock: 4 }),
		S.addRessource({ name: 'plant', valueStock: -2 }),
	],
	//Fuel factory
	'135': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'titanium', valueStock: 1 },
		]),
		S.addRessource({ name: 'heat', valueStock: -3 }),
	],
	//Fuel Generators
	'136': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
		S.addTR(-1),
	],
	//Fusion Power
	'137': () => [
		S.addProduction({ name: 'card', valueStock: 1 }),
	],
	//Ganymede Shipyard
	'138': () => [
		S.addProduction({ name: 'titanium', valueStock: 2 }),
	],
	//Gene Repair
	'139': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
	],
	//Geothermal Power
	'140': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Giant Space Mirror
	'141': () => [
		S.addProduction({ name: 'heat', valueStock: 3 }),
	],
	//Grass
	'142': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource({ name: 'plant', valueStock: 3 }),
	],
	//Great Dam
	'143': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Great Escarpment Consortium
	'144': () => [
		S.addProduction({ name: 'steel', valueStock: 1 }),
	],
	//Heater
	'145': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource({ name: 'plant', valueStock: 1 }),
	],
	//Immigration Shuttles
	'146': () => [
		S.addProduction({ name: 'megacredit', valueStock: 3 }),
	],
	//Import of Advanced GHG
	'147': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Imported GHG
	'148': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.addRessource({ name: 'heat', valueStock: 5 }),
	],
	//Industrial Center
	'149': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 3 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Industrial Farming
	'150': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'plant', valueStock: 2 },
		]),
	],
	//Industrial Microbes
	'151': () => [
		S.addProduction([
		{ name: 'heat', valueStock: 1 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Io Mining Industry
	'153': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'titanium', valueStock: 2 },
		]),
	],
	//Kelp Farming
	'154': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'plant', valueStock: 3 },
		]),
		S.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Lichen
	'155': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
	],
	//Low-Atmo Shields
	'157': () => [
		S.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'heat', valueStock: 2 },
		]),
	],
	//Lunar Beam
	'158': () => [
		S.addProduction({ name: 'heat', valueStock: 4 }),
		S.addTR(-1),
	],
	//Mass Converter
	'159': () => [
		S.addProduction([
		{ name: 'heat', valueStock: 3 },
		{ name: 'titanium', valueStock: 1 },
		]),
	],
	//Methane from Titan
	'161': () => [
		S.addProduction([
		{ name: 'plant', valueStock: 2 },
		{ name: 'heat', valueStock: 2 },
		]),
	],
	//Micromills
	'162': () => [
		S.addProduction([
		{ name: 'heat', valueStock: 1 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Microprocessor
	'163': () => [
		S.addProduction({ name: 'heat', valueStock: 3 }),
		S.draw(2),
		S.discard(1),
	],
	//Mine
	'164': () => [
		S.addProduction({ name: 'steel', valueStock: 2 }),
	],
	//Mohole Area
	'166': () => [
		S.addProduction({ name: 'heat', valueStock: 4 }),
	],
	//Monocultures
	'167': () => [
		S.addProduction({ name: 'plant', valueStock: 2 }),
		S.addTR(-1),
	],
	//Moss
	'168': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource({ name: 'plant', valueStock: -1 }),
	],
	//Natural Preserve
	'169': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
	],
	// New Portfolios
	'170': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'plant', valueStock: 1 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	// Nitrophilic Moss
	'171': () => [S.addProduction({ name: 'plant', valueStock: 2 })],
	// Noctis Farming
	'172': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource({ name: 'plant', valueStock: 2 })
	],
	// Nuclear Plants
	'173': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'heat', valueStock: 3 }
		])
	],
	// Power plant
	'175': () => [S.addProduction({ name: 'heat', valueStock: 1 })],
	// Power Supply Consortium
	'176': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	// Protected Valley
	'177': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
		S.addForestAndOxygen(1)
	],
	// Quantum Extractor
	'178': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	// Rad Suits
	'179': () => [S.addProduction({ name: 'megacredit', valueStock: 2 })],
	// Slash and Burn Agriculture
	'182': () => [S.addProduction({ name: 'plant', valueStock: 2 })],
	// Smelting
	'183': () => [
		S.addProduction({ name: 'heat', valueStock: 5 }),
		S.draw(2)
	],
	// Soil Warming
	'184': () => [
		S.addProduction({ name: 'plant', valueStock: 2 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	// Solar Power
	'185': () => [S.addProduction({ name: 'heat', valueStock: 1 })],
	// Solar Trapping
	'186': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.addRessource({ name: 'heat', valueStock: 3 }),
		S.draw(1)
	],
	// Soletta
	'187': () => [S.addProduction({ name: 'heat', valueStock: 5 })],
	// Space Heaters
	'188': () => [S.addProduction({ name: 'heat', valueStock: 2 })],
	// Space Station
	'189': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	// Sponsor
	'190': () => [S.addProduction({ name: 'megacredit', valueStock: 2 })],
	// Strip Mine
	'191': () => [
		S.addProduction([
			{ name: 'steel', valueStock: 2 },
			{ name: 'titanium', valueStock: 1 }
		]),
		S.addTR(-1)
	],
	// Surface Mines
	'192': () => [
		S.addProduction([
			{ name: 'steel', valueStock: 1 },
			{ name: 'titanium', valueStock: 1 }
		])
	],
	// Tectonic Stress Power
	'193': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	// Titanium Mine
	'194': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	// Toll Station
	'195': () => [
		S.addProduction({name:'megacredit', valueStock: 3}),
		S.specialBuilder(BuilderOption.green9MCFree)
	],
	// Trading Post
	'196': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
		S.addRessource({ name: 'plant', valueStock: 2 })
	],
	// Trapped Heat
	'197': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	// Trees
	'198': () => [
		S.addProduction({ name: 'plant', valueStock: 3 }),
		S.addRessource({ name: 'plant', valueStock: 1 })
	],
	// Tropical Forest
	'199': () => [
		S.addProduction({ name: 'megacredit', valueStock: 4 }),
		S.addRessource({ name: 'heat', valueStock: -5 })
	],
	// Tundra Farming
	'200': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'plant', valueStock: 1 }
		]),
		S.addRessource({ name: 'plant', valueStock: 1 })
	],
	// Underground City
	'201': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'steel', valueStock: 1 }
		])
	],
	// Underseas Vents
	'202': () => [
		S.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 4 }
		])
	],
	// Vesta Shipyard
	'204': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	// Wave Power
	'205': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	// Topographic Mapping
	'D20': () => [
		S.selectTag('D20'),
		S.upgradePhaseCard(1)
	],
	// 3D printing
	'D21': () => [S.addProduction({name:'megacredit', valueStock:4})],
	// Biofoundries
	'D22': () => [
		S.upgradePhaseCard(1),
		S.addProduction({ name: 'plant', valueStock: 2 })
	],
	// Blast Furnace
	'D23': () => [
		S.upgradePhaseCard(1),
		S.addProduction({ name: 'steel', valueStock: 1})
	],
	// Dandelions
	'D24': () => [S.addProduction([{ name: 'card', valueStock: 1}, { name: 'plant', valueStock: 1}])],
	// Electric Arc Furnace
	'D25': () => [S.addProduction({ name: 'steel', valueStock: 2})],
	// Local Market
	'D26': () => [
		S.addProduction({name:'megacredit', valueStock:2}),
		S.selectTag('D26')
	],
	// Manufacturing Hub
	'D27': () => [
		S.addProduction([{name:'megacredit', valueStock:2},{name:'heat', valueStock:1}]),
		S.upgradePhaseCard(1),
	],
	// Heat reflective Glass
	'D28': () => [
		S.addProduction({name:'heat', valueStock:1}),
		S.upgradePhaseCard(1),
	],
	// Hematite Mining
	'D29': () => [
		S.addProduction([
			{ name: 'card', valueStock: 2 },
			{ name: 'steel', valueStock: 1 }
		])
	],
	// Hydroponic Gardens
	'D30': () => [
		S.addProduction([{name:'megacredit', valueStock:3},{name:'plant', valueStock:1}]),
		S.upgradePhaseCard(1),
	],
	// Industrial Complex
	'D32': () => [
		S.addProduction({ name: 'heat', valueStock: 4 }),
		S.upgradePhaseCard(1)
	],
	// Award Winning Reflector Material
	'D35': (clientstate) => {
		let result : EventBaseModel[] = [S.addProduction({name:'heat', valueStock:3})]
		if(clientstate.getMilestoneCompleted()>0){
			S.addRessource({name:'heat', valueStock:4})
		}
		return result
	},
	// Perfluorocarbon Production
	'D37': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.upgradePhaseCard(1, [0])
	],
	// Political Influence
	'D39': () => [
		S.addProduction({name:'heat', valueStock:2}),
		S.selectTag('D39')
	],
	// Biological Factories
	'D40': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.upgradePhaseCard(1, [3])
	],
	// Architecture Blueprints
	'F09': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.draw(2),
		S.discard(1)
	],
	// Bedrock Wellbore
	'F10': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	// CHP Combustion Turbines
	'F12': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	// Grain Silos
	'F14': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		S.addRessource({ name: 'plant', valueStock: 4 })
	],
	// Low-Atmosphere Planes
	'F17': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 3)
	],
	// Urban Forestry
	'F20': () => [
		S.addForestAndOxygen(1),
		S.addRessource({ name: 'megacredit', valueStock: 5 })
	],
	// Assorted Enterprises
	'P01': () => [S.specialBuilder(BuilderOption.assortedEnterprises)],
	// Commercial Imports
	'P02': () => [
		S.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 2 },
			{ name: 'plant', valueStock: 2 }
		])
	],
	// Matter Generator
	'P06': () => [S.draw(2)],
	// Processed Metals
	'P07': (clientstate) => [
		S.addProduction({ name: 'titanium', valueStock: 2 }),
		S.draw(clientstate.getTagsOfType('power'))
	],
	//Processed Metals
	'P08': () => [S.addProduction({name:'steel', valueStock:2})],
	//Innovative Technologies Award
	'P26': (clientstate) => [
		S.addTR(clientstate.getPhaseCardUpgradedCount())
	],
	//Genetically Modified Vegetables
	'P28': (clientstate) => [
		S.addProduction({name:'plant', valueStock:3})
	],
	//Glacial Evaporation
	'P29': () => [
		S.addProduction({name:'heat', valueStock:4})
	],
	//Tourism
	'P30': (clientstate) => [
		S.addProduction({name:'megacredit', valueStock:2}),
		S.addTR(clientstate.getMilestoneCompleted())
	],
	//Interplanetary Cinematics
	'C4': () => [S.addProduction({name:'steel', valueStock:1})],
	//Inventrix
	'C5': (clientstate) => {
		clientstate.setPrerequisiteOffset([
			{name: GlobalParameterNameEnum.infrastructure, offset:1},
			{name: GlobalParameterNameEnum.oxygen, offset:1},
			{name: GlobalParameterNameEnum.temperature, offset:1}
		])
		return [S.draw(3)]
	},
	//Phobolog
	'C7': (clientstate) => {
		clientstate.increaseProductionModValue('titanium')
		return [S.addProduction({name:'titanium', valueStock:1})]
	},
	//Saturn Systems
	'C8': () => [
		S.addProduction({name:'titanium', valueStock:1})
	],
	//Tharsis Republic
	'C10': () => [
		S.increaseResearchScanKeep({keep:1, scan:1})
	],
	//Thorgate
	'C11': () => [
		S.addProduction({name:'heat', valueStock:1})
	],
	//DevTechs
	'CP03': () => [
		S.scanKeep({scan:5, keep:1}, DeckQueryOptionsEnum.devTechs)
	],
	//Mai-Ni Productions
	'CP05': () => [
		S.specialBuilder(BuilderOption.maiNiProductions)
	],
	//Zetasel
	'CP06': () => [
		S.draw(5),
		S.discard(4)
	],
	//Point Luna
	'CF1': () => [
		S.addProduction({name:'titanium', valueStock:1})
	]
}
export const COST_MOD: Record<string, (card: PlayableCardModel) => number> = {
	//Earth Catapult
	'23': () => 2,
	//Energy Subsidies
	'25': (card) => card.hasTag('power') ? 4 : 0,
	//Interplanetary Conference
	'37': (card) => {
		let mod = 0
		if (card.hasTag('earth')){ mod += 3}
		if (card.hasTag('jovian')){mod += 3}
		return mod
	},
	//Media Group
	'42': (card) => card.hasTag('event') ? 5 : 0,
	//Research Outpost
	'51': () => 1,
	//Orbital Outpost
	'P22': (card) => card.tagsId.filter((t) => t!=-1).length<=1? 3:0,
	//CreditCor
	'C1': (card) => card.costInitial >= 20 ? 4 : 0,
	//Interplanetary Cinematics
	'C4': (card) => card.hasTag('event') ? 2 : 0,
	//Teractor
	'C9': (card) => card.hasTag('earth') ? 3 : 0,
	//Thorgate
	'C11': (card) => card.hasTag('power') ? 3 : 0,
	//DevTechs
	'CP03': (card) => card.isFilterOk?.({ type: ProjectFilterNameEnum.greenProject }) ? 2 : 0
}
