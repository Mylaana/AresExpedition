import { DeckQueryOptionsEnum, GlobalParameterNameEnum, ProjectFilterNameEnum, GlobalParameterColorEnum, BuilderOption, EffectPortalEnum } from "../enum/global.enum";
import { RessourceStock } from "../interfaces/global.interface";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { TriggerLimit } from "../types/project-card.type";
import { Checker } from "../utils/checker";
import { EventFactory } from "../factory/event/event-factory";
import { NonEventButtonNames } from "../types/global.type";
import { Utils } from "../utils/utils";

export const S = EventFactory.simple

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
	//Potatoes Farm
	'FM32': (s) => Checker.isTagOk('plant', 2, 'min', s),
	//Sponsored Academies
	'FM34': (s) => Checker.isHandCurrentSizeOk(1, 'min', s),
	//hypersensitive Chip Factory
	'M10': (s)=> Checker.isMoonTileOk('mine', 1, 'min', s),
	//Luna Mining Hub
	'M11': (s)=> Checker.isMoonTileOk('mine', 1, 'min', s),
	//Luna Senate
	'M13': (s)=> Checker.isTagOk('moon', 3, 'min', s),
	//Lunar industry complex
	'M15': (s)=> Checker.isProductionOk('titanium', 2, 'min', s),
	//Mare Serenitatis Mine
	'M19': (s)=> Checker.isTagOk('science', 3, 'min', s),
	//Momentum Virum Habitat
	'M21': (s)=> Checker.isTagOk('moon', 1, 'min', s),

	//The Womb
	'M24': (s)=> Checker.isTagOk('moon', 4, 'min', s),
	//Luna Ecumenapolis
	'M27': (s)=> Checker.isTagOk('space', 4, 'min', s),
	//Habitat 14
	'M29': (s)=> Checker.isTrOk(1, 'min', s),

	//Lunar Mine Urbanization
	'M62': (s)=> Checker.isMoonTileOk('mine', 2, 'min', s),
	//Lunar Mine Urbanization
	'M63': (s)=> Checker.isMoonTileOk('mine', 1, 'min', s),

	//Luna Archives
	'M87': (s)=> Checker.isTagOk('science', 3, 'min', s),
	//Pets Acclimatization
	'M90': (s)=> Checker.isMoonTileOk('habitat', 2, 'min', s),
	//Moon Tether
	'M120': (s)=> Checker.isTagOk('space', 4, 'min', s),
	//Mooncrate Block Factory
	'M122': (s)=> Checker.isMoonTileOk('mine', 1, 'min', s),
	//Luna Archives
	'M123': (s)=> Checker.isTagOk('science', 2, 'min', s),
	//Jupiter Embassy
	'M124': (s)=> Checker.isTagOk('jovian', 1, 'min', s) && Checker.isTagOk('moon', 1, 'min', s),
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
	'11': () => [S.specialBuilder(BuilderOption.assetLiquidation)],
	//Asset Liquidation v2
	'11B': () => [
		S.addTR(-1),
		S.draw(3),
		S.specialBuilder(BuilderOption.assetLiquidation)
	],
	//Composting Factory
	'17': (state) => {
		state.addSellCardValueMod(1)
		return []
	},
	//Decomposing Fungus
	'20': () => [S.addRessourceToCardId({name: 'microbe', valueStock: 2},'20')],
	//Extended Resources
	'26': () => [S.increaseResearchScanKeep({keep: 1, scan: 0})],
	//Farming Co-ops
	'29': () => [S.addRessource({name: 'plant', valueStock: 3})],
	//Interplanetary Relations
	'35': () => [S.increaseResearchScanKeep({keep: 1, scan: 1})],
	//Interns
	'36': () => [S.increaseResearchScanKeep({keep: 0, scan: 2})],
	//Nitrite Reducing Bacteria
	'43': () => [S.addRessourceToCardId({name:'microbe', valueStock:3}, '43')],
	//United Planetary Alliance
	'60': () => [S.increaseResearchScanKeep({keep: 1, scan: 1})],
	//Wood Burning Stoves
	'64': () => [
		S.addRessource({name: 'plant', valueStock: 4})],
	//Artificial Lake
	'66': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Atmosphere Filtering
	'67': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Bribed Committee
	'69': () => [
		S.addTR(2)],
	//Business Contact
	'70': () => [S.drawThenDiscard(4,2)],
	//CEO's Favorite Project
	'71': () => [S.effectPortal(EffectPortalEnum.ceo)],
	//Comet
	'73': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Convoy from Europa
	'74': () => [
		S.draw(1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Crater
	'75': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Deimos Down
	'76': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 3),
		S.addRessource({name: 'megacredit', valueStock: 7})],
	//Giant Ice Asteroid
	'77': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Ice Asteroid
	'78': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Ice Cap Melting
	'79': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Imported Hyrdrogen
	'80': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		S.effectPortal(EffectPortalEnum.importedHydrogen)
	],
	//Imported Nitrogen
	'81': () => [
		S.addRessourceToSelectedCard({name: 'animal', valueStock: 2}),
		S.addRessourceToSelectedCard({name: 'microbe', valueStock: 3}),
		S.addRessource({name: 'plant', valueStock: 4}),
		S.addTR(1)],
	//Invention Contest
	'83': () => [
		S.scanKeep({scan: 3, keep: 1}, DeckQueryOptionsEnum.inventionContest)],
	//Investment Loan
	'84': () => [
		S.addRessource({name: 'megacredit', valueStock: 10}),
		S.addTR(-1)],
	//Lagrange Observatory
	'85': () => [
		S.draw(1)],
	//Lake Marineris
	'86': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 2)],
	//Large Convoy
	'87': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		S.draw(2),
		S.effectPortal(EffectPortalEnum.largeConvoy)
	],
	//Lava Flows
	'88': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2)],
	//Local Heat Trapping
	'89': () => [
		S.addRessource({name:'plant', valueStock:4}),
		S.effectPortal(EffectPortalEnum.localHeatTrapping)
	],
	//Mangrove
	'90': () => [
		S.addForestAndOxygen(1)],
	//Nitrogen-Rich Asteroid
	'91': (state) => {
		let plants = 2
		if (state.getTagsOfType('plant') >= 3) plants += 4
		return [
			S.addTR(2),
			S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
			S.addRessource({name: 'plant', valueStock: plants})
		]
	},
	//Permafrost Extraction
	'92': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Phobos Falls
	'93': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1),
		S.draw(2)],
	//Plantation
	'94': () => [
		S.addForestAndOxygen(2)],
	//Release of Inert Gases
	'95': () => [
		S.addTR(2)],
	//Research
	'96': () => [
		S.draw(2)],
	//Subterranean Reservoir
	'98': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Technology Demonstration
	'99': () => [
		S.draw(2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Terraforming Ganymede
	'100': (state) => [
		S.addTR(state.getTagsOfType('jovian'))],
	//Towing a Comet
	'101': () => [
		S.addRessource({name: 'plant', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Work Crews
	'102': () => [S.specialBuilder(BuilderOption.workCrews)],
	//Acquired Company
	'103': () => [
		S.addProduction({name: 'card', valueStock: 1})],
	//Adaptated Lichen
	'104': () => [
		S.addProduction({name: 'plant', valueStock: 1})],
	//Aerated Magma
	'105': () => [
		S.addProduction([
			{name: 'card', valueStock: 1},
			{name: 'heat', valueStock: 2}
		])],
	//Airborne Radiation
	'106': () => [
		S.addProduction({name: 'heat', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Cultivated Land (erreur dans ton ancien code, code 107 → nom corrigé)
	'107': () => [
		S.addProduction({name: 'plant', valueStock: 2})],
	//Archaebacteria
	'108': () => [
		S.addProduction({name: 'plant', valueStock: 1})],
	//Artificial Photosynthesis
	'109': () => [
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 1}
		])],
	//Asteroid Mining
	'110': () => [
		S.addProduction({name: 'titanium', valueStock: 2})],
	//Asteroid Mining Consortium
	'111': () => [
		S.addProduction({name: 'titanium', valueStock: 1})],
	//Astrofarm
	'112': () => [
		S.addRessourceToSelectedCard({name: 'microbe', valueStock: 2}),
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	//Automated Factories
	'114': () => [
		S.addProduction({name:'card', valueStock: 1}),
		S.specialBuilder(BuilderOption.green9MCFree)
	],
	//Balanced Portfolios
	'115': () => [
		S.addProduction({name:'megacredit', valueStock: 3}),
		S.addTR(-1)
	],
	//Beam from a Thorium Asteroid
	'116': () => [
		S.addProduction([
			{name: 'plant', valueStock: 1},
			{name: 'heat', valueStock: 3}
		])],
	//Biomass Combustors
	'117': () => [
		S.addProduction({name: 'heat', valueStock: 5}),
		S.addRessource({name: 'plant', valueStock: -2})],
	//BioThermal Power
	'118': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.addForestAndOxygen(1),
	],
	//Blueprints
	'119': () => [
		S.addProduction([
		{ name: 'card', valueStock: 1 },
		{ name: 'megacredit', valueStock: 2 },
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
		S.drawThenDiscard(2,1),
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
	//New Portfolios
	'170': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'plant', valueStock: 1 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	//Nitrophilic Moss
	'171': () => [S.addProduction({ name: 'plant', valueStock: 2 })],
	//Noctis Farming
	'172': () => [
		S.addProduction({ name: 'plant', valueStock: 1 }),
		S.addRessource({ name: 'plant', valueStock: 2 })
	],
	//Nuclear Plants
	'173': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'heat', valueStock: 3 }
		])
	],
	//Power plant
	'175': () => [S.addProduction({ name: 'heat', valueStock: 1 })],
	//Power Supply Consortium
	'176': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'heat', valueStock: 1 }
		])
	],
	//Protected Valley
	'177': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
		S.addForestAndOxygen(1)
	],
	//Quantum Extractor
	'178': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	//Rad Suits
	'179': () => [S.addProduction({ name: 'megacredit', valueStock: 2 })],
	//Slash and Burn Agriculture
	'182': () => [S.addProduction({ name: 'plant', valueStock: 2 })],
	//Smelting
	'183': () => [
		S.addProduction({ name: 'heat', valueStock: 5 }),
		S.draw(2)
	],
	//Soil Warming
	'184': () => [
		S.addProduction({ name: 'plant', valueStock: 2 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//Solar Power
	'185': () => [S.addProduction({ name: 'heat', valueStock: 1 })],
	//Solar Trapping
	'186': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.addRessource({ name: 'heat', valueStock: 3 }),
		S.draw(1)
	],
	//Soletta
	'187': () => [S.addProduction({ name: 'heat', valueStock: 5 })],
	//Space Heaters
	'188': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
		S.draw(1)
	],
	//Space Station
	'189': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	//Sponsor
	'190': () => [S.addProduction({ name: 'megacredit', valueStock: 2 })],
	//Strip Mine
	'191': () => [
		S.addProduction([
			{ name: 'steel', valueStock: 2 },
			{ name: 'titanium', valueStock: 1 }
		]),
		S.addTR(-1)
	],
	//Surface Mines
	'192': () => [
		S.addProduction([
			{ name: 'steel', valueStock: 1 },
			{ name: 'titanium', valueStock: 1 }
		])
	],
	//Tectonic Stress Power
	'193': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	//Titanium Mine
	'194': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	//Toll Station
	'195': () => [
		S.addProduction({name:'megacredit', valueStock: 3}),
		S.specialBuilder(BuilderOption.green9MCFree)
	],
	//Trading Post
	'196': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2 }),
		S.addRessource({ name: 'plant', valueStock: 3 })
	],
	//Trapped Heat
	'197': () => [
		S.addProduction({ name: 'heat', valueStock: 2 }),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Trees
	'198': () => [
		S.addProduction({ name: 'plant', valueStock: 3 }),
		S.addRessource({ name: 'plant', valueStock: 1 })
	],
	//Tropical Forest
	'199': () => [
		S.addProduction({ name: 'megacredit', valueStock: 4 }),
		S.addRessource({ name: 'heat', valueStock: -5 })
	],
	//Tundra Farming
	'200': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 2 },
			{ name: 'plant', valueStock: 1 }
		]),
		S.addRessource({ name: 'plant', valueStock: 1 })
	],
	//Underground City
	'201': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 1 },
			{ name: 'steel', valueStock: 1 }
		])
	],
	//Underseas Vents
	'202': () => [
		S.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 4 }
		])
	],
	//Vesta Shipyard
	'204': () => [S.addProduction({ name: 'titanium', valueStock: 1 })],
	//Wave Power
	'205': () => [S.addProduction({ name: 'heat', valueStock: 3 })],
	//Apollo Industries
	'D01': () => [S.upgradePhaseCard(1, [1])],
	//Exocorp
	'D02': (clientState) => {
		clientState.addSellCardValueMod(1)
		return [S.upgradePhaseCard(1, [4])]
	},
	//Exocorp v2
	'D02B': () => {
		return [S.upgradePhaseCard(1, [4])]
	},
	//Hyperion Systems
	'D03': () => {
		return [S.upgradePhaseCard(1, [2])]
	},
	//Hyperion Systems v2
	'D03B': () => {
		return [S.upgradePhaseCard(1, [2])]
	},
	//Sultira
	'D04': () => [S.upgradePhaseCard(1, [0])],
	//Communication Streamlining
	'D05': () => [
		S.upgradePhaseCard(1, [2])
	],
	//Exosuits
	'D09': () => [S.upgradePhaseCard(1)],
	//Fibrous Composite Material
	'D10': () => [S.addRessourceToCardId({name:'science', valueStock:3}, 'D10')],
	//Software Streamlining
	'D11': () => [S.upgradePhaseCard(1)],
	//Biomedical Imports
	'D14': () => [S.effectPortal(EffectPortalEnum.biomedicalImports)],
	//Cryogentic Shipment
	'D15': (clientState) => {
		let events: EventBaseModel[] = [S.upgradePhaseCard(1)]
		if(clientState.getPlayedListWithStockableTypes(['microbe', 'animal']).length!=0){
			events.push(S.effectPortal(EffectPortalEnum.cryogenticShipment))
		}
		return events
	},
	//Exosuits
	'D16': () => [
		S.draw(1),
		S.upgradePhaseCard(1)
	],
	//Imported Construction Crews
	'D17': () => [S.upgradePhaseCard(2)],
	//Ore Leaching
	'D18': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 2),
		S.draw(2),
		S.upgradePhaseCard(1)
	],
	//Private Investor Beach
	'D19': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Topographic Mapping
	'D20': () => [
		S.resolveWildTag('D20'),
		S.upgradePhaseCard(1)
	],
	//3D printing
	'D21': () => [S.addProduction({name:'megacredit', valueStock:4})],
	//Biofoundries
	'D22': () => [
		S.upgradePhaseCard(1),
		S.addProduction({ name: 'plant', valueStock: 2 })
	],
	//Blast Furnace
	'D23': () => [
		S.upgradePhaseCard(1),
		S.addProduction({ name: 'steel', valueStock: 1})
	],
	//Dandelions
	'D24': () => [S.addProduction([{ name: 'card', valueStock: 1}, { name: 'plant', valueStock: 1}])],
	//Electric Arc Furnace
	'D25': () => [S.addProduction({ name: 'steel', valueStock: 2})],
	//Local Market
	'D26': () => [
		S.addProduction({name:'megacredit', valueStock:2}),
		S.resolveWildTag('D26')
	],
	//Manufacturing Hub
	'D27': () => [
		S.addProduction([{name:'megacredit', valueStock:2},{name:'heat', valueStock:1}]),
		S.upgradePhaseCard(1),
	],
	//Heat reflective Glass
	'D28': () => [
		S.addProduction({name:'heat', valueStock:1}),
		S.upgradePhaseCard(1),
	],
	//Hematite Mining
	'D29': () => [
		S.addProduction([
			{ name: 'card', valueStock: 2 },
			{ name: 'steel', valueStock: 1 }
		]),
		S.upgradePhaseCard(1)
	],
	//Hematite Mining V2
	'D29B': () => [
		S.addProduction([
			{ name: 'card', valueStock: 2 },
			{ name: 'steel', valueStock: 1 }
		]),
		S.addRessource({name:'heat', valueStock:-5}),
		S.upgradePhaseCard(1)
	],
	//Hydroponic Gardens
	'D30': () => [
		S.addProduction([{name:'megacredit', valueStock:3},{name:'plant', valueStock:1}]),
		S.upgradePhaseCard(1),
	],
	//Ilmenite Deposits

	'D31': () => [S.addProduction({name:'titanium', valueStock:2})],
	//Industrial Complex
	'D32': () => [
		S.addProduction({ name: 'heat', valueStock: 4 }),
		S.upgradePhaseCard(1)
	],
	//Martian Museum
	'D33': () => [
		S.addProduction({ name: 'megacredit', valueStock: 1}),
		S.upgradePhaseCard(1)
	],
	//Metallurgy
	'D34': () => [
		S.addProduction({ name: 'titanium', valueStock: 1}),
		S.upgradePhaseCard(1)
	],
	//Award Winning Reflector Material
	'D35': (clientstate) => {
		let result : EventBaseModel[] = [S.addProduction({name:'heat', valueStock:3})]
		if(clientstate.getMilestoneCompleted()>0){
			result.push(S.addRessource({name:'heat', valueStock:4}))
		}
		return result
	},
	//Oxidation Byproducts
	'D36': () => [
		S.addProduction({ name: 'heat', valueStock: 2}),
		S.upgradePhaseCard(1)
	],
	//Perfluorocarbon Production
	'D37': () => [
		S.addProduction({ name: 'heat', valueStock: 1 }),
		S.upgradePhaseCard(1, [0])
	],
	//Magnetic Field Generator
	'D38': () => [
		S.addProduction({ name: 'plant', valueStock: 1}),
		S.upgradePhaseCard(1)
	],
	//Political Influence
	'D39': () => [
		S.addProduction({name:'megacredit', valueStock:3}),
		S.resolveWildTag('D39')
	],
	//Biological Factories
	'D40': () => [
		S.addProduction({ name: 'plant', valueStock: 1}),
		S.upgradePhaseCard(1, [3])
	],
	//Nuclear Detonation Site
	'D41': () => [S.addProduction({ name: 'heat', valueStock: 3})],
	//Warehouse
	'D42': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2}),
		S.upgradePhaseCard(1)
	],
	//Architecture Blueprints
	'F09': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.drawThenDiscard(2,1),
	],
	//Bedrock Wellbore
	'F10': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Callisto Skybridge
	'F11': (clientState) => {
		let infra = 1
		if(clientState.getTagsOfType('jovian')>3){
			infra++
		}
		return [S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, infra)]
	},
	//CHP Combustion Turbines
	'F12': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//City Planning
	'F13': () => [S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2)],
	//Grain Silos
	'F14': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		S.addRessource({ name: 'plant', valueStock: 4 })
	],
	//City Planning
	'F15': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Jezero Crater Hospital
	'F16': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1),
		S.upgradePhaseCard(1)
	],
	//Low-Atmosphere Planes
	'F17': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 3)
	],
	//Low-Atmosphere Planes
	'F17B': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 3)
	],
	//Power Grid Uplink
	'F18': () => [
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 2),
		S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
	],
	//Subways
	'F19': () => [S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)],
	//Urban Forestry
	'F20': () => [
		S.addForestAndOxygen(1),
		S.addRessource({ name: 'megacredit', valueStock: 5 })
	],
	//Microloans
	'F21': () => [
		S.addProduction({ name: 'megacredit', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)
	],
	//Seed Bank
	'F22': () => [S.addProduction([{ name: 'plant', valueStock: 2}, { name: 'heat', valueStock: 3}])],
	//Quant-Link Conferencing
	'F23': () => [S.addProduction({ name: 'card', valueStock: 1})],
	//Assorted Enterprises
	'P01': () => [S.specialBuilder(BuilderOption.assortedEnterprises)],
	//Commercial Imports
	'P02': () => [
		S.addProduction([
			{ name: 'card', valueStock: 1 },
			{ name: 'heat', valueStock: 2 },
			{ name: 'plant', valueStock: 2 }
		])
	],
	//Matter Generator
	'P06': () => [S.draw(2)],
	//Processed Metals
	'P07': (clientstate) => [
		S.addProduction({ name: 'titanium', valueStock: 2 }),
		S.draw(clientstate.getTagsOfType('power'))
	],
	//Processed Metals
	'P08': () => [S.addProduction({name:'steel', valueStock:2})],
	//Synthetic Catastrophe
	'P10': () => [S.recallCardInHandFromPlay()],
	//Research Grant
	'P24': (clientstate) => [
		S.specialBuilder(BuilderOption.researchGrant)
	],
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
	//Modpro
	'P32': () => [
		S.resolveWildTag('P32'),
	],
	//Ecoline
	'210': () => [S.addProduction({name:'plant', valueStock:1})],
	//Ecoline
	'210B': () => [S.addProduction({name:'plant', valueStock:3})],
	//Interplanetary Cinematics
	'212': () => [S.addProduction({name:'steel', valueStock:1})],
	//Inventrix
	'213': (clientstate) => {
		clientstate.setPrerequisiteOffset([
			{name: GlobalParameterNameEnum.infrastructure, offset:1},
			{name: GlobalParameterNameEnum.oxygen, offset:1},
			{name: GlobalParameterNameEnum.temperature, offset:1}
		])
		return [S.draw(3)]
	},
	//Mining Guild
	'214': () => {
		return [S.addProduction({name:'steel', valueStock:1})]
	},
	//Mining Guild
	'214B': () => {
		return [S.addProduction({name:'steel', valueStock:2})]
	},
	//Phobolog
	'215': (clientstate) => {
		clientstate.increaseProductionModValue('titanium')
		return [S.addProduction({name:'titanium', valueStock:1})]
	},
	//Phobolog
	'215B': (clientstate) => {
		clientstate.increaseProductionModValue('titanium')
		return [S.addProduction({name:'titanium', valueStock:2})]
	},
	//Saturn Systems
	'216': () => [
		S.addProduction({name:'titanium', valueStock:1})
	],
	//Tharsis Republic
	'218': () => [
		S.increaseResearchScanKeep({keep:1, scan:1})
	],
	//Thorgate
	'219': () => [
		S.addProduction({name:'heat', valueStock:1})
	],
	//DevTechs
	'P14': () => [
		S.scanKeep({scan:5, keep:1}, DeckQueryOptionsEnum.devTechs)
	],
	//Mai-Ni Productions
	'P16': () => [
		S.specialBuilder(BuilderOption.maiNiProductions)
	],
	//Nebu Labs
	'P31': () => [
		S.upgradePhaseCard(1)
	],
	//Zetasel
	'P17': () => [S.drawThenDiscard(5,4)],
	//Ringcom
	'CF4': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 3 },
			{ name: 'titanium', valueStock: 1 }
		]),
	],
	//Lili volunteering initiative
	'CF5': () => [
		S.addProduction([{name:'megacredit', valueStock:2},{name:'plant', valueStock:1},{name:'heat', valueStock:1},{name:'card', valueStock:1}]),
		S.upgradePhaseCard(1,[0,1])
	],
	//Aridor
	'CF6': ()=>  [S.resolveWildTag('CF6')],
	//Recyclon
	'CF7': ()=>  [S.addProduction({name:'steel', valueStock:1})],
	//Topsoil Contract
	'FM3': () => [S.addRessource({name:'plant', valueStock:3})],
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
		S.draw(Math.floor(state.getTagsOfType('science')/2))
	],
	//Social Event
	'FM8': (state) => [
		S.addTR(Math.floor(Math.min(state.getTagsOfType('earth'), state.getTagsOfType('jovian'))))
	],
	//Bactoviral Research
	'FM9': (state) => [
		S.addRessourceToSelectedCard({name:'microbe',valueStock:state.getTagsOfType('science')})
	],
	//Ceres Spaceport
	'FM10': (state) => [
		S.addProduction({name:'titanium', valueStock:3}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
	],
	//Ganymede Colony
	'FM13': () => [
		S.addProduction([
			{ name: 'megacredit', valueStock: 4},
		]),
	],
	//Lunar Embassy
	'FM16': () => [
		S.draw(1),
		S.addProduction({name:'megacredit', valueStock:5})
	],
	//Ecology research
	'FM17': () => [
		S.addRessourceToSelectedCard({name:'microbe', valueStock:2}),
		S.addRessourceToSelectedCard({name:'animal', valueStock:1})
	],
	//Earth Elevator
	'FM19': () => [
		S.addProduction([
			{ name: 'titanium', valueStock: 3 },
		]),
	],
	//Io Sulphur Research
	'FM21': (state) => [
		S.draw(state.getTagsOfType('jovian')>=3?3:1)
	],
	//Magnetic shield
	'FM22': () => [
		S.addTR(4),
	],
	//Red Spot Observatory
	'FM25': () => [
		S.effectPortal(EffectPortalEnum.secretLabs),
	],
	//Red Spot Observatory
	'FM26': () => [
		S.draw(2),
	],
	//Conscription
	'FM28': () => [S.specialBuilder(BuilderOption.conscription)],
	//Research coordination
	'FM29': () => [
		S.resolveWildTag('FM29'),
		S.addProduction({name:'megacredit', valueStock:2})
	],
	//Solar wind power
	'FM31': () => [
		S.addProduction([{name:'heat', valueStock:1}, {name:'titanium', valueStock:1}])
	],
	//Sponsored Academies
	'FM34': () => [
		S.discard(1),
		S.draw(3)
	],
	//Archimede's Hydroponics Station
	'M1': () => [
		S.addProduction([{name:'plant', valueStock:2}])
	],
	//Aristarchus Road Network
	'M2': () => [
		S.increaseMoonParameter(),
		S.addProduction([{name:'megacredit', valueStock:2}]),
	],
	//Copernicus Solar Arrays
	'M3': () => [
		S.addProduction({name:'heat', valueStock:1}),
		S.addRessource({name: 'heat', valueStock:2})
	],
	//Darkside Mining Syndicate
	'M4': (state) => [
		S.addProduction({name:'titanium', valueStock: state.getMine()===0?2:1}),
		S.increaseMoonParameter()
	],
	//Deep Lunar Mining
	'M5': () => [
		S.addProduction({name:'titanium', valueStock:2}),
		S.increaseMoonParameter()
	],
	//Geodesic Tentes
	'M6': () => [
		S.addHabitat(),
		S.addProduction({name:'plant', valueStock:1}),
	],
	//Heliostat Mirror Array
	'M9': () => [
		S.addProduction({name:'heat', valueStock:2}),
	],
	//hypersensitive Chip Factory
	'M10': () => [
		S.addProduction({name:'megacredit', valueStock:4}),
	],
	//Luna Mining Hub
	'M11': () => [
		S.addMine(),
		S.addProduction([{name:'steel', valueStock:1}, {name:'titanium', valueStock:1}]),
	],
	//Luna Resort
	'M12': () => [
		S.addProduction({name:'megacredit', valueStock:3}),
		S.increaseMoonParameter()
	],
	//Luna Train Station
	'M14': () => [
		S.addProduction({name:'megacredit', valueStock:4}),
		S.addRoad()
	],
	//Lunar Industry Complex
	'M15': () => [
		S.addMine(),
		S.addProduction([
			{name: 'heat', valueStock: 2},
			{name: 'steel', valueStock: 2},
			{name: 'titanium', valueStock: 2},
		]),
	],
	//Mare Imbrium Mine
	'M16': () => [
		S.addMine(),
		S.addProduction([
			{name: 'steel', valueStock: 1},
			{name: 'titanium', valueStock: 1},
		]),
	],
	//Mare Nectaris Mine
	'M17': () => [
		S.addMine(),
		S.addProduction([
			{name: 'steel', valueStock: 1},
		]),
	],
	//Mare Numbium Mine
	'M18': () => [
		S.addMine(),
		S.addProduction([
			{name: 'steel', valueStock: 1},
			{name: 'titanium', valueStock: 1},
		]),
	],
	//Mare Serenitatis Mine
	'M19': () => [
		S.addMine(2),
		S.addProduction([
			{name: 'steel', valueStock: 1},
			{name: 'titanium', valueStock: 1},
		]),
	],
	//Microsingularity Plant
	'M20': () => [
		S.addProduction([
			{name: 'heat', valueStock: 3},
		]),
	],
	//Momentum Virum Habitat
	'M21': () => [
		S.addHabitat(),
		S.addProduction([
			{name: 'megacredit', valueStock: 3},
			{name: 'heat', valueStock: 3},
		]),
	],
	//Sinus Iridium Road Network
	'M23': () => [
		S.increaseMoonParameter(),
		S.addProduction([
			{name: 'megacredit', valueStock: 2},
		]),
	],
	//The Womb
	'M24': () => [
		S.addHabitat(),
		S.addProduction([
			{name: 'megacredit', valueStock: 3},
			{name: 'heat', valueStock: 2},
			{name: 'plant', valueStock: 1},
			{name: 'card', valueStock: 1},
		]),
	],
	//Tycho Road Network
	'M25': () => [
		S.increaseMoonParameter(),
		S.addProduction([
			{name: 'megacredit', valueStock: 1},
		]),
	],
	//Luna Ecumenapolis
	'M27': () => [
		S.addHabitat(2)
	],
	//Habitat 14
	'M29': () => [
		S.addHabitat(1),
		S.addTR(-1),
		S.addProduction({name:'card', valueStock:1})
	],
	//Sphere Habitat
	'M30': () => [
		S.addHabitat(1),
		S.addProduction({name:'card', valueStock:1})
	],
	//Thorium Rush
	'M60': () => [
		S.addHabitat(2),
		S.addMine(2),
		S.draw(2)
	],
	//Colonist Shuttle
	'M61': (state) => {
		let result = [
			S.addHabitat(),
			S.draw(1)
		]
		return result
	},
	//He3 Production Quotas
	'M62': () => [S.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 3)],
	//Lunar Mine Urbanization
	'M63': () => [
		S.addHabitat(1),
	],
	//Preliminary Darkside
	'M64': () => [
		S.addMine(),
		S.draw()
	],
	//Darkside Meteor Bombardment
	'M65': () => [
		S.addMine(2),
		S.draw(2)
	],
	//Moon Minerals Tradecenter
	'M92': () => [
		S.draw(2)
	],
	//Moon Minerals Tradecenter
	'M123': () => [
		S.increaseResearchScanKeep({scan:3, keep:0})
	],
	//Crescent research association
	'MC1': () => [
		S.increaseResearchScanKeep({scan:1, keep:0})
	],
	//Luna Mining Federation
	'MC2': () => [
		S.addMine(2),
	],
	//Luna first
	'MC3': () => [
		S.increaseMoonParameter(2)
	],
	//Grand Luna Capital Group
	'MC4': () => [
		S.addHabitat(2),
	],
}
export const COST_MOD: Record<string, (card: PlayableCardModel, clientState: PlayerStateModel) => number> = {
	//Earth Catapult
	'23': () => 2,
	//Energy Subsidies
	'25': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, 'power') * 4,
	//Interplanetary Conference
	'37': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, ['earth', 'jovian']) * 3,
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
	'217': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, 'earth') * 3,
	//Thorgate
	'219': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, 'power') * 3,
	//DevTechs
	'P14': (card) => card.isFilterOk?.({ type: ProjectFilterNameEnum.greenProject }) ? 2 : 0,
	//Exocorp v2
	'D02B': () => 1,
	//Solar Logistics
	'FM2': (card) => {
		return card.hasTag('space') && card.hasTag('event')?10:0
	},
	//Meat industry
	'FM4': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, ['plant', 'animal']) * 3,
	//Space Relay
	'FM14': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, 'jovian') * 5,
	//Moon Tether
	'M120': () => 2,
	//Earth Embassy
	'M121': (card, state) => {
		if(!card.hasTag('moon')){return 0}
		return state.getTagsOfType('earth')
	},
	//Jupiter Embassy
	'M124': (card) => Utils.countTagsOfTypeInIdList(card.tagsId, ['jovian', 'moon']) * 2,
	//Crescent Research Association
	'MC1': (card, state) => card.hasTag('moon')? state.getTagsOfType('moon'): 0
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
	'CF1': (s)=> [{name:'megacredit', valueStock: Math.floor(s.getTagsOfType('earth'))}],
	//Ringcom
	'CF4': (s)=> [{name:'card', valueStock:Math.floor(s.getTagsOfType('jovian') /2)}],
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
	//Advertising
	'FM23': (s)=> [{name:'megacredit', valueStock:s.getProjectPlayedModelList({type:ProjectFilterNameEnum.cost20orMore}).length}],
	//HelioLink space station
	'FM30': (s)=> [{name:'heat', valueStock:s.getTagsOfType('science')}],
	//Potatoes Farm
	'FM32': (s)=> {
		let scaling = s.getTagsOfType('plant')
		return [{name:'megacredit', valueStock:scaling}, {name:'plant', valueStock:scaling}]
	},
	//Solar farm
	'FM33': (s)=> [{name:'heat', valueStock:s.getTagsOfType('plant')}],
	//He3 Fusoin Plant
	'M7': (s)=> [{name:'heat', valueStock:s.getMine()}],
	//He3 Lobbyists
	'M8': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('moon')}],
	//Luna Senate
	'M13': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('moon')}],
	//Luna Train Station
	'M14': (s)=> [{name:'megacredit', valueStock:s.getMine()}],
	//Orbital Power Grid
	'M22': (s)=> [{name:'heat', valueStock:s.getTagsOfType('moon')}],
	//Undermoon Drug Lords Network
	'M26': (s)=> [{name:'megacredit', valueStock:s.getHabitat()}],
	//Luna Ecumenapolis
	'M27': (s)=> [{name:'megacredit', valueStock:s.getHabitat()}],
	//Grand Luna Academy
	'M28': (s)=> [{name:'card', valueStock: Math.floor(s.getTagsOfType('moon') / 3)}],
	//Habitats Greenification
	'M31': (s)=> [{name:'plant', valueStock:s.getHabitat()}],
	//Luna Metropolis
	'M32': (s)=> [{name:'megacredit', valueStock:s.getTagsOfType('earth')}],
	//Luna first
	'MC3': (s)=> {
		let param = s.getGlobalParameterFromName(GlobalParameterNameEnum.moon)
		let scale = param? param.step + param.addEndOfPhase -1: 0
		return [{name:'megacredit', valueStock:scale}]
	},
}
export const ALTERNATIVE_PAY_BUTTON_NAME: Record<string,() => NonEventButtonNames> = {
	//Anaerobic Microorganisms
	'5': () => 'alternativePayAnaerobicMicroorganisms',
		//Anaerobic Microorganisms
	'52': () => 'alternativePayRestructuredResources'
}
export const ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS: Partial<Record<NonEventButtonNames, () => EventBaseModel[]>> ={
	'alternativePayAnaerobicMicroorganisms': () => [S.addRessourceToCardId({name:'microbe', valueStock:-2}, '5')],
	'alternativePayRestructuredResources': () => [S.addRessource({name:'plant', valueStock:-1})]
}
export const ALTERNATIVE_PAY_REQUIREMENTS: Partial<Record<NonEventButtonNames, (clientState: PlayerStateModel) => boolean>> ={
	'alternativePayAnaerobicMicroorganisms': (c) => c.getProjectPlayedStock('5')[0].valueStock>=2,
	'alternativePayRestructuredResources': (c) => Checker.isRessourceOk('plant', 1, 'min', c),
}
