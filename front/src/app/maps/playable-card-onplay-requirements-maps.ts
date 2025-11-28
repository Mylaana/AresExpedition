import { GlobalParameterNameEnum, GlobalParameterColorEnum } from "../enum/global.enum"
import { CardRequirements } from "../interfaces/card.interface"
import { PlayerStateModel } from "../models/player-info/player-state.model"
import { Checker } from "../utils/checker"


export const PLAY_REQUIREMENTS_OK: Record<string, (clientState: PlayerStateModel) => boolean> = {
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
    '92': (s) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', s),
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
    'M90': (s)=> Checker.isMoonTileOk('habitat', 1, 'min', s),
    //Moon Tether
    'M120': (s)=> Checker.isTagOk('space', 4, 'min', s),
    //Luna Archives
    'M123': (s)=> Checker.isTagOk('science', 2, 'min', s),
    //Jupiter Embassy
    'M124': (s)=> Checker.isTagOk('jovian', 1, 'min', s) && Checker.isTagOk('moon', 1, 'min', s),
}
export const PLAY_REQUIREMENTS_INTERFACE: Record<string, CardRequirements> = {
    //AI Central
    '4': { treshold: 'min' },
    //Antigravity Technology
    '6': { treshold: 'min' },
    //Arctic Algae
    '8': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Asset Liquidation V2
    '11B': { treshold: 'min' },
    //Birds
    '12': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.white, treshold: 'min' },
    //Caretaker Contract
    '14': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Decomposers
    '19': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Extreme-Cold Fungus
    '27': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.purple, treshold: 'max' },
    //Fish
    '30': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //GHG Producing Bacteria
    '31': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Greenhouses
    '32': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Herbivores
    '33': { treshold: 'min' },
    //Livestock
    '39': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Physics Complex
    '46': { treshold: 'min' },
    //Physics Complex
    '48B': { treshold: 'min' },
    //Regolith Eaters
    '50': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Small Animals
    '53': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Symbiotic Fungus
    '57': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Advanced Ecosystems
    '65': { treshold: 'min' },
    //Artificial Lake
    '66': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Atmosphere filtering
    '67': { treshold: 'min' },
    //Breathing Filters
    '68': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Colonizer Training Camp
    '72': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'max' },
    //Crater
    '75': { treshold: 'min' },
    //Ice Cap Melting
    '79': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.white, treshold: 'min' },
    //Interstellar Colony Ship
    '82': { treshold: 'min' },
    //Investment Loan
    '84': { treshold: 'min' },
    //Lake Marineris
    '86': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Local Heat Trapping
    '89': { treshold: 'min' },
    //Mangrove
    '90': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Permafrost Extraction
    '92': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Plantation
    '94': { treshold: 'min' },
    //Aerated Magma
    '105': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Airborne Radiation
    '106': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Algae
    '107': { treshold: 'min' },
    //Archaebacteria
    '108': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.purple, treshold: 'max' },
    //Balanced Portfolios
    '115': { treshold: 'min' },
    //Beam from a Thorium Asteroid
    '116': { treshold: 'min' },
    //Biomass Combustors
    '117': { treshold: 'min' },
    //Building Industries
    '120': { treshold: 'min' },
    //Bushes
    '121': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Designed Microorganisms
    '127': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'max' },
    //Dust Quarry
    '129': { treshold: 'max' },
    //Energy Storage
    '131': { treshold: 'min' },
    //Eos Chasma National Park
    '132': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Farming
    '133': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.white, treshold: 'min' },
    //Food factory
    '134': { treshold: 'min' },
    //Fuel factory
    '135': { treshold: 'min' },
    //Fuel Generators
    '136': { treshold: 'min' },
    //Fusion Power
    '137': { treshold: 'min' },
    //Gene Repair
    '139': { treshold: 'min' },
    //Grass
    '142': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Great Dam
    '143': { treshold: 'min' },
    //Kelp Farming
    '154': { treshold: 'min' },
    //Low-Atmo Shields
    '157': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Lunar Beam
    '158': { treshold: 'min' },
    //Mass Converter
    '159': { treshold: 'min' },
    //Methane from Titan
    '161': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Monocultures
    '167': { treshold: 'min' },
    //Moss
    '168': { treshold: 'min' },
    //Natural Preserve
    '169': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Noctis Farming
    '172': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Quantum Extractor
    '178': { treshold: 'min' },
    //Rad Suits
    '179': { treshold: 'min' },
    //Strip Mine
    '191': { treshold: 'min' },
    //Trapped Heat
    '197': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Trees
    '198': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Tropical Forest
    '199': { treshold: 'min' },
    //Tundra Farming
    '200': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Wave Power
    '205': { treshold: 'min' },
    //Worms
    '207': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Zeppelins
    '208': { globalParameter: GlobalParameterNameEnum.oxygen, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Dandelions
    'D24': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Urban Forestry
    'F20': { globalParameter: GlobalParameterNameEnum.infrastructure, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Seed Bank
    'F22': { globalParameter: GlobalParameterNameEnum.infrastructure, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Quant-Link Conferencing
    'F23': { globalParameter: GlobalParameterNameEnum.infrastructure, globalParameterColor: GlobalParameterColorEnum.red, treshold: 'min' },
    //Virtual Employee Development
    'D12': { treshold: 'min' },
    //Imported Construction Crews
    'D17': { globalParameter: GlobalParameterNameEnum.temperature, globalParameterColor: GlobalParameterColorEnum.yellow, treshold: 'min' },
    //Private Investor Beach
    'D19': { treshold: 'min' },
    //Hematite Mining V2
    'D29B': { treshold: 'min' },
    //Filter Feeders
    'P04': { treshold: 'min' },
    //Mercurian Alloys
    'FM6': { treshold: 'min' },
    //Mercurian Alloys
    'FM11': { treshold: 'min' },
    //Magnetic Shield
    'FM22': { treshold: 'min' },
    //Red Spot Observatory
    'FM26': { treshold: 'min' },
    //Jovian Lanterns
    'FM27': { treshold: 'min' },
    //Conscription
    'FM28': { treshold: 'min' },
    //Potatoes Farm
    'FM32': { treshold: 'min' },
    //Sponsored Academies
    'FM34': { treshold: 'min' },
    //hypersensitive Chip Factory
    'M10': { treshold: 'min' },
    //Luna Mining Hub
    'M11': { treshold: 'min' },
    //Luna Senate
    'M13': { treshold: 'min' },
    //Lunar industry complex
    'M15': { treshold: 'min' },
    //Mare Serenitatis Mine
    'M19': { treshold: 'min' },
    //Momentum Virum Habitat
    'M21': { treshold: 'min' },
    //The Womb
    'M24': { treshold: 'min' },
    //Luna Ecumenapolis
    'M27': { treshold: 'min' },
    //Habitat 14
    'M29': { treshold: 'min' },
    //Lunar Mine Urbanization
    'M62': { treshold: 'min' },
    //Lunar Mine Urbanization
    'M63': { treshold: 'min' },
    //Luna Archives
    'M87': { treshold: 'min' },
    //Pets Acclimatization
    'M90': { treshold: 'min' },
    //Moon Tether
    'M120': { treshold: 'min' },
    //Luna Archives
    'M123': { treshold: 'min' },
    //Jupiter Embassy
    'M124': { treshold: 'min' },
}