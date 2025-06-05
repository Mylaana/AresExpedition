import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../../enum/global.enum";
import { DEBUG_IGNORE_PREREQUISITES } from "../../global/global-const";
import { Checker } from "../../utils/checker";
import { ActivationOption } from "../../types/project-card.type";
import { ProjectCardActivatedEffectService } from "./project-card-activated-effect.service";

export const CardConditionChecker = {
	canBePlayed(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		if(DEBUG_IGNORE_PREREQUISITES){return true}
		switch(card.cardCode){
			//AI Central
			case('4'):{
				return Checker.isTagOk('science', 5, 'min', clientState)
			}
			//Antigravity Technology
			case('6'):{
				return Checker.isTagOk('science', 5, 'min', clientState)
			}
			//Arctic Algae
			case('8'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Birds
			case('12'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.white, 'min', clientState)
			}
			//Caretaker Contract
			case('14'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Extreme-Cold Fungus
			case('27'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', clientState)
			}
			//Fish
			case('30'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//GHG Producing Bacteria
			case('31'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Herbivores
			case('33'):{
				return Checker.isOceanOk(5, 'min', clientState)
			}
			//Livestock
			case('39'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Physics Complex
			case('46'):{
				return Checker.isTagOk('science', 4, 'min', clientState)
			}
			//Regolith Eaters
			case('50'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Small Animals
			case('53'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Symbiotic Fungus
			case('57'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Advanced Ecosystems
			case('65'):{
				return Checker.isTagOk('animal', 1, 'min', clientState)
					&& Checker.isTagOk('plant', 1, 'min', clientState)
					&& Checker.isTagOk('microbe', 1, 'min', clientState)
			}
			//Artificial Lake
			case('66'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Atmosphere filtering
			case('67'):{
				return Checker.isTagOk('science', 2, 'min', clientState)
			}
			//Breathing Filters
			case('68'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Colonizer Training Camp
			case('72'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'max', clientState)
			}
			//Crater
			case('75'):{
				return Checker.isTagOk('event', 3, 'min', clientState)
			}
			//Ice Cap Melting
			case('79'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', clientState)
			}
			//Interstellar Colony Ship
			case('82'):{
				return Checker.isTagOk('science', 4, 'min', clientState)
			}
			//Investment Loan
			case('84'):{
				return Checker.isTrOk(1, 'min', clientState)
			}
			//Lake Marineris
			case('86'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Mangrove
			case('90'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Permafrost Extraction
			case('92'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', clientState)
			}
			//Plantation
			case('94'):{
				return Checker.isTagOk('science', 4, 'min', clientState)
			}
			//Aerated Magma
			case('105'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Airborne Radiation
			case('106'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Algae
			case('107'):{
				return Checker.isOceanOk(5, 'min', clientState)
			}
			//Archaebacteria
			case('108'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', clientState)
			}
			//Beam from a Thorium Asteroid
			case('116'):{
				return Checker.isTagOk('jovian', 1, 'min', clientState)
			}
			//Biomass Combustors
			case('117'):{
				return Checker.isRessourceOk('plant', 2, 'min', clientState)
			}
			//Building Industries
			case('120'):{
				return Checker.isRessourceOk('heat', 4, 'min', clientState)
			}
			//Bushes
			case('121'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Designed Microorganisms
			case('127'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'max', clientState)
			}
			//Dust Quarry
			case('129'):{
				return Checker.isOceanOk(3, 'max', clientState)
			}
			//Energy Storage
			case('131'):{
				return Checker.isTrOk(7, 'min', clientState)
			}
			//Eos Chasma National Park
			case('132'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Farming
			case('133'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', clientState)
			}
			//Food factory
			case('134'):{
				return Checker.isRessourceOk('plant', 2, 'min', clientState)
			}
			//Fuel factory
			case('135'):{
				return Checker.isRessourceOk('heat', 3, 'min', clientState)
			}
			//Fuel Generators
			case('136'):{
				return Checker.isTrOk(1, 'min', clientState)
			}
			//Fusion Power
			case('137'):{
				return Checker.isTagOk('power', 2, 'min', clientState)
			}
			//Gene Repair
			case('139'):{
				return Checker.isTagOk('science', 3, 'min', clientState)
			}
			//Grass
			case('142'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Great Dam
			case('143'):{
				return Checker.isOceanOk(2, 'min', clientState)
			}
			//Kelp Farming
			case('154'):{
				return Checker.isOceanOk(6, 'min', clientState)
			}
			//Low-Atmo Shields
			case('157'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Lunar Beam
			case('158'):{
				return Checker.isTrOk(1, 'min', clientState)
			}
			//Mass Converter
			case('159'):{
				return Checker.isTagOk('science', 4, 'min', clientState)
			}
			//Methane from Titan
			case('161'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Monocultures
			case('167'):{
				return Checker.isTrOk(1, 'min', clientState)
			}
			//Moss
			case('168'):{
				if(Checker.isOceanOk(3, 'min', clientState)===false){return false}
				return Checker.isRessourceOk('plant', 1, 'min', clientState)
			}
			//Natural Preserve
			case('169'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Noctis Farming
			case('172'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Quantum Extractor
			case('178'):{
				return Checker.isTagOk('science', 3, 'min', clientState)
			}
			//Rad Suits
			case('179'):{
				return Checker.isOceanOk(2, 'min', clientState)
			}
			//Strip Mine
			case('191'):{
				return Checker.isTrOk(1, 'min', clientState)
			}
			//Trapped Heat
			case('197'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Trees
			case('198'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Tropical Forest
			case('199'):{
				return Checker.isRessourceOk('heat', 5, 'min', clientState)
			}
			//Tundra Farming
			case('200'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Wave Power
			case('203'):{
				return Checker.isOceanOk(3, 'min', clientState)
			}
			//Worms
			case('207'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Zeppelins
			case('208'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Urban Forestry
			case('F20'):{
				return Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.yellow, 'min', clientState)
			}
			//Filter Feeders
			case('P04'):{
				return Checker.isOceanOk(2, 'min', clientState)
			}
			default:{
				return true
			}
		}
	},
	canBeActivated(card: PlayableCardModel, clientState: PlayerStateModel, activationOption:  ActivationOption = 1): boolean {
		const noCost = ['4','13','15','16','18', 'CP02']
		if(noCost.includes(card.cardCode)){return true}
		switch(card.cardCode){
			//AI Central
			case('4'):{break}
			//Aquifer Pumping
			case('7'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card,clientState), 'min', clientState)
			}
			//Artificial Jungle
			case('9'):{
				return Checker.isRessourceOk('plant', 1, 'min', clientState)
			}
			//Birds
			case('12'):{break}
			//Caretaker Contract
			case('14'):{
				return Checker.isRessourceOk('heat', 8, 'min', clientState)
			}
			//Circuit Board Factory
			case('15'):{break}
			//Community Gardens
			case('16'):{break}
			//Conserved Biomes
			case('18'):{break}
			//Decomposing Fungus
			case('20'):{
				return false
				return Checker.isMinimumStockOnPlayedCardOk([{name:'animal', valueStock:1}, {name:'microbe', valueStock:1}], clientState)
			}
			//Developed Infrastructure
			case('21'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Development Center
			case('22'):{
				return Checker.isRessourceOk('heat', 2, 'min', clientState)
			}
			//Extreme-Cold Fungus
			case('27'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						return clientState.hasProjectPlayedOfFilterType({type:'stockable', stockableType:'microbe'})
					}
				}
				break
			}
			//Farmers Market
			case('28'):{
				return Checker.isRessourceOk('megacredit', 1, 'min', clientState)
			}
			//Farming Co-ops
			case('29'):{
				return Checker.isHandCurrentSizeOk(1, 'min', clientState)
			}
			//GHG Producing Bacteria
			case('31'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=2
							}
						}
						return false
					}
				}
			}
			//Hydro-Electric Energy
			case('34'):{
				return Checker.isRessourceOk( 'megacredit',  1, 'min', clientState)
			}
			//Ironworks
			case('38'):{
				return Checker.isRessourceOk('heat', 4, 'min', clientState)
			}
			//Matter Manufacturing
			case('41'):{
				return Checker.isRessourceOk('megacredit', 1, 'min', clientState)
			}
			//Nitrite Reducing Bacteria
			case('43'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=3
							}
						}
						return false
					}
				}
			}
			//Regolith Eaters
			case('50'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=2
							}
						}
						return false
					}
				}
			}
			//Solarpunk
			case('54'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Steelworks
			case('56'):{
				return Checker.isRessourceOk('heat', 6, 'min', clientState)
			}
			//Symbiotic Fungus
			case('57'):{break}
			//Tardigrades
			case('58'):{break}
			//Steelworks
			case('59'):{
				return Checker.isRessourceOk('megacredit', 2, 'min', clientState)
			}
			//Volcanic Pools
			case('62'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Water Import from Europa
			case('63'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Wood Burning Stoves
			case('64'):{
				return Checker.isRessourceOk('plant', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Sawmill
			case('F08'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Progressive Policies
			case('P09'):{
				return Checker.isRessourceOk('megacredit', ProjectCardActivatedEffectService.getScalingActivationCost(card, clientState), 'min', clientState)
			}
			//Matter Generator
			case('P06'):{
				return Checker.isHandCurrentSizeOk(1, 'min', clientState)
			}
			default:{
				return false
			}
		}
		return true
	}
}
