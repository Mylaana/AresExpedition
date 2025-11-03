import { GlobalParameterNameEnum } from "../enum/global.enum";
import { EventFactory } from "../factory/event/event-factory";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { StandardProjectButtonNames } from "../types/global.type";

const S = EventFactory.simple

function getScaling(key: StandardProjectButtonNames, clientState: PlayerStateModel): number {
	return STANDARD_PROJECT_COST[key](clientState)??0
}

export const STANDARD_PROJECT_EVENTS: Record<StandardProjectButtonNames, (costMc: number, costPlant: number, costHeat: number) => EventBaseModel[]> = {
    'buyForest': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - costMC}}),
        EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint: 1})
    ],
    'buyTemperature': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - costMC}}),
        EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.temperature, steps:1}})
    ],
    'buyInfrastructure': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - costMC}}),
        EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.infrastructure, steps:1}}),
        EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}})
    ],
    'buyOcean': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - costMC}}),
        EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.ocean, steps:1}})
    ],
    'buyUpgrade': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - costMC}}),
        EventFactory.simple.upgradePhaseCard(1)
    ],
    'convertForest': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'plant', valueStock: - costPlant}}),
        EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint: 1})
    ],
    'convertTemperature': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'heat', valueStock: -costHeat}}),
        EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.temperature, steps:1}})
    ],
    'convertInfrastructure': (costMC, costPlant, costHeat) => [
        EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: [{name:'heat', valueStock: -costHeat}, {name:'plant', valueStock: -costPlant}]}),
        EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.infrastructure, steps:1}}),
        EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}})
    ],
    'buyHabitat': (costMC, costPlant, costHeat) => [
		S.addHabitat(),
		S.addRessource({name:'megacredit', valueStock: - costMC}),
    ],
	'buyRoad': (costMC, costPlant, costHeat) => [
		S.addRoad(),
		S.addRessource({name:'megacredit', valueStock: - costMC}),
    ],
	'buyMine': (costMC, costPlant, costHeat) => [
		S.addMine(),
		S.addRessource({name:'megacredit', valueStock: - costMC}),
    ],

	'convertInfrastructureHeat': () => [],
	'convertInfrastructurePlant': () => [],
}
export const STANDARD_PROJECT_COST: Record<StandardProjectButtonNames, (clientstate: PlayerStateModel) => number> = {
	//SPECIALS
	//Convert Forest - Ecoline
	'convertForest': (state) => {
		let result: number = 8
		result -= state.getTriggersIdActive().includes('210')? 1:0
		result -= state.getTriggersIdActive().includes('210B')? 2:0
		return result
	},
	'convertTemperature': () => {
		return 8
	},
	'convertInfrastructureHeat': () => {
		return 5
	},
	'convertInfrastructurePlant': () => {
		return 3
	},
	//Buy Forest - Standard Technology
	'buyForest': (state) => {
		let result: number = 20
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		return result
	},
	//Buy Infrastructure - Standard Technology
	'buyInfrastructure': (state) => {
		let result: number = 15
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		return result
	},
	//Buy Ocean - Standard Technology
	'buyOcean': (state) => {
		let result: number = 16
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		return result
	},
	//Buy Temperature - Standard Technology
	'buyTemperature': (state) => {
		let result: number = 14
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		return result
	},
	//Buy Temperature - Standard Technology
	'buyUpgrade': (state) => {
		let result: number = 18
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		return result
	},
	//Buy Temperature - Standard Technology
	'buyHabitat': (state) => {
		let result: number = 16
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		result -= state.getTriggersIdActive().includes('M122')? 3:0
		return result
	},
	//Buy Temperature - Standard Technology
	'buyRoad': (state) => {
		let result: number = 16
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		result -= state.getTriggersIdActive().includes('M122')? 3:0
		return result
	},
	//Buy Temperature - Standard Technology
	'buyMine': (state) => {
		let result: number = 16
		result -= state.getTriggersIdActive().includes('55')? 4:0
		result -= state.getTriggersIdActive().includes('55B')? 2:0
		result -= state.getTriggersIdActive().includes('M122')? 3:0
		return result
	},

	'convertInfrastructure': () => 0
}
export const STANDARD_PROJECT_CAPTION: Record<StandardProjectButtonNames, (clientState: PlayerStateModel) => string> = {
	'convertForest': (state) => `${getScaling('convertForest', state)}$ressource_plant$: $other_forest$`,
	'convertTemperature': (state) => `${getScaling('convertTemperature', state)}$ressource_heat$: $other_temperature$`,
	'convertInfrastructure': (state) => `${getScaling('convertInfrastructureHeat', state)}$ressource_heat$ + ${getScaling('convertInfrastructurePlant', state)}$ressource_plant$:$skipline$$other_infrastructure$ + $ressource_card$`,

	'buyForest': (state) => `$ressource_megacreditvoid_${getScaling('buyForest', state)}$: $other_forest$`,
	'buyInfrastructure': (state) => `$ressource_megacreditvoid_${getScaling('buyInfrastructure', state)}$: $other_infrastructure$ + $ressource_card$`,
	'buyOcean': (state) => `$ressource_megacreditvoid_${getScaling('buyOcean', state)}$: $other_ocean$`,
	'buyTemperature': (state) => `$ressource_megacreditvoid_${getScaling('buyTemperature', state)}$: $other_temperature$`,
	'buyUpgrade': (state) => `$ressource_megacreditvoid_${getScaling('buyUpgrade', state)}$: $other_upgrade$`,

	'buyHabitat': (state) => `$ressource_megacreditvoid_${getScaling('buyHabitat', state)}$: $other_habitattile$`,
	'buyRoad': (state) => `$ressource_megacreditvoid_${getScaling('buyRoad', state)}$: $other_roadtile$`,
	'buyMine': (state) => `$ressource_megacreditvoid_${getScaling('buyMine', state)}$: $other_minetile$`,

	'convertInfrastructureHeat': () => '',
	'convertInfrastructurePlant': () => ''
}
