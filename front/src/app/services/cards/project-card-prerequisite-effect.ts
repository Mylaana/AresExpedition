import { PlayableCardModel } from "../../models/cards/project-card.model"
import { PlayerStateModel } from "../../models/player-info/player-state.model"
import { GlobalParameterColorEnum, GlobalParameterNameEnum, ProjectFilterNameEnum } from "../../enum/global.enum"
import { DEBUG_IGNORE_PREREQUISITES } from "../../global/global-const"
import { Checker } from "../../utils/checker"
import { ActivationOption } from "../../types/project-card.type"
import { ProjectCardActivatedEffectService } from "./project-card-activated-effect.service"
import { RessourceType } from "../../types/global.type"

const PLAY_CARD_REQUIREMENTS: Record<string, (clientState: PlayerStateModel) => boolean> = {
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
	//Urban Forestry
	'F20': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.yellow, 'min', s),
	//Filter Feeders
	'P04': (s) => Checker.isOceanOk(2, 'min', s),

}
export const CardConditionChecker = {
	canBePlayed(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		if (DEBUG_IGNORE_PREREQUISITES) return true

		const checkFn = PLAY_CARD_REQUIREMENTS[card.cardCode]
		return checkFn ? checkFn(clientState) : true
	},
	canBeActivated(card: PlayableCardModel, clientState: PlayerStateModel, activationOption: ActivationOption = 1): boolean {
		const noCost = new Set(['3', '4', '13', '15', '16', '18', 'CP02'])
		if (noCost.has(card.cardCode)) return true

		const scalingCost = (resource: RessourceType) =>
			Checker.isRessourceOk(resource, ProjectCardActivatedEffectService.getScalingActivationCost(card.cardCode, clientState), 'min', clientState)

		const hasMicrobes = (count: number) =>
			clientState.getProjectPlayedStock(card.cardCode).some(s => s.name === 'microbe' && s.valueStock >= count)

		const rules: Record<string, () => boolean> = {
			// Aquifer Pumping
			'7': () => scalingCost('megacredit'),
			// Artificial Jungle
			'9': () => Checker.isRessourceOk('plant', 1, 'min', clientState),
			// Caretaker Contract
			'14': () => Checker.isRessourceOk('heat', 8, 'min', clientState),
			// Decomposing Fungus
			'20': () => false,
			// Developed Infrastructure
			'21': () => scalingCost('megacredit'),
			// Development Center
			'22': () => Checker.isRessourceOk('heat', 2, 'min', clientState),
			// Extreme-Cold Fungus
			'27': () => activationOption === 1 || clientState.hasProjectPlayedOfFilterType({ type: ProjectFilterNameEnum.stockable, stockableType: 'microbe' }),
			// Farmers Market
			'28': () => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
			// Farming Co-ops
			'29': () => Checker.isHandCurrentSizeOk(1, 'min', clientState),
			// GHG Producing Bacteria
			'31': () => activationOption === 1 || hasMicrobes(2),
			// Hydro-Electric Energy
			'34': () => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
			// Ironworks
			'38': () => Checker.isRessourceOk('heat', 4, 'min', clientState),
			// Matter Manufacturing
			'41': () => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
			// Nitrite Reducing Bacteria
			'43': () => activationOption === 1 || hasMicrobes(3),
			// Redrafted contracts
			'49': () => Checker.isHandCurrentSizeOk(1, 'min', clientState),
			// Regolith Eaters
			'50': () => activationOption === 1 || hasMicrobes(2),
			// Solarpunk
			'54': () => scalingCost('megacredit'),
			// Steelworks
			'56': () => Checker.isRessourceOk('heat', 6, 'min', clientState),
			// Steelworks (duplicate ID?)
			'59': () => Checker.isRessourceOk('megacredit', 2, 'min', clientState),
			// Volcanic Pools
			'62': () => scalingCost('megacredit'),
			// Water Import from Europa
			'63': () => scalingCost('megacredit'),
			// Wood Burning Stoves
			'64': () => scalingCost('plant'),
			// Sawmill
			'F08': () => scalingCost('megacredit'),
			// Matter Generator
			'P06': () => Checker.isHandCurrentSizeOk(1, 'min', clientState),
			// Progressive Policies
			'P09': () => scalingCost('megacredit'),
		}

		return rules[card.cardCode]?.() ?? false
	}
}
