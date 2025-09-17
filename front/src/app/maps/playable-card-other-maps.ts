import { DeckQueryOptionsEnum, GlobalParameterNameEnum, ProjectFilterNameEnum, GlobalParameterColorEnum, BuilderOption, EffectPortalEnum } from "../enum/global.enum";
import { RessourceStock } from "../interfaces/global.interface";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { TriggerLimit } from "../types/project-card.type";
import { Checker } from "../utils/checker";
import { EventFactory } from "../factory/event/event-factory";
import { NonEventButtonNames } from "../types/global.type";

export const ALTERNATIVE_PAY_TRIGGER_LIST: string[] = [
	'5', '52'
]
export const PLAY_REQUIREMENTS: Record<string, (clientState: PlayerStateModel) => boolean> = {
	//AI Central
	'4':  (s) => Checker.isTagOk('science', 5, 'min', s),
	//Antigravity Technology
	'6':  (s) => Checker.isTagOk('science', 5, 'min', s),
	//Arctic Algae
	'8':  (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Asset Liquidation V2
	'11B': (s) => Checker.isTrOk(1, 'min', s),
	//Birds
	'12': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.white, 'min', s),
	//Caretaker Contract
	'14': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Decomposers
	'19': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Extreme-Cold Fungus
	'27': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', s),
	//Fish
	'30': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//GHG Producing Bacteria
	'31': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Greenhouses
	'32': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Herbivores
	'33': (s) => Checker.isOceanOk(5, 'min', s),
	//Livestock
	'39': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.yellow, 'min', s),
	//Physics Complex
	'46': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Physics Complex
	'48B': (s) => Checker.isTagOk('event', 2, 'min', s),
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
	//Local Heat Trapping
	'89': (s) => Checker.isRessourceOk('heat', 3, 'min', s),
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
	//Balanced Portfolios
	'115': (s) => Checker.isTrOk(1, 'min', s),
	//Beam from a Thorium Asteroid
	'116': (s) => Checker.isTagOk('jovian', 1, 'min', s),
	//Biomass Combustors
	'117': (s) => Checker.isRessourceOk('plant', 2, 'min', s),
	//Building Industries
	'120': (s) => Checker.isRessourceOk('heat', 4, 'min', s),
	//Bushes
	'121': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Designed Microorganisms
	'127': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'max', s),
	//Dust Quarry
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
	'205': (s) => Checker.isOceanOk(3, 'min', s),
	//Worms
	'207': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Zeppelins
	'208': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', s),
	//Dandelions
	'D24': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', s),
	//Urban Forestry
	'F20': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.yellow, 'min', s),
	//Seed Bank
	'F22': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.red, 'min', s),
	//Quant-Link Conferencing
	'F23': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.red, 'min', s),
	//Virtual Employee Development
	'D12': (s) => Checker.isTagOk('science', 3, 'min', s),
	//Imported Construction Crews
	'D17': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
	//Private Investor Beach
	'D19': (s) => Checker.isMilestoneOk(1, 'min', s),
	//Hematite Mining V2
	'D29B': (s) => Checker.isRessourceOk('heat', 5, 'min', s),
	//Filter Feeders
	'P04': (s) => Checker.isOceanOk(2, 'min', s),
	//Mercurian Alloys
	'FM6': (s) => Checker.isTagOk('science', 2, 'min', s),
	//Mercurian Alloys
	'FM11': (s) => Checker.isTagOk('science', 4, 'min', s),
	//Magnetic Shield
	'FM22': (s) => Checker.isTagOk('power', 3, 'min', s),
	//Red Spot Observatory
	'FM26': (s) => Checker.isTagOk('science', 3, 'min', s),
	//Jovian Lanterns
	'FM27': (s) => Checker.isTagOk('jovian', 1, 'min', s),
	//Conscription
	'FM28': (s) => Checker.isTagOk('earth', 2, 'min', s),
}
export const PLAY_EVENTS: Record<string, (clientstate: PlayerStateModel) => EventBaseModel[]> = {
	//Adaptation Technology
	'1': (state) => {
		state.setPrerequisiteOffset([
			{name: GlobalParameterNameEnum.infrastructure, offset: 1},
			{name: GlobalParameterNameEnum.oxygen, offset: 1},
			{name: GlobalParameterNameEnum.temperature, offset: 1}
		])
		return []
	},
	//Advanced Alloys
	'2': (state) => {
		state.increaseProductionModValue('steel')
		state.increaseProductionModValue('titanium')
		return []
	},
	//Assets Liquidation
	'11': () => [EventFactory.simple.specialBuilder(BuilderOption.assetLiquidation)],
	//Asset Liquidation v2
	'11B': () => [
		EventFactory.simple.addTR(-1),
		EventFactory.simple.draw(3),
		EventFactory.simple.specialBuilder(BuilderOption.assetLiquidation)
	],
	//Composting Factory
	'17': (state) => {
		state.addSellCardValueMod(1)
		return []
	},
	//Decomposing Fungus
	'20': () => [EventFactory.simple.addRessourceToCardId({name: 'microbe', valueStock: 2},'20')],
	//Extended Resources
	'26': () => [EventFactory.simple.increaseResearchScanKeep({keep: 1, scan: 0})],
	//Farming Co-ops
	'29': () => [EventFactory.simple.addRessource({name: 'plant', valueStock: 3})],
	//Interplanetary Relations
	'35': () => [EventFactory.simple.increaseResearchScanKeep({keep: 1, scan: 1})],
	//Interns
	'36': () => [EventFactory.simple.increaseResearchScanKeep({keep: 0, scan: 2})],
	//Nitrite Reducing Bacteria
	'43': () => [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:3}, '43')],
	//United Planetary Alliance
	'60': () => [EventFactory.simple.increaseResearchScanKeep({keep: 1, scan: 1})],
	//Wood Burning Stoves
	'64': () => [
		EventFactory.simple.addRessource({name: 'plant', valueStock: 4})],
	//Artificial Lake
	'66': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Atmosphere Filtering
	'67': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Bribed Committee
	'69': () => [
		EventFactory.simple.addTR(2)],
	//Business Contact
	'70': () => [EventFactory.simple.drawThenDiscard(4,2)],
	//CEO's Favorite Project
	'71': () => [EventFactory.simple.effectPortal(EffectPortalEnum.ceo)],
	//Comet
	'73': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Convoy from Europa
	'74': () => [
		EventFactory.simple.draw(1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Crater
	'75': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Deimos Down
	'76': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 3),
		EventFactory.simple.addRessource({name: 'megacredit', valueStock: 7})],
	//Giant Ice Asteroid
	'77': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Ice Asteroid
	'78': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Ice Cap Melting
	'79': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Imported Hyrdrogen
	'80': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		EventFactory.simple.effectPortal(EffectPortalEnum.importedHydrogen)
	],
	//Imported Nitrogen
	'81': () => [
		EventFactory.simple.addRessourceToSelectedCard({name: 'animal', valueStock: 2}),
		EventFactory.simple.addRessourceToSelectedCard({name: 'microbe', valueStock: 3}),
		EventFactory.simple.addRessource({name: 'plant', valueStock: 4}),
		EventFactory.simple.addTR(1)],
	//Invention Contest
	'83': () => [
		EventFactory.simple.scanKeep({scan: 3, keep: 1}, DeckQueryOptionsEnum.inventionContest)],
	//Investment Loan
	'84': () => [
		EventFactory.simple.addRessource({name: 'megacredit', valueStock: 10}),
		EventFactory.simple.addTR(-1)],
	//Lagrange Observatory
	'85': () => [
		EventFactory.simple.draw(1)],
	//Lake Marineris
	'86': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Large Convoy
	'87': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		EventFactory.simple.draw(2),
		EventFactory.simple.effectPortal(EffectPortalEnum.largeConvoy)
	],
	//Lava Flows
	'88': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2)],
	//Local Heat Trapping
	'89': () => [
		EventFactory.simple.addRessource({name:'plant', valueStock:4}),
		EventFactory.simple.effectPortal(EffectPortalEnum.localHeatTrapping)
	],
	//Mangrove
	'90': () => [
		EventFactory.simple.addForestAndOxygen(1)],
	//Nitrogen-Rich Asteroid
	'91': (state) => {
		let plants = 2
		if (state.getTagsOfType('plant') >= 3) plants += 4
		return [
			EventFactory.simple.addTR(2),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
			EventFactory.simple.addRessource({name: 'plant', valueStock: plants})
		]
	},
	//Permafrost Extraction
	'92': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Phobos Falls
	'93': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		EventFactory.simple.draw(2)],
	//Plantation
	'94': () => [
		EventFactory.simple.addForestAndOxygen(2)],
	//Release of Inert Gases
	'95': () => [
		EventFactory.simple.addTR(2)],
	//Research
	'96': () => [
		EventFactory.simple.draw(2)],
	//Subterranean Reservoir
	'98': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Technology Demonstration
	'99': () => [
		EventFactory.simple.draw(2),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Terraforming Ganymede
	'100': (state) => [
		EventFactory.simple.addTR(state.getTagsOfType('jovian'))],
	//Towing a Comet
	'101': () => [
		EventFactory.simple.addRessource({name: 'plant', valueStock: 2}),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Work Crews
	'102': () => [EventFactory.simple.specialBuilder(BuilderOption.workCrews)],
	//Acquired Company
	'103': () => [
		EventFactory.simple.addProduction({name: 'card', valueStock: 1})],
	//Adaptated Lichen
	'104': () => [
		EventFactory.simple.addProduction({name: 'plant', valueStock: 1})],
	//Aerated Magma
	'105': () => [
		EventFactory.simple.addProduction([
			{name: 'card', valueStock: 1},
			{name: 'heat', valueStock: 2}
		])],
	//Airborne Radiation
	'106': () => [
		EventFactory.simple.addProduction({name: 'heat', valueStock: 2}),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Cultivated Land (erreur dans ton ancien code, code 107 → nom corrigé)
	'107': () => [
		EventFactory.simple.addProduction({name: 'plant', valueStock: 2})],
	//Archaebacteria
	'108': () => [
		EventFactory.simple.addProduction({name: 'plant', valueStock: 1})],
	//Artificial Photosynthesis
	'109': () => [
		EventFactory.simple.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 1}
		])],
	//Asteroid Mining
	'110': () => [
		EventFactory.simple.addProduction({name: 'titanium', valueStock: 2})],
	//Asteroid Mining Consortium
	'111': () => [
		EventFactory.simple.addProduction({name: 'titanium', valueStock: 1})],
	//Astrofarm
	'112': () => [
		EventFactory.simple.addRessourceToSelectedCard({name: 'microbe', valueStock: 2}),
		EventFactory.simple.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	//Automated Factories
	'114': () => [
		EventFactory.simple.addProduction({name:'card', valueStock: 1}),
		EventFactory.simple.specialBuilder(BuilderOption.green9MCFree)
	],
	//Balanced Portfolios
	'115': () => [
		EventFactory.simple.addProduction({name:'megacredit', valueStock: 3}),
		EventFactory.simple.addTR(-1)
	],
	//Beam from a Thorium Asteroid
	'116': () => [
		EventFactory.simple.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	//Biomass Combustors
	'117': () => [
		EventFactory.simple.addProduction({name: 'heat', valueStock: 5}),
		EventFactory.simple.addRessource({name: 'plant', valueStock: -2})],
	//BioThermal Power
	'118': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 }),
		EventFactory.simple.addForestAndOxygen(1),
	],
	//Blueprints
	'119': () => [
		EventFactory.simple.addProduction([
		{ name: 'card', valueStock: 1 },
		{ name: 'megacredit', valueStock: 2 },
		]),
	],
	//Building Industries
	'120': () => [
		EventFactory.simple.addProduction({ name: 'steel', valueStock: 2 }),
		EventFactory.simple.addRessource({ name: 'heat', valueStock: -4 }),
	],
	//Bushes
	'121': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Callisto Penal Mines
	'122': () => [
		EventFactory.simple.addProduction({ name: 'card', valueStock: 1 }),
	],
	//Coal Imports
	'124': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 }),
	],
	//Commercial Districts
	'125': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 4 }),
	],
	//Deep Well Heating
	'126': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
	],
	//Designed Microorganisms
	'127': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 }),
	],
	//Diversified Interests
	'128': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
		EventFactory.simple.addRessource([
		{ name: 'plant', valueStock: 3 },
		{ name: 'heat', valueStock: 3 },
		]),
	],
	//Dust Quarry
	'129': () => [
		EventFactory.simple.addProduction({ name: 'steel', valueStock: 1 }),
	],
	//Economic Growth
	'130': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 3 }),
	],
	//Energy Storage
	'131': () => [
		EventFactory.simple.addProduction({ name: 'card', valueStock: 2 }),
	],
	//Eos Chasma National Park
	'132': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 3 }),
		EventFactory.simple.addRessourceToSelectedCard({ name: 'animal', valueStock: 1 }),
	],
	//Farming
	'133': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'plant', valueStock: 2 },
		]),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Food Factory
	'134': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 4 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: -2 }),
	],
	//Fuel factory
	'135': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'titanium', valueStock: 1 },
		]),
		EventFactory.simple.addRessource({ name: 'heat', valueStock: -3 }),
	],
	//Fuel Generators
	'136': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
		EventFactory.simple.addTR(-1),
	],
	//Fusion Power
	'137': () => [
		EventFactory.simple.addProduction({ name: 'card', valueStock: 1 }),
	],
	//Ganymede Shipyard
	'138': () => [
		EventFactory.simple.addProduction({ name: 'titanium', valueStock: 2 }),
	],
	//Gene Repair
	'139': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 }),
	],
	//Geothermal Power
	'140': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Giant Space Mirror
	'141': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 }),
	],
	//Grass
	'142': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 3 }),
	],
	//Great Dam
	'143': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Great Escarpment Consortium
	'144': () => [
		EventFactory.simple.addProduction({ name: 'steel', valueStock: 1 }),
	],
	//Heater
	'145': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 1 }),
	],
	//Immigration Shuttles
	'146': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 3 }),
	],
	//Import of Advanced GHG
	'147': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
	],
	//Imported GHG
	'148': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'heat', valueStock: 5 }),
	],
	//Industrial Center
	'149': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 3 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Industrial Farming
	'150': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'plant', valueStock: 2 },
		]),
	],
	//Industrial Microbes
	'151': () => [
		EventFactory.simple.addProduction([
		{ name: 'heat', valueStock: 1 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Io Mining Industry
	'153': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'titanium', valueStock: 2 },
		]),
	],
	//Kelp Farming
	'154': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 2 },
		{ name: 'plant', valueStock: 3 },
		]),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 2 }),
	],
	//Lichen
	'155': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
	],
	//Low-Atmo Shields
	'157': () => [
		EventFactory.simple.addProduction([
		{ name: 'megacredit', valueStock: 1 },
		{ name: 'heat', valueStock: 2 },
		]),
	],
	//Lunar Beam
	'158': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 4 }),
		EventFactory.simple.addTR(-1),
	],
	//Mass Converter
	'159': () => [
		EventFactory.simple.addProduction([
		{ name: 'heat', valueStock: 3 },
		{ name: 'titanium', valueStock: 1 },
		]),
	],
	//Methane from Titan
	'161': () => [
		EventFactory.simple.addProduction([
		{ name: 'plant', valueStock: 2 },
		{ name: 'heat', valueStock: 2 },
		]),
	],
	//Micromills
	'162': () => [
		EventFactory.simple.addProduction([
		{ name: 'heat', valueStock: 1 },
		{ name: 'steel', valueStock: 1 },
		]),
	],
	//Microprocessor
	'163': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 }),
		EventFactory.simple.drawThenDiscard(2,1),
	],
	//Mine
	'164': () => [
		EventFactory.simple.addProduction({ name: 'steel', valueStock: 2 }),
	],
	//Mohole Area
	'166': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 4 }),
	],
	//Monocultures
	'167': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 }),
		EventFactory.simple.addTR(-1),
	],
	//Moss
	'168': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: -1 }),
	],
	//Natural Preserve
	'169': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 }),
	],
	//New Portfolios
	'170': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'plant', valueStock: 1 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	//Nitrophilic Moss
	'171': () => [EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 })],
	//Noctis Farming
	'172': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 2 })
	],
	//Nuclear Plants
	'173': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'heat', valueStock: 3 }
		])
	],
	//Power plant
	'175': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 })],
	//Power Supply Consortium
	'176': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	//Protected Valley
	'177': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 }),
		EventFactory.simple.addForestAndOxygen(1)
	],
	//Quantum Extractor
	'178': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 })],
	//Rad Suits
	'179': () => [EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 })],
	//Slash and Burn Agriculture
	'182': () => [EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 })],
	//Smelting
	'183': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 5 }),
		EventFactory.simple.draw(2)
	],
	//Soil Warming
	'184': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//Solar Power
	'185': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 })],
	//Solar Trapping
	'186': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 }),
		EventFactory.simple.addRessource({ name: 'heat', valueStock: 3 }),
		EventFactory.simple.draw(1)
	],
	//Soletta
	'187': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 5 })],
	//Space Heaters
	'188': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
		EventFactory.simple.draw(1)
	],
	//Space Station
	'189': () => [EventFactory.simple.addProduction({ name: 'titanium', valueStock: 1 })],
	//Sponsor
	'190': () => [EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 })],
	//Strip Mine
	'191': () => [
		EventFactory.simple.addProduction([
			{ name: 'steel', valueStock: 2 },
			{ name: 'titanium', valueStock: 1 }
		]),
		EventFactory.simple.addTR(-1)
	],
	//Surface Mines
	'192': () => [
		EventFactory.simple.addProduction([
			{ name: 'steel', valueStock: 1 },
			{ name: 'titanium', valueStock: 1 }
		])
	],
	//Tectonic Stress Power
	'193': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 })],
	//Titanium Mine
	'194': () => [EventFactory.simple.addProduction({ name: 'titanium', valueStock: 1 })],
	//Toll Station
	'195': () => [
		EventFactory.simple.addProduction({name:'megacredit', valueStock: 3}),
		EventFactory.simple.specialBuilder(BuilderOption.green9MCFree)
	],
	//Trading Post
	'196': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 3 })
	],
	//Trapped Heat
	'197': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2 }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Trees
	'198': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 3 }),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 1 })
	],
	//Tropical Forest
	'199': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 4 }),
		EventFactory.simple.addRessource({ name: 'heat', valueStock: -5 })
	],
	//Tundra Farming
	'200': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'plant', valueStock: 1 }
		]),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 1 })
	],
	//Underground City
	'201': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'steel', valueStock: 1 }
		])
	],
	//Underseas Vents
	'202': () => [
		EventFactory.simple.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 4 }
		])
	],
	//Vesta Shipyard
	'204': () => [EventFactory.simple.addProduction({ name: 'titanium', valueStock: 1 })],
	//Wave Power
	'205': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 3 })],
	//Apollo Industries
	'D01': () => [EventFactory.simple.upgradePhaseCard(1, [1])],
	//Exocorp
	'D02': (clientState) => {
		clientState.addSellCardValueMod(1)
		return [EventFactory.simple.upgradePhaseCard(1, [4])]
	},
	//Exocorp v2
	'D02B': () => {
		return [EventFactory.simple.upgradePhaseCard(1, [4])]
	},
	//Hyperion Systems
	'D03': () => {
		return [EventFactory.simple.upgradePhaseCard(1, [2])]
	},
	//Hyperion Systems v2
	'D03B': () => {
		return [EventFactory.simple.upgradePhaseCard(1, [2])]
	},
	//Sultira
	'D04': () => [EventFactory.simple.upgradePhaseCard(1, [0])],
	//Communication Streamlining
	'D05': () => [
		EventFactory.simple.upgradePhaseCard(1, [2])
	],
	//Exosuits
	'D09': () => [EventFactory.simple.upgradePhaseCard(1)],
	//Fibrous Composite Material
	'D10': () => [EventFactory.simple.addRessourceToCardId({name:'science', valueStock:3}, 'D10')],
	//Software Streamlining
	'D11': () => [EventFactory.simple.upgradePhaseCard(1)],
	//Biomedical Imports
	'D14': () => [EventFactory.simple.effectPortal(EffectPortalEnum.biomedicalImports)],
	//Cryogentic Shipment
	'D15': (clientState) => {
		let events: EventBaseModel[] = [EventFactory.simple.upgradePhaseCard(1)]
		if(clientState.getPlayedListWithStockableTypes(['microbe', 'animal']).length!=0){
			events.push(EventFactory.simple.effectPortal(EffectPortalEnum.cryogenticShipment))
		}
		return events
	},
	//Exosuits
	'D16': () => [
		EventFactory.simple.draw(1),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Imported Construction Crews
	'D17': () => [EventFactory.simple.upgradePhaseCard(2)],
	//Ore Leaching
	'D18': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2),
		EventFactory.simple.draw(2),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Private Investor Beach
	'D19': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Topographic Mapping
	'D20': () => [
		EventFactory.simple.resolveWildTag('D20'),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//3D printing
	'D21': () => [EventFactory.simple.addProduction({name:'megacredit', valueStock:4})],
	//Biofoundries
	'D22': () => [
		EventFactory.simple.upgradePhaseCard(1),
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 2 })
	],
	//Blast Furnace
	'D23': () => [
		EventFactory.simple.upgradePhaseCard(1),
		EventFactory.simple.addProduction({ name: 'steel', valueStock: 1})
	],
	//Dandelions
	'D24': () => [EventFactory.simple.addProduction([{ name: 'card', valueStock: 1}, { name: 'plant', valueStock: 1}])],
	//Electric Arc Furnace
	'D25': () => [EventFactory.simple.addProduction({ name: 'steel', valueStock: 2})],
	//Local Market
	'D26': () => [
		EventFactory.simple.addProduction({name:'megacredit', valueStock:2}),
		EventFactory.simple.resolveWildTag('D26')
	],
	//Manufacturing Hub
	'D27': () => [
		EventFactory.simple.addProduction([{name:'megacredit', valueStock:2},{name:'heat', valueStock:1}]),
		EventFactory.simple.upgradePhaseCard(1),
	],
	//Heat reflective Glass
	'D28': () => [
		EventFactory.simple.addProduction({name:'heat', valueStock:1}),
		EventFactory.simple.upgradePhaseCard(1),
	],
	//Hematite Mining
	'D29': () => [
		EventFactory.simple.addProduction([
			{ name: 'card', valueStock: 2 },
			{ name: 'steel', valueStock: 1 }
		]),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Hematite Mining V2
	'D29B': () => [
		EventFactory.simple.addProduction([
			{ name: 'card', valueStock: 2 },
			{ name: 'steel', valueStock: 1 }
		]),
		EventFactory.simple.addRessource({name:'heat', valueStock:-5}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Hydroponic Gardens
	'D30': () => [
		EventFactory.simple.addProduction([{name:'megacredit', valueStock:3},{name:'plant', valueStock:1}]),
		EventFactory.simple.upgradePhaseCard(1),
	],
	//Ilmenite Deposits

	'D31': () => [EventFactory.simple.addProduction({name:'titanium', valueStock:2})],
	//Industrial Complex
	'D32': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 4 }),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Martian Museum
	'D33': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 1}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Metallurgy
	'D34': () => [
		EventFactory.simple.addProduction({ name: 'titanium', valueStock: 1}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Award Winning Reflector Material
	'D35': (clientstate) => {
		let result : EventBaseModel[] = [EventFactory.simple.addProduction({name:'heat', valueStock:3})]
		if(clientstate.getMilestoneCompleted()>0){
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:4}))
		}
		return result
	},
	//Oxidation Byproducts
	'D36': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 2}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Perfluorocarbon Production
	'D37': () => [
		EventFactory.simple.addProduction({ name: 'heat', valueStock: 1 }),
		EventFactory.simple.upgradePhaseCard(1, [0])
	],
	//Magnetic Field Generator
	'D38': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Political Influence
	'D39': () => [
		EventFactory.simple.addProduction({name:'megacredit', valueStock:3}),
		EventFactory.simple.resolveWildTag('D39')
	],
	//Biological Factories
	'D40': () => [
		EventFactory.simple.addProduction({ name: 'plant', valueStock: 1}),
		EventFactory.simple.upgradePhaseCard(1, [3])
	],
	//Nuclear Detonation Site
	'D41': () => [EventFactory.simple.addProduction({ name: 'heat', valueStock: 3})],
	//Warehouse
	'D42': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2}),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Architecture Blueprints
	'F09': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		EventFactory.simple.drawThenDiscard(2,1),
	],
	//Bedrock Wellbore
	'F10': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Callisto Skybridge
	'F11': (clientState) => {
		let infra = 1
		if(clientState.getTagsOfType('jovian')>3){
			infra++
		}
		return [EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, infra)]
	},
	//CHP Combustion Turbines
	'F12': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//City Planning
	'F13': () => [EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2)],
	//Grain Silos
	'F14': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 4 })
	],
	//City Planning
	'F15': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Jezero Crater Hospital
	'F16': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Low-Atmosphere Planes
	'F17': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 3)
	],
	//Power Grid Uplink
	'F18': () => [
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//Subways
	'F19': () => [EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)],
	//Urban Forestry
	'F20': () => [
		EventFactory.simple.addForestAndOxygen(1),
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: 5 })
	],
	//Microloans
	'F21': () => [
		EventFactory.simple.addProduction({ name: 'megacredit', valueStock: 2}),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)
	],
	//Seed Bank
	'F22': () => [EventFactory.simple.addProduction([{ name: 'plant', valueStock: 2}, { name: 'heat', valueStock: 3}])],
	//Quant-Link Conferencing
	'F23': () => [EventFactory.simple.addProduction({ name: 'card', valueStock: 1})],
	//Assorted Enterprises
	'P01': () => [EventFactory.simple.specialBuilder(BuilderOption.assortedEnterprises)],
	//Commercial Imports
	'P02': () => [
		EventFactory.simple.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 2 },
			{ name: 'plant', valueStock: 2 }
		])
	],
	//Matter Generator
	'P06': () => [EventFactory.simple.draw(2)],
	//Processed Metals
	'P07': (clientstate) => [
		EventFactory.simple.addProduction({ name: 'titanium', valueStock: 2 }),
		EventFactory.simple.draw(clientstate.getTagsOfType('power'))
	],
	//Processed Metals
	'P08': () => [EventFactory.simple.addProduction({name:'steel', valueStock:2})],
	//Synthetic Catastrophe
	'P10': () => [EventFactory.simple.recallCardInHandFromPlay()],
	//Research Grant
	'P24': (clientstate) => [
		EventFactory.simple.specialBuilder(BuilderOption.researchGrant)
	],
	//Innovative Technologies Award
	'P26': (clientstate) => [
		EventFactory.simple.addTR(clientstate.getPhaseCardUpgradedCount())
	],
	//Genetically Modified Vegetables
	'P28': (clientstate) => [
		EventFactory.simple.addProduction({name:'plant', valueStock:3})
	],
	//Glacial Evaporation
	'P29': () => [
		EventFactory.simple.addProduction({name:'heat', valueStock:4})
	],
	//Tourism
	'P30': (clientstate) => [
		EventFactory.simple.addProduction({name:'megacredit', valueStock:2}),
		EventFactory.simple.addTR(clientstate.getMilestoneCompleted())
	],
	//Modpro
	'P32': () => [
		EventFactory.simple.resolveWildTag('P32'),
	],
	//Ecoline
	'210': () => [EventFactory.simple.addProduction({name:'plant', valueStock:1})],
	//Ecoline
	'210B': () => [EventFactory.simple.addProduction({name:'plant', valueStock:3})],
	//Interplanetary Cinematics
	'212': () => [EventFactory.simple.addProduction({name:'steel', valueStock:1})],
	//Inventrix
	'213': (clientstate) => {
		clientstate.setPrerequisiteOffset([
			{name: GlobalParameterNameEnum.infrastructure, offset:1},
			{name: GlobalParameterNameEnum.oxygen, offset:1},
			{name: GlobalParameterNameEnum.temperature, offset:1}
		])
		return [EventFactory.simple.draw(3)]
	},
	//Mining Guild
	'214': () => {
		return [EventFactory.simple.addProduction({name:'steel', valueStock:1})]
	},
	//Mining Guild
	'214B': () => {
		return [EventFactory.simple.addProduction({name:'steel', valueStock:2})]
	},
	//Phobolog
	'215': (clientstate) => {
		clientstate.increaseProductionModValue('titanium')
		return [EventFactory.simple.addProduction({name:'titanium', valueStock:1})]
	},
	//Phobolog
	'215B': (clientstate) => {
		clientstate.increaseProductionModValue('titanium')
		return [EventFactory.simple.addProduction({name:'titanium', valueStock:2})]
	},
	//Saturn Systems
	'216': () => [
		EventFactory.simple.addProduction({name:'titanium', valueStock:1})
	],
	//Tharsis Republic
	'218': () => [
		EventFactory.simple.increaseResearchScanKeep({keep:1, scan:1})
	],
	//Thorgate
	'219': () => [
		EventFactory.simple.addProduction({name:'heat', valueStock:1})
	],
	//DevTechs
	'P14': () => [
		EventFactory.simple.scanKeep({scan:5, keep:1}, DeckQueryOptionsEnum.devTechs)
	],
	//Mai-Ni Productions
	'P16': () => [
		EventFactory.simple.specialBuilder(BuilderOption.maiNiProductions)
	],
	//Nebu Labs
	'P31': () => [
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Zetasel
	'P17': () => [EventFactory.simple.drawThenDiscard(5,4)],
	//Ringcom
	'CF4': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 3 },
			{ name: 'titanium', valueStock: 1 }
		]),
		//EventFactory.simple.scanKeep({scan:15, keep:2}, DeckQueryOptionsEnum.ringCom)
	],
	//Lili volunteering initiative
	'CF5': () => [
		EventFactory.simple.addProduction([{name:'megacredit', valueStock:2},{name:'plant', valueStock:1},{name:'heat', valueStock:1},{name:'card', valueStock:1}]),
		EventFactory.simple.upgradePhaseCard(1,[0,1])
	],
	//Aridor
	'CF6': ()=>  [EventFactory.simple.resolveWildTag('CF6')],
	//Recyclon
	'CF7': ()=>  [EventFactory.simple.addProduction({name:'steel', valueStock:1})],
	//Topsoil Contract
	'FM3': () => [EventFactory.simple.addRessource({name:'plant', valueStock:3})],
	//Rego Plastics
	'FM5': (state) => {
		state.increaseProductionModValue('steel')
		return []
	},
	//Mercurian Alloys
	'FM6': (state) => {
		state.increaseProductionModValue('titanium')
		return []
	},
	//Solar Probe
	'FM7': (state) => [
		EventFactory.simple.draw(Math.floor(state.getTagsOfType('science')/2))
	],
	//Social Event
	'FM8': (state) => [
		EventFactory.simple.addTR(Math.floor(Math.min(state.getTagsOfType('earth'), state.getTagsOfType('jovian'))))
	],
	//Bactoviral Research
	'FM9': (state) => [
		EventFactory.simple.addRessourceToSelectedCard({name:'microbe',valueStock:state.getTagsOfType('science')})
	],
	//Ceres Spaceport
	'FM10': (state) => [
		EventFactory.simple.addProduction({name:'titanium', valueStock:3}),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Ganymede Colony
	'FM13': () => [
		EventFactory.simple.addProduction([
			{ name: 'megacredit', valueStock: 2 },
		]),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)
	],
	//Lunar Embassy
	'FM16': () => [
		EventFactory.simple.draw(1),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		EventFactory.simple.addProduction({name:'megacredit', valueStock:3})
	],
	//Ecology research
	'FM17': () => [
		EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:2}),
		EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:1})
	],
	//Earth Elevator
	'FM19': () => [
		EventFactory.simple.addProduction([
			{ name: 'titanium', valueStock: 3 },
		]),
	],
	//Io Sulphur Research
	'FM21': (state) => [
		EventFactory.simple.draw(state.getTagsOfType('jovian')>=3?3:1)
	],
	//Magnetic shield
	'FM22': () => [
		EventFactory.simple.addTR(4),
	],
	//Red Spot Observatory
	'FM25': () => [
		EventFactory.simple.effectPortal(EffectPortalEnum.secretLabs),
	],
	//Red Spot Observatory
	'FM26': () => [
		EventFactory.simple.draw(2),
	],
	//Conscription
	'FM28': () => [EventFactory.simple.specialBuilder(BuilderOption.conscription)],
	//Research coordination
	'FM29': () => [
		EventFactory.simple.resolveWildTag('FM29'),
		EventFactory.simple.addProduction({name:'megacredit', valueStock:2})
	],
}
export const COST_MOD: Record<string, (card: PlayableCardModel) => number> = {
	//Earth Catapult
	'23': () => 2,
	//Energy Subsidies
	'25': (card) => card.hasTag('power') ? 4 : 0,
	//Interplanetary Conference
	'37': (card) => card.hasTag('earth') || card.hasTag('jovian')?3:0,
	//Media Group
	'42': (card) => card.hasTag('event') ? 5 : 0,
	//Research Outpost
	'51': () => 1,
	//Hohmann Transfer Shipping
	'D09': () => 1,
	//Orbital Outpost
	'P22': (card) => card.tagsId.filter((t) => t!=-1).length<=1? 3:0,
	//CrediCor
	'209': (card) => card.costInitial >= 20 ? 4 : 0,
	//Interplanetary Cinematics
	'212': (card) => card.hasTag('event') ? 2 : 0,
	//Teractor
	'217': (card) => card.hasTag('earth') ? 3 : 0,
	//Thorgate
	'219': (card) => card.hasTag('power') ? 3 : 0,
	//DevTechs
	'P14': (card) => card.isFilterOk?.({ type: ProjectFilterNameEnum.greenProject }) ? 2 : 0,
	//Exocorp v2
	'D02B': () => 1,
	//Solar Logistics
	'FM2': (card) => {
		return card.hasTag('space') && card.hasTag('event')?10:0
	},
	//Meat industry
	'FM4': (card) => card.hasTag('plant') || card.hasTag('animal')?3:0,
	//Space Relay
	'FM14': (card) => card.hasTag('jovian')? 5 : 0
}
export const TRIGGER_LIMIT: Record<string, ()=> TriggerLimit> = {
	'P19': ()=> {return {value:0, limit:5}},
}
export const SCALING_PRODUCTION: Record<string, (clientState: PlayerStateModel)=> RessourceStock[]> = {
	//Atospheric Insulators
	'113': (s)=> [{name:'heat', valueStock:s.getTagsOfType('earth')}],
	//Cartel
	'123': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('earth')}],
	//Insects
	'152': (s)=> [{name:'plant', valueStock:s.getTagsOfType('plant')}],
	//Lightning Harvest
	'156': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('science')}],
	//Medical lab
	'160': (s)=> [{name:'megacredit', valueStock:Math.floor(s.getTagsOfType('building') /2)}],
	//Miranda Resort
	'165': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('earth')}],
	//Power Grid
	'174': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('power')}],
	//Satellite Farms
	'180': (s)=> [{name:'heat', valueStock:s.getTagsOfType('space')}],
	//Satellites
	'181': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('space')}],
	//Venture Capitalism
	'203': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('event')}],
	//Windmills
	'206': (s)=> [{name:'heat', valueStock:s.getTagsOfType('power')}],
	//Worms
	'207': (s)=> [{name:'plant', valueStock:s.getTagsOfType('microbe')}],
	//Zeppelins
	'208': (s)=> [{name:'megacredit', valueStock:s.getForest()}],
	//Diverse Habitats
	'P03': (s)=> [{name:'megacredit', valueStock:(s.getTagsOfType('animal') + s.getTagsOfType('plant'))}],
	//Laboratories
	'P05': (s)=> [{name:'card', valueStock:Math.floor(s.getTagsOfType('science') /3)}],
	//Arklight B
	'P12B': (s)=> {
		let stock = s.getProjectPlayedStock('P12B')
		if(stock && stock.length<1){return []}
			return [{name:'megacredit',	valueStock: stock[0].valueStock}]
	},
	//Point Luna
	'CF1': (s)=> [{name:'megacredit', valueStock: Math.floor(s.getTagsOfType('earth')/ 2)}],
	//Ringcom
	'CF4': (s)=> [{name:'card', valueStock:Math.floor(s.getTagsOfType('jovian') /3)}],
	//Aridor
	'CF6': (s)=> [{name:'megacredit', valueStock:s.getDifferentTagTypeCount()}],
	//Lunar Embassy
	'FM16': (s)=> [{name:'plant', valueStock:Math.floor(s.getTagsOfType('earth') /2)}],
	//Ecology Research
	'FM17': (s)=> [{name:'plant', valueStock:Math.floor(s.getTagsOfType('science') /2)}],
	//Galilean Waystation
	'FM18': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('jovian')}],
	//Interplanetary Trade
	'FM20': (s)=> [{name:'megacredit', valueStock:s.getDifferentTagTypeCount()}],
}
export const ALTERNATIVE_PAY_BUTTON_NAME: Record<string,() => NonEventButtonNames> = {
	//Anaerobic Microorganisms
	'5': () => 'alternativePayAnaerobicMicroorganisms',
		//Anaerobic Microorganisms
	'52': () => 'alternativePayRestructuredResources'
}
export const ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS: Partial<Record<NonEventButtonNames, () => EventBaseModel[]>> ={
	'alternativePayAnaerobicMicroorganisms': () => [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:-2}, '5')],
	'alternativePayRestructuredResources': () => [EventFactory.simple.addRessource({name:'plant', valueStock:-1})]
}
export const ALTERNATIVE_PAY_REQUIREMENTS: Partial<Record<NonEventButtonNames, (clientState: PlayerStateModel) => boolean>> ={
	'alternativePayAnaerobicMicroorganisms': (c) => c.getProjectPlayedStock('5')[0].valueStock>=2,
	'alternativePayRestructuredResources': (c) => Checker.isRessourceOk('plant', 1, 'min', c),
}
