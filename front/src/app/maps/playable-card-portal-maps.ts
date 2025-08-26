import { GlobalParameterNameEnum, EffectPortalEnum, EffectPortalButtonEnum, DiscardOptionsEnum, DeckQueryOptionsEnum } from "../enum/global.enum";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { Checker } from "../utils/checker";
import { EventFactory } from "../factory/event/event-factory";

export const EFFECT_PORTAL: Record<string, (button: EffectPortalButtonEnum) => EventBaseModel[]> = {
	//Decomposers
	'19': (button) => {
		if(button===EffectPortalButtonEnum.decomposers_Add){
			return  [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1}, '19')]
		}
		return [
			EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock: -1}, '19'),
			EventFactory.simple.draw(1)
		]
	},
	//Decomposers
	'61': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.viralEnhancer_Plant):{
				return [EventFactory.simple.addRessource({name:'plant', valueStock:1})]
			}
			case(EffectPortalButtonEnum.viralEnhancer_Microbe):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:1}, 1)]
			}
			case(EffectPortalButtonEnum.viralEnhancer_Animal):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:1}, 1)]
			}
		}
		return []
	},
	//Imported Hydrogen
	'80': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.importedHydrogen_Plant):{
				return [EventFactory.simple.addRessource({name:'plant', valueStock:3})]
			}
			case(EffectPortalButtonEnum.importedHydrogen_Microbe):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:3}, 1)]
			}
			case(EffectPortalButtonEnum.importedHydrogen_Animal):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:2}, 1)]
			}
		}
		return []
	},
	//Large Convoy
	'87': (button) => {
		if(button===EffectPortalButtonEnum.largeConvoy_Animal){
			return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:3}, 1)]
		}
		return [EventFactory.simple.addRessource({name:'plant', valueStock:5})]
	},
	//Local Heat Trapping
	'89': (button) => {
		if(button===EffectPortalButtonEnum.localHeatTrapping_Microbe){
			return [EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:2}, 1)]
		}
		return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:2}, 1)]
	},
	//Biomedical Imports
	'D14': (button) => {
		if(button===EffectPortalButtonEnum.biomedicalImports_Oxygen){
			return [EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)]
		}
		return [EventFactory.simple.upgradePhaseCard(1)]
	},
	//Cryogentic Shipment
	'D15': (button) => {
		if(button===EffectPortalButtonEnum.cryogenticShipment_Microbe){
			return [EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:3})]
		}
		return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:2})]
	},
	//Cargo Ships
	'F04': (button) => {
		if(button===EffectPortalButtonEnum.cargoShips_Heat){
			return [EventFactory.simple.addRessource({name:'heat', valueStock:2})]
		}
		return [EventFactory.simple.addRessource({name:'plant', valueStock:2})]
	},
	//Pushnik Haker alliance - Action
	'CF2': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.pushnikAction_Animal):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:1}, 1)]
			}
			case(EffectPortalButtonEnum.pushnikAction_Microbe):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:1}, 1)]
			}
			case(EffectPortalButtonEnum.pushnikAction_Science):{
				return [EventFactory.simple.addRessourceToSelectedCard({name:'science', valueStock:1}, 1)]
			}
			case(EffectPortalButtonEnum.pushnikProduction_mc):{
				return [EventFactory.simple.addProduction({name:'megacredit', valueStock:1})]
			}
			case(EffectPortalButtonEnum.pushnikProduction_heat):{
				return [EventFactory.simple.addProduction({name:'heat', valueStock:1})]
			}
			case(EffectPortalButtonEnum.pushnikProduction_plant):{
				return [EventFactory.simple.addProduction({name:'plant', valueStock:1})]
			}
		}
		return []
	},
	//CLM - The hesitant hivemind
	'CF3': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.clm_2):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-2}, 'CF3'),
					EventFactory.simple.discardOptions(1, 'max', DiscardOptionsEnum.clm)
				]
			}
			case(EffectPortalButtonEnum.clm_3):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-3}, 'CF3'),
					EventFactory.simple.addProduction([{name:'heat', valueStock:2}, {name:'plant', valueStock:1}])
				]
			}
			case(EffectPortalButtonEnum.clm_4):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-4}, 'CF3'),
					EventFactory.simple.scanKeep({scan:3, keep:1}, DeckQueryOptionsEnum.clm)
				]
			}
			case(EffectPortalButtonEnum.clm_5):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-5}, 'CF3'),
					EventFactory.simple.resolveWildTag('CF3', ['building','space','power','plant','animal','microbe','event'])
				]
			}
			case(EffectPortalButtonEnum.clm_7):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-7}, 'CF3'),
					EventFactory.simple.addProduction([{name:'steel', valueStock:1}, {name:'titanium', valueStock:1}])
				]
			}
			case(EffectPortalButtonEnum.clm_8):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-8}, 'CF3'),
					EventFactory.simple.addTR(2)
				]
			}
			case(EffectPortalButtonEnum.clm_12):{
				return [
					EventFactory.simple.addRessourceToCardId({name:'science', valueStock:-12}, 'CF3'),
					EventFactory.simple.addTagToCard('CF3', 'jovian'),
					EventFactory.simple.addTagToCard('CF3', 'earth')
				]
			}
		}
		return []
	},
	//Secret Labs
	'FM25': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.secretLabs_Ocean):{
				return [
					EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:2}),
					EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
				]
			}
			case(EffectPortalButtonEnum.secretLabs_Oxygen):{
				return [
					EventFactory.simple.addRessource({name:'plant', valueStock:3}),
					EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)
				]
			}
			case(EffectPortalButtonEnum.secretLabs_Temperature):{
				return [
					EventFactory.simple.addRessourceToSelectedCard({name:'science', valueStock:2}),
					EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
				]
			}
		}
		return []
	},
}
export const EFFECT_PORTAL_BUTTON_CAPTION: Record<string, (button: EffectPortalButtonEnum) => string> = {
	//Decomposers
	'19': (button) => button===EffectPortalButtonEnum.decomposers_Add?'$ressource_microbe$':'-$ressource_microbe$: $ressource_card$',
	//Imported Hydrogen
	'61': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.viralEnhancer_Plant):{
				return '$ressource_plant$'
			}
			case(EffectPortalButtonEnum.viralEnhancer_Microbe):{
				return '$ressource_microbe$*'
			}
			case(EffectPortalButtonEnum.viralEnhancer_Animal):{
				return '$ressource_animal$*'
			}
		}
		return ''
	},
	//Imported Hydrogen
	'80': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.importedHydrogen_Plant):{
				return '$ressource_plant$$ressource_plant$$ressource_plant$'
			}
			case(EffectPortalButtonEnum.importedHydrogen_Microbe):{
				return '$ressource_microbe$$ressource_microbe$$ressource_microbe$*'
			}
			case(EffectPortalButtonEnum.importedHydrogen_Animal):{
				return '$ressource_animal$$ressource_animal$*'
			}
		}
		return ''
	},
	//Large Convoy
	'87': (button) => button===EffectPortalButtonEnum.largeConvoy_Plant?'$ressource_plant$$ressource_plant$$ressource_plant$$skipline$$ressource_plant$$ressource_plant$':'$ressource_animal$$ressource_animal$$ressource_animal$',
	//Local Heat Trapping
	'89': (button) => button===EffectPortalButtonEnum.localHeatTrapping_Microbe?'$ressource_microbe$$ressource_microbe$':'$ressource_animal$$ressource_animal$',
	//Biomedical Imports
	'D14': (button) => button===EffectPortalButtonEnum.biomedicalImports_Oxygen?'$other_oxygen$':'$other_upgrade$',
	//Cryogentic Shipment
	'D15': (button) => button===EffectPortalButtonEnum.cryogenticShipment_Microbe?'$ressource_microbe$$ressource_microbe$$ressource_microbe$':'$ressource_animal$$ressource_animal$',
	//Cargo Ships
	'F04': (button) => button===EffectPortalButtonEnum.cargoShips_Heat?'$ressource_heat$$ressource_heat$':'$ressource_plant$$ressource_plant$',
	//Pushink haker alliance - Action
	'CF2-Action': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.pushnikAction_Animal):{
				return '$ressource_animal$*'
			}
			case(EffectPortalButtonEnum.pushnikAction_Microbe):{
				return '$ressource_microbe$*'
			}
			case(EffectPortalButtonEnum.pushnikAction_Science):{
				return '$ressource_science$*'
			}
		}
		return ''
	},
	//Pushink haker alliance - Production
	'CF2-Production': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.pushnikProduction_mc):{
				return '$ressource_megacredit$'
			}
			case(EffectPortalButtonEnum.pushnikProduction_heat):{
				return '$ressource_heat$'
			}
			case(EffectPortalButtonEnum.pushnikProduction_plant):{
				return '$ressource_plant$'
			}
		}
		return ''
	},
	//CLM - The hesitant hivemind
	'CF3': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.clm_2):{
				return '-2$ressource_science$:$skipline$$other_sellcard$$ressource_megacreditvoid_5$'
			}
			case(EffectPortalButtonEnum.clm_3):{
				return '-3$ressource_science$:$skipline$$production_+2$$ressource_heat$$production_+1$$ressource_plant$'
			}
			case(EffectPortalButtonEnum.clm_4):{
				return '-4$ressource_science$:$skipline$3$ressource_card$$other_hand$1$ressource_card$'
			}
			case(EffectPortalButtonEnum.clm_5):{
				return '-5$ressource_science$:$skipline$+$tag_wild$!=$tag_science$$tag_earth$$tag_jovian$'
			}
			case(EffectPortalButtonEnum.clm_7):{
				return '-7$ressource_science$:$skipline$$production_+1$$ressource_steel$$production_+1$$ressource_titanium$'
			}
			case(EffectPortalButtonEnum.clm_8):{
				return '-8$ressource_science$:$skipline$$other_tr$$other_tr$'
			}
			case(EffectPortalButtonEnum.clm_12):{
				return '-12$ressource_science$:$skipline$+$tag_earth$$tag_jovian$'
			}
		}
		return ''
	},
	//Secret Labs
	'FM25': (button) => {
		switch(button){
			case(EffectPortalButtonEnum.secretLabs_Ocean):{
				return '$other_ocean$+$ressource_microbe$$ressource_microbe$*'
			}
			case(EffectPortalButtonEnum.secretLabs_Oxygen):{
				return '$other_oxygen$+$ressource_plant$$ressource_plant$$ressource_plant$'
			}
			case(EffectPortalButtonEnum.secretLabs_Temperature):{
				return '$other_temperature$+$ressource_science$$ressource_science$*'
			}
		}
		return ''
	},
}
export const EFFECT_PORTAL_BUTTON_ENUM_LIST: Record<string, ()=> EffectPortalButtonEnum[]> = {
	//Decomposers
	'19': ()=> [EffectPortalButtonEnum.decomposers_Add, EffectPortalButtonEnum.decomposers_Draw],
	//Viral Enhancers
	'61': ()=> [EffectPortalButtonEnum.viralEnhancer_Plant, EffectPortalButtonEnum.viralEnhancer_Microbe, EffectPortalButtonEnum.viralEnhancer_Animal],
	//Imported Hydrogen
	'80': ()=> [EffectPortalButtonEnum.importedHydrogen_Plant, EffectPortalButtonEnum.importedHydrogen_Microbe, EffectPortalButtonEnum.importedHydrogen_Animal],
	//Large Convoy
	'87': ()=> [EffectPortalButtonEnum.largeConvoy_Plant, EffectPortalButtonEnum.largeConvoy_Animal],
	//Local Heat Trapping
	'89': ()=> [EffectPortalButtonEnum.localHeatTrapping_Microbe, EffectPortalButtonEnum.localHeatTrapping_Animal],
	//Biomedical Imports
	'D14': ()=> [EffectPortalButtonEnum.biomedicalImports_Oxygen, EffectPortalButtonEnum.biomedicalImports_Upgrade],
	//Cryogentic Shipment
	'D15': ()=> [EffectPortalButtonEnum.cryogenticShipment_Microbe, EffectPortalButtonEnum.cryogenticShipment_Animal],
	//Cargo Ships
	'F04': ()=> [EffectPortalButtonEnum.cargoShips_Heat, EffectPortalButtonEnum.cargoShips_Plant],
	//Pushnik Action
	'CF2-Action': ()=> [EffectPortalButtonEnum.pushnikAction_Animal, EffectPortalButtonEnum.pushnikAction_Microbe, EffectPortalButtonEnum.pushnikAction_Science],
	//Pushnik Action
	'CF2-Production': ()=> [EffectPortalButtonEnum.pushnikProduction_mc, EffectPortalButtonEnum.pushnikProduction_heat, EffectPortalButtonEnum.pushnikProduction_plant],
	//CLM - The hesitant hive mind
	'CF3': ()=> [EffectPortalButtonEnum.clm_2,EffectPortalButtonEnum.clm_3,EffectPortalButtonEnum.clm_4,EffectPortalButtonEnum.clm_5,EffectPortalButtonEnum.clm_7,EffectPortalButtonEnum.clm_8,EffectPortalButtonEnum.clm_12,],
	//Secret Labs
	'FM25': ()=> [EffectPortalButtonEnum.secretLabs_Ocean, EffectPortalButtonEnum.secretLabs_Oxygen, EffectPortalButtonEnum.secretLabs_Temperature],

}
export const EFFECT_PORTAL_ENUM_TO_EFFECT_CODE: Record<EffectPortalEnum, string> = {
	[EffectPortalEnum.decomposers]: '19',
	[EffectPortalEnum.viralEnhancer]: '61',
	[EffectPortalEnum.importedHydrogen]:'80',
	[EffectPortalEnum.largeConvoy]: '87',
	[EffectPortalEnum.localHeatTrapping]: '89',
	[EffectPortalEnum.biomedicalImports]: 'D14',
	[EffectPortalEnum.cryogenticShipment]: 'D15',
	[EffectPortalEnum.cargoShips]: 'F04',
	[EffectPortalEnum.pushnikAction]: 'CF2-Action',
	[EffectPortalEnum.pushnikProduction]: 'CF2-Production',
	[EffectPortalEnum.clm]: 'CF3',
	[EffectPortalEnum.secretLabs]: 'FM25',
}
export const EFFECT_PORTAL_ENUM_TO_CARD_CODE: Record<EffectPortalEnum, string> = {
	[EffectPortalEnum.decomposers]: '19',
	[EffectPortalEnum.viralEnhancer]: '61',
	[EffectPortalEnum.importedHydrogen]:'80',
	[EffectPortalEnum.largeConvoy]: '87',
	[EffectPortalEnum.localHeatTrapping]: '89',
	[EffectPortalEnum.biomedicalImports]: 'D14',
	[EffectPortalEnum.cryogenticShipment]: 'D15',
	[EffectPortalEnum.cargoShips]: 'F04',
	[EffectPortalEnum.pushnikAction]: 'CF2',
	[EffectPortalEnum.pushnikProduction]: 'CF2',
	[EffectPortalEnum.clm]: 'CF3',
	[EffectPortalEnum.secretLabs]: 'FM25',
}
export const EFFECT_PORTAL_BUTTON_ACTIVATION_REQUIREMENTS: Record<string, (clientState: PlayerStateModel, buttonRule: EffectPortalButtonEnum) => boolean> = {
	'19': (clientState, buttonRule)=> {
		if(buttonRule===EffectPortalButtonEnum.decomposers_Add){return true}
		if(!clientState){return false}
		return Checker.isMinimumStockOnPlayedCardOk({name:'microbe', valueStock:1},'min', clientState, '19')
	},
	'CF3': (clientState, buttonRule) => {
		switch(buttonRule){
			case(EffectPortalButtonEnum.clm_2):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:2},'min',clientState, 'CF3') &&
					Checker.isHandCurrentSizeOk(1, 'min', clientState)
			}
			case(EffectPortalButtonEnum.clm_3):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:3},'min',clientState, 'CF3')
			}
			case(EffectPortalButtonEnum.clm_4):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:4},'min',clientState, 'CF3')
			}
			case(EffectPortalButtonEnum.clm_5):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:5},'min',clientState, 'CF3')
			}
			case(EffectPortalButtonEnum.clm_7):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:7},'min',clientState, 'CF3')
			}
			case(EffectPortalButtonEnum.clm_8):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:8},'min',clientState, 'CF3')
			}
			case(EffectPortalButtonEnum.clm_12):{
				return Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:12},'min',clientState, 'CF3')
			}
		}
		return false
	}
}
