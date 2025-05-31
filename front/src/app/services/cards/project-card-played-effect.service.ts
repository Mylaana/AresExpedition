import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { EventBaseModel, EventCardSelector } from "../../models/core-game/event.model";
import { RessourceStock, GlobalParameterValue, ScanKeep, RessourceInfo } from "../../interfaces/global.interface";
import { CostMod } from "../../types/project-card.type";
import { AdvancedRessourceStock } from "../../interfaces/global.interface";
import { EventDesigner } from "../designers/event-designer.service";
import { GlobalInfo } from "../global/global-info.service";
import { GlobalParameterNameEnum } from "../../enum/global.enum";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPlayedEffectService {
	/**
	 *
	 * @param card
	 * @returns Event List

	* Events should be filled to the list according to their order of execution.
	 */
	public static getPlayedCardEvent(cardCode: string, clientstate: PlayerStateModel): EventBaseModel[] | undefined{
		let result: EventBaseModel[] = []
		switch(cardCode){
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
				ProjectCardPlayedEffectService.createEventAddRessourceToSelectedCard({name: 'microbe',valueStock: 2})
				break
			}
			//Extended Ressourcess
			case('26'):{
				result.push(ProjectCardPlayedEffectService.createEventIncreaseResearchScanKeep({keep:1, scan:0}))
				break
			}
			//Farming Co-ops
			case('29'):{
				result.push(this.createEventAddRessource({name: 'plant',valueStock: 3}))
				break
			}
			//Interplanetary Relations
			case('35'):{
				result.push(this.createEventIncreaseResearchScanKeep({keep:1, scan:1}))
				break
			}
			//Interns
			case('36'):{
				result.push(this.createEventIncreaseResearchScanKeep({keep:0, scan:2}))
				break
			}
			//United Planetary Alliance
			case('60'):{
				result.push(this.createEventIncreaseResearchScanKeep({keep:1, scan:1}))
				break
			}
			//Artificial Lake
			case('66'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Atmosphere Filtering
			case('67'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
				break
			}
			//Bribed Commitee
			case('69'):{
				result.push(this.createEventAddTR(2))
				break
			}
			//Business Contact
			case('70'):{
				result.push(this.createEventDraw(4))
				result.push(this.createEventDiscard(2))
				break
			}
			//Comet
			case('73'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Convoy from Europa
			case('74'):{
				result.push(this.createEventDraw(1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Crater
			case('75'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Deimos Down
			case('76'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,3))
				result.push(this.createEventAddRessource({name: 'megacredit',valueStock: 7}))
				break
			}
			//Giant Ice Asteroid
			case('77'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				break
			}
			//Ice Asteroid
			case('78'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				break
			}
			//Ice Cap Melting
			case('79'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Imported Nitrogen
			case('81'):{
				result.push(this.createEventAddRessourceToSelectedCard({name:'animal', valueStock:2}))
				result.push(this.createEventAddRessourceToSelectedCard({name:'microbe', valueStock:3}))
				result.push(this.createEventAddRessource({name: 'plant',valueStock: 4}))
				result.push(this.createEventAddTR(1))
				break
			}
			//Invention Contest
			case('83'):{
				result.push(this.createEventScanKeep({scan:3, keep:1}))
				break
			}
			//Investment Loan
			case('84'):{
				result.push(this.createEventAddRessource({name:'megacredit', valueStock:10}))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Lagrange Observatory
			case('85'):{
				result.push(this.createEventDraw(1))
				break
			}
			//Lake Marineris
			case('86'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,2))
				break
			}
			//Lava Flows
			case('88'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,2))
				break
			}
			//Mangrove
			case('90'):{
				result.push(this.createEventAddForestAndOxygen(1))
				break
			}
			//Nitrogen-Rich Asteroid
			case('91'):{
				result.push(this.createEventAddTR(2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				let plants = 2
				if(clientstate.getTagsOfType('plant')>=3){plants+=4}
				result.push(this.createEventAddRessource({name:'plant', valueStock:plants}))
				break
			}
			//Permafrost Extraction
			case('92'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Phobos Falls
			case('93'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				result.push(this.createEventDraw(2))
				break
			}
			//Plantation
			case('94'):{
				result.push(this.createEventAddForestAndOxygen(2))
				break
			}
			//Release of Inert Gases
			case('95'):{
				result.push(this.createEventAddTR(2))
				break
			}
			//Research
			case('96'):{
				result.push(this.createEventDraw(2))
				break
			}
			//Subterranean Reservoir
			case('98'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Technology Demonstration
			case('99'):{
				result.push(this.createEventDraw(2))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Terraforming Ganymede
			case('100'):{
				result.push(this.createEventAddTR(clientstate.getTagsOfType('jovian')))
				break
			}
			//Towing a Comet
			case('101'):{
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Acquired Company
			case('103'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Adaptated Lichen
			case('104'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Aerated Magma
			case('105'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:2}
				]))
				break
			}
			//Airborne Radiation
			case('106'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
				break
			}
			//Acquired Company
			case('107'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Archaebacteria
			case('108'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Artificial Photosynthesis
			case('109'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Asteroid Mining
			case('110'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:2}))
				break
			}
			//Asteroid Mining Consortium
			case('111'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Astrofarm
			case('112'):{
				result.push(this.createEventAddRessourceToSelectedCard({name:'microbe', valueStock:2}))
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Beam from a Thorium Asteroid
			case('116'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Biomass Combustors
			case('117'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:5}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:-2}))
				break
			}
			//BioThermal Power
			case('118'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventAddForestAndOxygen(1))
				break
			}
			//Blueprints
			case('119'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Building Industries
			case('120'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:2}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-4}))
				break
			}
			//Bushes
			case('121'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Callisto Penal Mines
			case('122'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Coal Imports
			case('124'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Commercial Districts
			case('125'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:4}))
				break
			}
			//Deep Well Heating
			case('126'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature, 1))
				break
			}
			//Designed Microorganisms
			case('127'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Diversified Interests
			case('128'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource([
					{name:'plant', valueStock:3},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Dust Quarry
			case('129'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:1}))
				break
			}
			//Economic Growth
			case('130'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:3}))
				break
			}
			//Energy Storage
			case('131'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:2}))
				break
			}
			//Eos Chasma National Park
			case('132'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:3}))
				result.push(this.createEventAddRessourceToSelectedCard({name:'animal', valueStock:1}))
				break
			}
			//Farming
			case('133'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'plant', valueStock:2}
				]))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Food Factory
			case('134'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:4}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:-2}))
				break
			}
			//Fuel factory
			case('135'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'titanium', valueStock:1}
				]))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-3}))
				break
			}
			//Fuel Generators
			case('136'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Fusion Power
			case('137'):{
				result.push(this.createEventAddProduction({name:'card', valueStock:1}))
				break
			}
			//Ganymede Shipyard
			case('138'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:2}))
				break
			}
			//Gene Repair
			case('139'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//Geothermal Power
			case('140'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Giant Space Mirror
			case('141'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Grass
			case('142'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:3}))
				break
			}
			//Great Dam
			case('143'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Great Escarpment Consortium
			case('144'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:1}))
				break
			}
			//Heater
			case('145'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:1}))
				break
			}
			//Immigration Shuttles
			case('146'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:3}))
				break
			}
			//Import of Advanced GHG
			case('147'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Imported GHG
			case('148'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:5}))
				break
			}
			//Industrial Center
			case('149'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:3},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Industrial Farming
			case('150'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'plant', valueStock:2}
				]))
				break
			}
			//Industrial Microbes
			case('151'):{
				result.push(this.createEventAddProduction([
					{name:'heat', valueStock:1},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Io Mining Industry
			case('153'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'titanium', valueStock:2}
				]))
				break
			}
			//Kelp Farming
			case('154'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'plant', valueStock:3}
				]))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Lichen
			case('155'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				break
			}
			//Low-Atmo Shields
			case('157'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'heat', valueStock:2}
				]))
				break
			}
			//Lunar Beam
			case('158'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Mass Converter
			case('159'):{
				result.push(this.createEventAddProduction([
					{name:'heat', valueStock:3},
					{name:'titanium', valueStock:1}
				]))
				break
			}
			//Methane from Titan
			case('161'):{
				result.push(this.createEventAddProduction([
					{name:'plant', valueStock:2},
					{name:'heat', valueStock:2}
				]))
				break
			}
			//Micromills
			case('162'):{
				result.push(this.createEventAddProduction([
					{name:'heat', valueStock:1},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Microprocessor
			case('163'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				result.push(this.createEventDraw(2))
				result.push(this.createEventDiscard(1))
				break
			}
			//Mine
			case('164'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:2}))
				break
			}
			//Mohole Area
			case('166'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				break
			}
			//Monocultures
			case('167'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Moss
			case('168'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:-1}))
				break
			}
			//Natural Preserve
			case('169'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//New Portfolios
			case('170'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'plant', valueStock:1},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Nitrophilic Moss
			case('171'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Noctis Farming
			case('172'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Nuclear Plants
			case('173'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'heat', valueStock:3}
				]))
				break
			}
			//Power plant
			case('175'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				break
			}
			//Power Supply Consortium
			case('176'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'heat', valueStock:1}
				]))
				break
			}
			//Protected Valley
			case('177'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddForestAndOxygen(1))
				break
			}
			//Quantum Extractor
			case('178'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Rad Suits
			case('179'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//Slash and Burn Agriculture
			case('182'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Smelting
			case('183'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:5}))
				result.push(this.createEventDraw(2))
				break
			}
			//Soil Warming
			case('184'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				break
			}
			//Solar Power
			case('185'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				break
			}
			//Solar Trapping
			case('186'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:3}))
				result.push(this.createEventDraw(1))
				break
			}
			//Soletta
			case('187'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:5}))
				break
			}
			//Space Heaters
			case('188'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				break
			}
			//Space Station
			case('189'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Sponsor
			case('190'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				break
			}
			//Strip Mine
			case('191'):{
				result.push(this.createEventAddProduction([
					{name:'steel', valueStock:2},
					{name:'titanium', valueStock:1}
				]))
				result.push(this.createEventAddTR(-1))
				break
			}
			//Surface Mines
			case('192'):{
				result.push(this.createEventAddProduction([
					{name:'steel', valueStock:1},
					{name:'titanium', valueStock:1}
				]))
				break
			}
			//Tectonic Stress Power
			case('193'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Titanium Mine
			case('194'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Trading Post
			case('196'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:2}))
				break
			}
			//Trapped Heat
			case('197'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:2}))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//Trees
			case('198'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:3}))
				result.push(this.createEventAddRessource({name:'plant', valueStock:1}))
				break
			}
			//Tropical Forest
			case('199'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:4}))
				result.push(this.createEventAddRessource({name:'heat', valueStock:-5}))
				break
			}
			//Tundra Farming
			case('200'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:2},
					{name:'plant', valueStock:1}
				]))
				result.push(this.createEventAddRessource({name:'plant', valueStock:1}))
				break
			}
			//Underground City
			case('201'):{
				result.push(this.createEventAddProduction([
					{name:'megacredit', valueStock:1},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Underseas Vents
			case('202'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:4}
				]))
				break
			}
			//Vesta Shipyard
			case('204'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Wave Power
			case('205'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				break
			}
			//Biofoundries
			case('D22'):{
				result.push(this.createEventUpgradePhaseCard(1))
				result.push(this.createEventAddProduction({name:'plant', valueStock:2}))
				break
			}
			//Hematite Mining
			case('D29'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:2},
					{name:'steel', valueStock:1}
				]))
				break
			}
			//Industrial Complex
			case('D32'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				result.push(this.createEventUpgradePhaseCard(1))
				break
			}
			//Award Winning Reflector Material
			case('D35'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:3}))
				if(clientstate.getMilestoneCompleted()>0){
					result.push(this.createEventAddRessource({name:'heat', valueStock:4}))
				}
				break
			}
			//Perfluorocarbon Production
			case('D37'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				result.push(this.createEventUpgradePhaseCard(1, [0]))
				break
			}
			//Biological Factories
			case('D40'):{
				result.push(this.createEventAddProduction({name:'plant', valueStock:1}))
				result.push(this.createEventUpgradePhaseCard(1, [3]))
				break
			}
			//Architecture Blueprints
			case('F09'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				result.push(this.createEventDraw(2))
				result.push(this.createEventDiscard(1))
				break
			}
			//Bedrock Wellbore
			case('F10'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.ocean,1))
				break
			}
			//CHP Combustion Turbines
			case('F12'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.oxygen,1))
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.temperature,1))
				break
			}
			//Grain Silos
			case('F14'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,2))
				result.push(this.createEventAddRessource({name:'plant', valueStock:4}))
				break
			}
			//Low-Atmosphere Planes
			case('F17'):{
				result.push(this.createEventIncreaseGlobalParameter(GlobalParameterNameEnum.infrastructure,3))
				break
			}
			//Urban Forestry
			case('F20'):{
				result.push(this.createEventAddForestAndOxygen(1))
				result.push(this.createEventAddRessource({name:'megacredit', valueStock:5}))
				break
			}
			//Commercial Imports
			case('P02'):{
				result.push(this.createEventAddProduction([
					{name:'card', valueStock:1},
					{name:'heat', valueStock:2}
					,{name:'plant', valueStock:2}
				]))
				break
			}
			//Matter Generator
			case('P06'):{
				result.push(this.createEventDraw(2))
				break
			}
			//Processed Metals
			case('P07'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:2}))
				result.push(this.createEventDraw(clientstate.getTagsOfType('power')))
				break
			}
			//Processed Metals
			case('P08'):{
				result.push(this.createEventAddProduction({name:'steel', valueStock:2}))
				break
			}
			//Innovative Technologies Award
			case('P26'):{
				result.push(this.createEventAddTR(clientstate.getPhaseCardUpgradedCount()))
				break
			}
			//Glacial Evaporation
			case('P29'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:4}))
				break
			}
			//Tourism
			case('P30'):{
				result.push(this.createEventAddProduction({name:'megacredit', valueStock:2}))
				result.push(this.createEventAddTR(clientstate.getMilestoneCompleted()))
				break
			}

			//Saturn Systems
			case('C8'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			//Thorgate
			case('C11'):{
				result.push(this.createEventAddProduction({name:'heat', valueStock:1}))
				break
			}
			//Point Luna
			case('CF1'):{
				result.push(this.createEventAddProduction({name:'titanium', valueStock:1}))
				break
			}
			default:{
				return undefined
			}
		}
		return result
	}

	getCostModFromTriggers(mod: CostMod): number {
		if(!mod || !mod.playedTriggersList){return 0}
		let newMod: number = 0
		let tags: number[] = []

		if(mod.tagList!=undefined){
			tags = mod.tagList.filter((e, i) => e !== -1);
		}
		for(let triggerId of mod.playedTriggersList){
			newMod += this.calculateCostModFromTrigger(triggerId, mod)
		}

		return newMod
	}
	calculateCostModFromTrigger(trigger: string, mod:CostMod): number {
		if(!mod || !mod.tagList){return 0}
		let costMod: number = 0

		switch(trigger){
			//Earth Catapult
			case('23'):{
				costMod += 2
				break
			}
			//Energy Subsidies
			case('25'):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('power','tag'))===false){break}
				costMod += 4
				break
			}
			//Interplanetary Conference
			case('37'):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))){costMod += 3}
				if(mod.tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))){costMod += 3}
				break
			}
			//Media Group
			case('42'):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('event','tag'))){costMod += 5}
				break
			}
			//Research Outpost
			case('51'):{
				costMod += 1
				break
			}
			//Teractor
			case('C9'):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))){costMod += 3}
				break
			}
			//Teractor
			case('C11'):{
				if(mod.tagList.includes(GlobalInfo.getIdFromType('power','tag'))){costMod += 3}
				break
			}
		}

		return costMod
	}
	public static getEventTriggerByPlayedCard(playedCard: PlayableCardModel, triggerIdList: string[], state: PlayerStateModel): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByPlayedCard(triggerId, playedCard, state)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	public static generateEventTriggerByPlayedCard(triggerId: string, playedCard: PlayableCardModel, state: PlayerStateModel): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []

		switch(triggerId){
			//Antigravity Technology
			case('6'):{
				result.push(this.createEventAddRessource([
					{name: 'plant', valueStock: 2},
					{name: 'heat', valueStock: 2},
				]))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	public static getTriggerByPlayedCard(playedCard: PlayableCardModel, triggerIdList: string[]): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByTagGained(triggerId, playedCard.tagsId, triggerId===playedCard.cardCode)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	public static getTriggerByTagGained(tagList: number[], triggers: string[], isTriggeringSelf: boolean): EventBaseModel[] | undefined{
		if(triggers.length===0){return}
		let events: EventBaseModel[] = []

		for(let trigger of triggers){
			let newEvent = this.generateEventTriggerByTagGained(trigger, tagList, isTriggeringSelf)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}
	public static generateEventTriggerByTagGained(trigger: string, tagsIdList: number[], isTriggeringSelf: boolean): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []
		switch(trigger){
			//Decomposers
			case('19'):{
				let triggerred: number = 0
				if(tagsIdList.includes(GlobalInfo.getIdFromType('plant','tag'))){triggerred+=1}
				if(tagsIdList.includes(GlobalInfo.getIdFromType('animal','tag'))){triggerred+=1}
				if(tagsIdList.includes(GlobalInfo.getIdFromType('microbe','tag'))){triggerred+=1}
				for(let i=0; i<triggerred; i++){
					result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:'microbe', valueStock:1}, trigger))
				}
				break
			}
			//Ecological Zone
			case('24'):{
				let triggerred: number = 0
				if(tagsIdList.includes(GlobalInfo.getIdFromType('plant','tag'))){triggerred+=1}
				if(tagsIdList.includes(GlobalInfo.getIdFromType('animal','tag'))){triggerred+=1}
				for(let i=0; i<triggerred; i++){
					result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:'animal', valueStock:1}, trigger))
				}
				break
			}
			//Energy Subsidies
			case('25'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('power','tag'))!=true){break}
				result.push(ProjectCardPlayedEffectService.createEventDraw(1))
				break
			}
			//Interplanetary Conference
			case('37'):{
				//self triggering excluded
				if(isTriggeringSelf===true){break}
				if(tagsIdList.includes(GlobalInfo.getIdFromType('earth','tag'))!=true
					&& tagsIdList.includes(GlobalInfo.getIdFromType('jovian','tag'))!=true
				){break}
				//triggers for each tag in the played card
				let draw = 0
				for(let tag of tagsIdList){
					if(tag === GlobalInfo.getIdFromType('earth','tag') || tag === GlobalInfo.getIdFromType('jovian','tag')){
						draw += 1
					}
				}
				result.push(ProjectCardPlayedEffectService.createEventDraw(draw))
				break
			}
			//Olympus Conference
			case('44'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('science','tag'))!=true){break}
				result.push(ProjectCardPlayedEffectService.createEventDraw(1))
				break
			}
			//Optimal Aerobraking
			case('45'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('event','tag'))!=true){break}
				result.push(
					ProjectCardPlayedEffectService.createEventAddRessource([
					{name: 'plant', valueStock: 2},
					{name: 'heat', valueStock: 2}])
				)
				break
			}
			//Recycled Detritus
			case('48'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('event','tag'))!=true){break}
				result.push(ProjectCardPlayedEffectService.createEventDraw(2))
				break
			}
			//Bacterial Aggregate
			case('P19'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('earth','tag'))!=true){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:'microbe', valueStock: 1}, trigger))
				break
			}
			//Saturn Systems
			case('C8'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('jovian','tag'))!=true){break}
				if(isTriggeringSelf){break}
				result.push(this.createEventAddTR(1))
				break
			}
			//Point Luna
			case('CF1'):{
				if(tagsIdList.includes(GlobalInfo.getIdFromType('earth','tag'))!=true){break}
				result.push(this.createEventDraw(1))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	public static getEventTriggerByRessourceAddedToCard(targetCard: PlayableCardModel, triggerIdList: string[], ressource: AdvancedRessourceStock): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByRessourceAddedToCard(triggerId, targetCard, ressource)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}

	public static generateEventTriggerByRessourceAddedToCard(trigger: string, targetCard: PlayableCardModel, ressource: AdvancedRessourceStock): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []

		switch(trigger){
			//Filter Feeders
			case('P04'):{
				if(ressource.name!='microbe'){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"animal", valueStock:1}, trigger))
				break
			}
			//Bacterial Aggregate
			case('P19'):{
				if(ressource.name!!='microbe'||ressource.valueStock<1){break}

				let stock = targetCard.getStockValue('microbe')
				if(stock>=5){
					result.push(ProjectCardPlayedEffectService.createEventDeactivateTrigger(trigger))
				}

				let limit = targetCard.getCardTriggerLimit()
				if(limit===undefined){break}

				let addValue = Math.min(ressource.valueStock, limit?.limit - limit.value)
				if(addValue<=0){break}

				result.push(ProjectCardPlayedEffectService.createEventIncreaseResearchScanKeep({keep:0, scan:addValue}))
				targetCard.triggerLimit.value += addValue
				break
			}
			default:{
				return
			}
		}

		return result
	}
	public static getEventTriggerByGlobalParameterIncrease(triggerIdList: string[], parameter: GlobalParameterValue): EventBaseModel[] | undefined{
		if(triggerIdList.length===0){return}
		let events: EventBaseModel[] = []

		for(let triggerId of triggerIdList){
			let newEvent = this.generateEventTriggerByGlobalParameterIncrease(triggerId, parameter)
			if(newEvent){
				events = events.concat(newEvent)
			}
		}
		return events
	}

	public static generateEventTriggerByGlobalParameterIncrease(trigger: string, parameter: GlobalParameterValue): EventBaseModel[] | undefined {
		let result: EventBaseModel[] = []
		console.log('global increase trigger')
		switch(trigger){
			//Arctic Algae
			case('8'):{
				if(parameter.name!=GlobalParameterNameEnum.ocean){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessource({name:'plant', valueStock:4}))
				break
			}
			//Fish
			case('30'):{
				if(parameter.name!=GlobalParameterNameEnum.ocean){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"animal", valueStock:parameter.steps}, trigger))
				break
			}
			//Herbivores
			case('33'):{
				if(parameter.name===GlobalParameterNameEnum.infrastructure){break} // triggers on all but infrastructure
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"animal", valueStock:parameter.steps}, trigger))
				break
			}
			//Livestock
			case('39'):{
				if(parameter.name!=GlobalParameterNameEnum.temperature){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"animal", valueStock:parameter.steps}, trigger))
				break
			}
			//Physiscs Complex
			case('46'):{
				if(parameter.name!=GlobalParameterNameEnum.temperature){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"science", valueStock:parameter.steps}, trigger))
				break
			}
			//Pets
			case('F07'):{
				console.log('pets')
				if(parameter.name!=GlobalParameterNameEnum.infrastructure){break}
				result.push(ProjectCardPlayedEffectService.createEventAddRessourceToCardId({name:"animal", valueStock:parameter.steps}, trigger))
				break
			}
			default:{
				return
			}
		}

		return result
	}
	private static createEventDraw(drawNumber: number): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber,discard:0}})
	}
	private static createEventDiscard(discardNumber: number): EventCardSelector {
		return EventDesigner.createCardSelector("discardCards", {cardSelector: {selectionQuantity: discardNumber}})
	}
	private static createEventUpgradePhaseCard(phaseCardUpgradeCount: number, phaseCardList?: number[]): EventBaseModel {
		return EventDesigner.createGeneric('upgradePhaseCards', {phaseCardUpgradeList:phaseCardList, phaseCardUpgradeNumber:phaseCardUpgradeCount})
	}
	private static createEventIncreaseGlobalParameter(parameterName: GlobalParameterNameEnum, steps:number): EventBaseModel {
		return EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter:{name:parameterName,steps: steps}})
	}
	private static createEventAddRessource(gain: RessourceStock | RessourceStock[]): EventBaseModel {
		return EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource:gain})
	}
	private static createEventAddRessourceToCardId(gain: AdvancedRessourceStock, cardId: string): EventBaseModel {
		return EventDesigner.createTargetCard('addRessourceToCardId', cardId, {advancedRessource:gain})
	}
	private static createEventIncreaseResearchScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createGeneric('increaseResearchScanKeep', {scanKeep:scanKeep})
	}
	private static createEventAddRessourceToSelectedCard(ressource: AdvancedRessourceStock, cardSelectionQuantity:number=1): EventBaseModel {
		return EventDesigner.createCardSelectorRessource(ressource, {cardSelector:{selectionQuantity:cardSelectionQuantity}})
	}
	private static createEventDeactivateTrigger(triggerId: string): EventBaseModel {
		return EventDesigner.createTargetCard('deactivateTrigger', triggerId)
	}
	private static createEventScanKeep(scanKeep: ScanKeep): EventBaseModel {
		return EventDesigner.createDeckQueryEvent('scanKeepQuery', {scanKeep:scanKeep})
	}
	private static createEventAddProduction(gain: RessourceStock | RessourceStock[]): EventBaseModel {
		return EventDesigner.createGeneric('addProduction', {baseRessource:gain})
	}
	private static createEventAddTR(quantity: number): EventBaseModel {
		return EventDesigner.createGeneric('addTr', {increaseTr: quantity})
	}
	private static createEventAddForestAndOxygen(quantity: number): EventBaseModel {
		return EventDesigner.createGeneric('addForestPointAndOxygen', {addForestPoint:quantity})
	}
}
