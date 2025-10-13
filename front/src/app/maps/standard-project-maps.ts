import { GlobalParameterNameEnum } from "../enum/global.enum";
import { EventFactory } from "../factory/event/event-factory";
import { EventBaseModel } from "../models/core-game/event.model";
import { StandardProjectButtonNames } from "../types/global.type";

const S = EventFactory.simple

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
		S.addRessource({name:'megacredit', valueStock: - costMC}),
		S.addProduction({name: 'megacredit', valueStock: 2}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.moon, 1),
		S.addHabitat()
    ],
	'buyRoad': (costMC, costPlant, costHeat) => [
		S.addRessource({name:'megacredit', valueStock: - costMC}),
		S.addTR(1),
		S.increaseGlobalParameter(GlobalParameterNameEnum.moon, 1),
		S.addRoad()
    ],
	'buyMine': (costMC, costPlant, costHeat) => [
		S.addRessource({name:'megacredit', valueStock: - costMC}),
		S.addProduction({name: 'steel', valueStock: 1}),
		S.increaseGlobalParameter(GlobalParameterNameEnum.moon, 1),
		S.addMine()
    ]
}
