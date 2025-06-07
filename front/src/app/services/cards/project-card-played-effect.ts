import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { DeckQueryOptionsEnum, GlobalParameterNameEnum } from "../../enum/global.enum";
import { EventFactory } from "../../factory/event factory/event-factory";
import { CostModCalulator, TriggerEffectEventFactory } from "./trigger-event";

/**
 *
 * @param card
 * @returns Event List

* Events should be filled to the list according to their order of execution.
*/
function getPlayed(cardCode: string, clientstate: PlayerStateModel): EventBaseModel[] | undefined{
	let result: EventBaseModel[] = []
	switch(cardCode){
		//Adaptation Technology
		case('1'):{
			clientstate.setPrerequisiteOffset([
				{name: GlobalParameterNameEnum.infrastructure, offset:1},
				{name: GlobalParameterNameEnum.oxygen, offset:1},
				{name: GlobalParameterNameEnum.temperature, offset:1}
			])
			break
		}
		//Advanced Alloys
		case('2'):{
			clientstate.increaseProductionModValue('steel')
			clientstate.increaseProductionModValue('titanium')
			break
		}
		//Composting Factory
		case('17'):{
			clientstate.addSellCardValueMod(1)
			break
		}
		//Decomposing Fungus
		case('20'):{
			result.push(EventFactory.simple.addRessourceToSelectedCard({name: 'microbe',valueStock: 2}))
			break
		}
		//Extended Ressourcess
		case('26'):{
			result.push(EventFactory.simple.increaseResearchScanKeep({keep:1, scan:0}))
			break
		}
		//Farming Co-ops
		case('29'):{
			result.push(EventFactory.simple.addRessource({name: 'plant',valueStock: 3}))
			break
		}
		//Interplanetary Relations
		case('35'):{
			result.push(EventFactory.simple.increaseResearchScanKeep({keep:1, scan:1}))
			break
		}
		//Interns
		case('36'):{
			result.push(EventFactory.simple.increaseResearchScanKeep({keep:0, scan:2}))
			break
		}
		//United Planetary Alliance
		case('60'):{
			result.push(EventFactory.simple.increaseResearchScanKeep({keep:1, scan:1}))
			break
		}
		//Wood Burning Stoves
		case('64'):{
			result.push(EventFactory.simple.addRessource({name: 'plant',valueStock: 4}))
			break
		}
		//Artificial Lake
		case('66'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Atmosphere Filtering
		case('67'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
			break
		}
		//Bribed Commitee
		case('69'):{
			result.push(EventFactory.simple.addTR(2))
			break
		}
		//Business Contact
		case('70'):{
			result.push(EventFactory.simple.draw(4))
			result.push(EventFactory.simple.discard(2))
			break
		}
		//Comet
		case('73'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Convoy from Europa
		case('74'):{
			result.push(EventFactory.simple.draw(1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Crater
		case('75'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Deimos Down
		case('76'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,3))
			result.push(EventFactory.simple.addRessource({name: 'megacredit',valueStock: 7}))
			break
		}
		//Giant Ice Asteroid
		case('77'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
			break
		}
		//Ice Asteroid
		case('78'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
			break
		}
		//Ice Cap Melting
		case('79'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Imported Nitrogen
		case('81'):{
			result.push(EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:2}))
			result.push(EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:3}))
			result.push(EventFactory.simple.addRessource({name: 'plant',valueStock: 4}))
			result.push(EventFactory.simple.addTR(1))
			break
		}
		//Invention Contest
		case('83'):{
			result.push(EventFactory.simple.scanKeep({scan:3, keep:1}))
			break
		}
		//Investment Loan
		case('84'):{
			result.push(EventFactory.simple.addRessource({name:'megacredit', valueStock:10}))
			result.push(EventFactory.simple.addTR(-1))
			break
		}
		//Lagrange Observatory
		case('85'):{
			result.push(EventFactory.simple.draw(1))
			break
		}
		//Lake Marineris
		case('86'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
			break
		}
		//Lava Flows
		case('88'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
			break
		}
		//Mangrove
		case('90'):{
			result.push(EventFactory.simple.addForestAndOxygen(1))
			break
		}
		//Nitrogen-Rich Asteroid
		case('91'):{
			result.push(EventFactory.simple.addTR(2))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
			let plants = 2
			if(clientstate.getTagsOfType('plant')>=3){plants+=4}
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:plants}))
			break
		}
		//Permafrost Extraction
		case('92'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Phobos Falls
		case('93'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			result.push(EventFactory.simple.draw(2))
			break
		}
		//Plantation
		case('94'):{
			result.push(EventFactory.simple.addForestAndOxygen(2))
			break
		}
		//Release of Inert Gases
		case('95'):{
			result.push(EventFactory.simple.addTR(2))
			break
		}
		//Research
		case('96'):{
			result.push(EventFactory.simple.draw(2))
			break
		}
		//Subterranean Reservoir
		case('98'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Technology Demonstration
		case('99'):{
			result.push(EventFactory.simple.draw(2))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Terraforming Ganymede
		case('100'):{
			result.push(EventFactory.simple.addTR(clientstate.getTagsOfType('jovian')))
			break
		}
		//Towing a Comet
		case('101'):{
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Acquired Company
		case('103'):{
			result.push(EventFactory.simple.addProduction({name:'card', valueStock:1}))
			break
		}
		//Adaptated Lichen
		case('104'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			break
		}
		//Aerated Magma
		case('105'):{
			result.push(EventFactory.simple.addProduction([
				{name:'card', valueStock:1},
				{name:'heat', valueStock:2}
			]))
			break
		}
		//Airborne Radiation
		case('106'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
			break
		}
		//Acquired Company
		case('107'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			break
		}
		//Archaebacteria
		case('108'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			break
		}
		//Artificial Photosynthesis
		case('109'):{
			result.push(EventFactory.simple.addProduction([
				{name:'plant', valueStock:1},
				{name:'heat', valueStock:1}
			]))
			break
		}
		//Asteroid Mining
		case('110'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:2}))
			break
		}
		//Asteroid Mining Consortium
		case('111'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		//Astrofarm
		case('112'):{
			result.push(EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:2}))
			result.push(EventFactory.simple.addProduction([
				{name:'plant', valueStock:1},
				{name:'heat', valueStock:3}
			]))
			break
		}
		//Beam from a Thorium Asteroid
		case('116'):{
			result.push(EventFactory.simple.addProduction([
				{name:'plant', valueStock:1},
				{name:'heat', valueStock:3}
			]))
			break
		}
		//Biomass Combustors
		case('117'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:5}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:-2}))
			break
		}
		//BioThermal Power
		case('118'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			result.push(EventFactory.simple.addForestAndOxygen(1))
			break
		}
		//Blueprints
		case('119'):{
			result.push(EventFactory.simple.addProduction([
				{name:'card', valueStock:1},
				{name:'heat', valueStock:1}
			]))
			break
		}
		//Building Industries
		case('120'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:2}))
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:-4}))
			break
		}
		//Bushes
		case('121'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			break
		}
		//Callisto Penal Mines
		case('122'):{
			result.push(EventFactory.simple.addProduction({name:'card', valueStock:1}))
			break
		}
		//Coal Imports
		case('124'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			break
		}
		//Commercial Districts
		case('125'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:4}))
			break
		}
		//Deep Well Heating
		case('126'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1))
			break
		}
		//Designed Microorganisms
		case('127'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			break
		}
		//Diversified Interests
		case('128'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.addRessource([
				{name:'plant', valueStock:3},
				{name:'heat', valueStock:3}
			]))
			break
		}
		//Dust Quarry
		case('129'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:1}))
			break
		}
		//Economic Growth
		case('130'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:3}))
			break
		}
		//Energy Storage
		case('131'):{
			result.push(EventFactory.simple.addProduction({name:'card', valueStock:2}))
			break
		}
		//Eos Chasma National Park
		case('132'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:3}))
			result.push(EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:1}))
			break
		}
		//Farming
		case('133'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:2},
				{name:'plant', valueStock:2}
			]))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			break
		}
		//Food Factory
		case('134'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:4}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:-2}))
			break
		}
		//Fuel factory
		case('135'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'titanium', valueStock:1}
			]))
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:-3}))
			break
		}
		//Fuel Generators
		case('136'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			result.push(EventFactory.simple.addTR(-1))
			break
		}
		//Fusion Power
		case('137'):{
			result.push(EventFactory.simple.addProduction({name:'card', valueStock:1}))
			break
		}
		//Ganymede Shipyard
		case('138'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:2}))
			break
		}
		//Gene Repair
		case('139'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			break
		}
		//Geothermal Power
		case('140'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			break
		}
		//Giant Space Mirror
		case('141'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			break
		}
		//Grass
		case('142'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:3}))
			break
		}
		//Great Dam
		case('143'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			break
		}
		//Great Escarpment Consortium
		case('144'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:1}))
			break
		}
		//Heater
		case('145'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:1}))
			break
		}
		//Immigration Shuttles
		case('146'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:3}))
			break
		}
		//Import of Advanced GHG
		case('147'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			break
		}
		//Imported GHG
		case('148'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:5}))
			break
		}
		//Industrial Center
		case('149'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:3},
				{name:'steel', valueStock:1}
			]))
			break
		}
		//Industrial Farming
		case('150'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'plant', valueStock:2}
			]))
			break
		}
		//Industrial Microbes
		case('151'):{
			result.push(EventFactory.simple.addProduction([
				{name:'heat', valueStock:1},
				{name:'steel', valueStock:1}
			]))
			break
		}
		//Io Mining Industry
		case('153'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:2},
				{name:'titanium', valueStock:2}
			]))
			break
		}
		//Kelp Farming
		case('154'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:2},
				{name:'plant', valueStock:3}
			]))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			break
		}
		//Lichen
		case('155'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			break
		}
		//Low-Atmo Shields
		case('157'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'heat', valueStock:2}
			]))
			break
		}
		//Lunar Beam
		case('158'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:4}))
			result.push(EventFactory.simple.addTR(-1))
			break
		}
		//Mass Converter
		case('159'):{
			result.push(EventFactory.simple.addProduction([
				{name:'heat', valueStock:3},
				{name:'titanium', valueStock:1}
			]))
			break
		}
		//Methane from Titan
		case('161'):{
			result.push(EventFactory.simple.addProduction([
				{name:'plant', valueStock:2},
				{name:'heat', valueStock:2}
			]))
			break
		}
		//Micromills
		case('162'):{
			result.push(EventFactory.simple.addProduction([
				{name:'heat', valueStock:1},
				{name:'steel', valueStock:1}
			]))
			break
		}
		//Microprocessor
		case('163'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			result.push(EventFactory.simple.draw(2))
			result.push(EventFactory.simple.discard(1))
			break
		}
		//Mine
		case('164'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:2}))
			break
		}
		//Mohole Area
		case('166'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:4}))
			break
		}
		//Monocultures
		case('167'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			result.push(EventFactory.simple.addTR(-1))
			break
		}
		//Moss
		case('168'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:-1}))
			break
		}
		//Natural Preserve
		case('169'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			break
		}
		//New Portfolios
		case('170'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'plant', valueStock:1},
				{name:'heat', valueStock:1}
			]))
			break
		}
		//Nitrophilic Moss
		case('171'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			break
		}
		//Noctis Farming
		case('172'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			break
		}
		//Nuclear Plants
		case('173'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'heat', valueStock:3}
			]))
			break
		}
		//Power plant
		case('175'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			break
		}
		//Power Supply Consortium
		case('176'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:2},
				{name:'heat', valueStock:1}
			]))
			break
		}
		//Protected Valley
		case('177'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			result.push(EventFactory.simple.addForestAndOxygen(1))
			break
		}
		//Quantum Extractor
		case('178'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			break
		}
		//Rad Suits
		case('179'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			break
		}
		//Slash and Burn Agriculture
		case('182'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			break
		}
		//Smelting
		case('183'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:5}))
			result.push(EventFactory.simple.draw(2))
			break
		}
		//Soil Warming
		case('184'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
			break
		}
		//Solar Power
		case('185'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			break
		}
		//Solar Trapping
		case('186'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:3}))
			result.push(EventFactory.simple.draw(1))
			break
		}
		//Soletta
		case('187'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:5}))
			break
		}
		//Space Heaters
		case('188'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			break
		}
		//Space Station
		case('189'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		//Sponsor
		case('190'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			break
		}
		//Strip Mine
		case('191'):{
			result.push(EventFactory.simple.addProduction([
				{name:'steel', valueStock:2},
				{name:'titanium', valueStock:1}
			]))
			result.push(EventFactory.simple.addTR(-1))
			break
		}
		//Surface Mines
		case('192'):{
			result.push(EventFactory.simple.addProduction([
				{name:'steel', valueStock:1},
				{name:'titanium', valueStock:1}
			]))
			break
		}
		//Tectonic Stress Power
		case('193'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			break
		}
		//Titanium Mine
		case('194'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		//Trading Post
		case('196'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:2}))
			break
		}
		//Trapped Heat
		case('197'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:2}))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//Trees
		case('198'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:3}))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:1}))
			break
		}
		//Tropical Forest
		case('199'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:4}))
			result.push(EventFactory.simple.addRessource({name:'heat', valueStock:-5}))
			break
		}
		//Tundra Farming
		case('200'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:2},
				{name:'plant', valueStock:1}
			]))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:1}))
			break
		}
		//Underground City
		case('201'):{
			result.push(EventFactory.simple.addProduction([
				{name:'megacredit', valueStock:1},
				{name:'steel', valueStock:1}
			]))
			break
		}
		//Underseas Vents
		case('202'):{
			result.push(EventFactory.simple.addProduction([
				{name:'card', valueStock:1},
				{name:'heat', valueStock:4}
			]))
			break
		}
		//Vesta Shipyard
		case('204'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		//Wave Power
		case('205'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			break
		}
		//Biofoundries
		case('D22'):{
			result.push(EventFactory.simple.upgradePhaseCard(1))
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:2}))
			break
		}
		//Hematite Mining
		case('D29'):{
			result.push(EventFactory.simple.addProduction([
				{name:'card', valueStock:2},
				{name:'steel', valueStock:1}
			]))
			break
		}
		//Industrial Complex
		case('D32'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:4}))
			result.push(EventFactory.simple.upgradePhaseCard(1))
			break
		}
		//Award Winning Reflector Material
		case('D35'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:3}))
			if(clientstate.getMilestoneCompleted()>0){
				result.push(EventFactory.simple.addRessource({name:'heat', valueStock:4}))
			}
			break
		}
		//Perfluorocarbon Production
		case('D37'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			result.push(EventFactory.simple.upgradePhaseCard(1, [0]))
			break
		}
		//Biological Factories
		case('D40'):{
			result.push(EventFactory.simple.addProduction({name:'plant', valueStock:1}))
			result.push(EventFactory.simple.upgradePhaseCard(1, [3]))
			break
		}
		//Architecture Blueprints
		case('F09'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
			result.push(EventFactory.simple.draw(2))
			result.push(EventFactory.simple.discard(1))
			break
		}
		//Bedrock Wellbore
		case('F10'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
			break
		}
		//CHP Combustion Turbines
		case('F12'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
			break
		}
		//Grain Silos
		case('F14'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure,2))
			result.push(EventFactory.simple.addRessource({name:'plant', valueStock:4}))
			break
		}
		//Low-Atmosphere Planes
		case('F17'):{
			result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure,3))
			break
		}
		//Urban Forestry
		case('F20'):{
			result.push(EventFactory.simple.addForestAndOxygen(1))
			result.push(EventFactory.simple.addRessource({name:'megacredit', valueStock:5}))
			break
		}
		//Commercial Imports
		case('P02'):{
			result.push(EventFactory.simple.addProduction([
				{name:'card', valueStock:1},
				{name:'heat', valueStock:2}
				,{name:'plant', valueStock:2}
			]))
			break
		}
		//Matter Generator
		case('P06'):{
			result.push(EventFactory.simple.draw(2))
			break
		}
		//Processed Metals
		case('P07'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:2}))
			result.push(EventFactory.simple.draw(clientstate.getTagsOfType('power')))
			break
		}
		//Processed Metals
		case('P08'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:2}))
			break
		}
		//Innovative Technologies Award
		case('P26'):{
			result.push(EventFactory.simple.addTR(clientstate.getPhaseCardUpgradedCount()))
			break
		}
		//Glacial Evaporation
		case('P29'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:4}))
			break
		}
		//Tourism
		case('P30'):{
			result.push(EventFactory.simple.addProduction({name:'megacredit', valueStock:2}))
			result.push(EventFactory.simple.addTR(clientstate.getMilestoneCompleted()))
			break
		}
		//Interplanetary Cinematics
		case('C4'):{
			result.push(EventFactory.simple.addProduction({name:'steel', valueStock:1}))
			break
		}
		//Inventrix
		case('C5'):{
			clientstate.setPrerequisiteOffset([
				{name: GlobalParameterNameEnum.infrastructure, offset:1},
				{name: GlobalParameterNameEnum.oxygen, offset:1},
				{name: GlobalParameterNameEnum.temperature, offset:1}
			])
			result.push(EventFactory.simple.draw(3))
			break
		}
		//Phobolog
		case('C7'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			clientstate.increaseProductionModValue('titanium')
			break
		}
		//Saturn Systems
		case('C8'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		//Tharsis Republic
		case('C10'):{
			result.push(EventFactory.simple.increaseResearchScanKeep({keep:1, scan:1}))
			break
		}
		//Thorgate
		case('C11'):{
			result.push(EventFactory.simple.addProduction({name:'heat', valueStock:1}))
			break
		}
		//DevTechs
		case('CP03'):{
			result.push(EventFactory.simple.scanKeep({scan:5, keep:1}, DeckQueryOptionsEnum.DevTechs))
			break
		}
		//Zetasel
		case('CP06'):{
			result.push(EventFactory.simple.draw(5))
			result.push(EventFactory.simple.discard(4))
			break
		}
		//Point Luna
		case('CF1'):{
			result.push(EventFactory.simple.addProduction({name:'titanium', valueStock:1}))
			break
		}
		default:{
			return undefined
		}
	}
	return result
}

export const ProjectEffectRouter = {
	trigger: TriggerEffectEventFactory,
	costMod: CostModCalulator,
	getPlayed
}
