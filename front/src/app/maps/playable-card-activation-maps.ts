import { DeckQueryOptionsEnum, GlobalParameterNameEnum, DiscardOptionsEnum, ProjectFilterNameEnum, GlobalParameterColorEnum, BuilderOption, EffectPortalEnum, InputRuleEnum } from "../enum/global.enum";
import { SelectablePhaseEnum } from "../enum/phase.enum";
import { RessourceStock } from "../interfaces/global.interface";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { PlayableCard } from "../factory/playable-card.factory";
import { ActivationOption } from "../types/project-card.type";
import { Checker } from "../utils/checker";
import { EventFactory } from "../factory/event/event-factory";
import { GAME_TAG_LIST } from "../global/global-const";
import { Utils } from "../utils/utils";


function getScaling(cardCode: string, clientState: PlayerStateModel){
	return PlayableCard.activable.getScalingCostActivation(cardCode, clientState)
}
export const ACTIVATION_DOUBLE: string[] = [
	'18', //Conserved Biome
	'27', //Extreme-Cold Fungus
	'31', '31B', //GHG Producing Bacteria
	'43', //Nitrite Reducing Bacteria
	'50', '50B', //Regolith Eaters
	'D10', //Fibrous Composite Material
	'P11', //Self Replicating Bacteria
]
export const ACTIVATION_NO_COST: string[] = [
	'3', '4', '12', '13', '15', '16', '18', '57', '58', 'D03',
	'D03B', 'D06', 'D11', 'D12', 'F06', 'P13', 'P20', 'P32', 'FM11', 'FM15',
	'FM26', 'FM27'

]
export const ACTIVATION_EVENTS: Record<string, (cardCode: string, clientState: PlayerStateModel, activationOption: ActivationOption) => EventBaseModel[]> = {
	//Advanced Screening Technology
	'3': () => [EventFactory.simple.scanKeep({ scan: 3, keep: 1 }, DeckQueryOptionsEnum.advancedScreeningTechnology)],
	//AI Central
	'4': () => [EventFactory.simple.draw(2)],
	//Aquifer Pumping
	'7': (cardCode, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Artificial Jungle
	'9': () => [EventFactory.simple.addRessource({ name: 'plant', valueStock: -1 }), EventFactory.simple.draw(1)],
	//Asset Liquidation
	'11': () => [
		EventFactory.simple.addTR(-1),
		EventFactory.simple.draw(3)
	],
	//Birds
	'12': (cardCode) => [EventFactory.simple.addRessourceToCardId({ name: 'animal', valueStock: 1 }, cardCode)],
	//BrainStorming Session
	'13': () => [EventFactory.simple.scanKeep({ scan: 1, keep: 0 }, DeckQueryOptionsEnum.brainstormingSession)],
	//Caretaker Contract
	'14': () => [EventFactory.simple.addRessource({ name: 'heat', valueStock: -8 }), EventFactory.simple.addTR(1)],
	//Circuit Board Factory
	'15': () => [EventFactory.simple.draw(1)],
	//Community Gardens
	'16': (_, clientState) => {
		const ressources: RessourceStock[] = [{ name: 'megacredit', valueStock: 2 }];
		if (clientState.getPhaseSelected() === SelectablePhaseEnum.action) {
		ressources.push({ name: 'plant', valueStock: 1 });
		}
		return [EventFactory.simple.addRessource(ressources)];
	},
	//Conserved Biomes (Activation 1 or 2)
	'18': (_, __, option) => [
		option === 1 ? EventFactory.simple.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 }) :
		option === 2 ? EventFactory.simple.addRessourceToSelectedCard({ name: 'animal', valueStock: 1 }) :
		undefined
	].filter(Boolean) as EventBaseModel[],
	//Decomposing Fungus
	'20': () => [EventFactory.simple.effectPortal(EffectPortalEnum.decomposingFungus, true)],
	//Developed Infrastructure
	'21': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	//Development Center
	'22': () => [
		EventFactory.simple.addRessource({ name: 'heat', valueStock: -2 }),
		EventFactory.simple.draw(1)],
	//Conserved Biomes
	'27': (_, __, option) => [
		option === 1 ? EventFactory.simple.addRessource({ name: 'plant', valueStock: 1 }) :
		option === 2 ? EventFactory.simple.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 }) :
		undefined
	].filter(Boolean) as EventBaseModel[],
	//Farmers Market
	'28': () => [
		EventFactory.simple.addRessource([
		{ name: 'megacredit', valueStock: -1 },
		{ name: 'plant', valueStock: 2 }
		])],
	//Farming Co-ops
	'29': () => [
		EventFactory.simple.discard(1),
		EventFactory.simple.addRessource({ name: 'plant', valueStock: 3 })],
	//Greenhouse
	'32': () => [EventFactory.simple.effectPortal(EffectPortalEnum.greenhouses, true)],
	//GHG Producing Bacteria
	'31': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
			]
		: [],
	//GHG Producing Bacteria B
	'31B': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)
			]
		: [],
	//Hydro-Electric Energy
	'34': (_, clientState) => {
		let value = 2;
		if (clientState.getPhaseSelected() === SelectablePhaseEnum.action) value++;
		return [
		EventFactory.simple.addRessource([
			{ name: 'megacredit', valueStock: -1 },
			{ name: 'heat', valueStock: value }
		])
		];
	},
	//Ironworks
	'38': () => [
		EventFactory.simple.addRessource({ name: 'heat', valueStock: -4 }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Matter Manufacturing
	'41': () => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -1 }),
		EventFactory.simple.draw(1)],
	//Nitrite Reducing Bacteria
	'43': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -3 }, cardCode),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)
			]
		: [],
	//Power Infrastructure
	'47': (cardCode) => [EventFactory.simple.resourceConversion(InputRuleEnum.powerInfrastructure, {originType:'cardCode', originValue:cardCode})],
	//Redrafted Contracts
	'49': () => [EventFactory.simple.discardOptions(3, 'max', DiscardOptionsEnum.redraftedContracts)],
	//Regolith Eaters
	'50': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)
			]
		: [],
	//Regolith Eaters B
	'50B': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -2 }, cardCode),
			EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)
			]
		: [],
	//Solarpunk
	'54': (cardCode, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState) }),
		EventFactory.simple.addForestAndOxygen(1)],
	//Steelworks
	'56': () => [
		EventFactory.simple.addRessource([
		{ name: 'heat', valueStock: -6 },
		{ name: 'megacredit', valueStock: 2 }
		]),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Symbiotic Fungus
	'57': () => [EventFactory.simple.addRessourceToSelectedCard({ name: 'microbe', valueStock: 1 })],
	//Tardigrades
	'58': (cardCode) => [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1 }, cardCode)],
	//Think Tank
	'59': () => [
		EventFactory.simple.draw(1),
		EventFactory.simple.addRessource({name:'megacredit', valueStock:-2})

	],
	//Volcanic Pools
	'62': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Water Import from Europa
	'63': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1)],
	//Wood Burning Stoves
	'64': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'plant', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	//Hyperion Systems
	'D03': (card, clientState) => [
		EventFactory.simple.addRessource({name:'megacredit',valueStock:getScaling(card, clientState)})
	],
	//Hyperion Systems V2
	'D03B': (card, clientState) => [
		EventFactory.simple.addRessource({name:'megacredit', valueStock:1})
	],
	//Drone Assisted Construction
	//Will give 4MC if phase 3 is selected by owner and is then upgraded during phase3 itself
	'D06': (card, clientState) => [
		EventFactory.simple.addRessource({name:'megacredit',valueStock:getScaling(card, clientState)})
	],
	//Experimental Technology
	'D07': () => [
		EventFactory.simple.addTR(-1),
		EventFactory.simple.upgradePhaseCard(1)
	],
	//Fibrous Composite Material
	'D10': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'science', valueStock: 1}, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'science', valueStock: -3}, cardCode),
			EventFactory.simple.upgradePhaseCard(1)
			]
		: [],
	//Software Streamlining
	'D11': () => [
		EventFactory.simple.drawThenDiscard(2,2),
	],
	//Virtual Employee Development
	'D12': () => [EventFactory.simple.upgradePhaseCard(1)],
	//Interplanetary Superhighway
	'F05': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)],
	//Maglev Trains
	'F06': (card, clientState) => [EventFactory.simple.draw(getScaling(card, clientState))],
	//Sawmill
	'F08': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.infrastructure, 1)
	],
	//Matter Generator
	'P06': () => [EventFactory.simple.discardOptions(1, 'max', DiscardOptionsEnum.matterGenerator)],
	//Progressive Policies
	'P09': (card, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(card, clientState) }),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1)],
	//Self Replicating Bacteria
	'P11': (cardCode, _, option) => option === 1
		? [EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: 1}, cardCode)]
		: option === 2
		? [
			EventFactory.simple.addRessourceToCardId({ name: 'microbe', valueStock: -5}, cardCode),
			EventFactory.simple.specialBuilder(BuilderOption.selfReplicatingBacteria)
			]
		: [],
	//Celestior
	'P13': () => [EventFactory.simple.scanKeep({ scan: 3, keep: 1 }, DeckQueryOptionsEnum.celestior)],
	//Community Afforestation
	'P20': (_, clientState) => {return [EventFactory.simple.draw(1 + clientState.getMilestoneCompleted())]},
	//Community Afforestation
	'P21': (cardCode, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState)}),
		EventFactory.simple.addForestAndOxygen(1)],
	//Gas-Cooled Reactors
	'P23': (cardCode, clientState) => [
		EventFactory.simple.addRessource({ name: 'megacredit', valueStock: -getScaling(cardCode, clientState)}),
		EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1)],
	//Research Grant
	'P24': (cardCode, clientState) => {
		let card = clientState.getPlayedProjectWithId(cardCode)
		let tags = card?.tagStock
		if(!tags){
			return [EventFactory.simple.resolveWildTag(cardCode)]
		}
		let authorizedTags = GAME_TAG_LIST
		for(let t of tags){
			authorizedTags = authorizedTags.filter((el) => el!= Utils.toTagType(t))
		}
		return [EventFactory.simple.resolveWildTag(cardCode,authorizedTags)]
	},
	//Modpro
	'P32': () => [
		EventFactory.simple.scanKeep({scan:4, keep:1}, DeckQueryOptionsEnum.modPro)
	],
	//Pride of the earth Arkship
	'FM11': (cardCode, state) => [
		EventFactory.simple.addRessourceToCardId({name:'science', valueStock: getScaling(cardCode, state)}, cardCode)
	],
	//Ants
	'FM15': (cardCode, state) => [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:getScaling(cardCode, state)}, cardCode)],
	//Red Spot Observatory
	'FM26': () => [
		EventFactory.simple.draw(1),
	],
	//Red Spot Observatory
	'FM27': (cardCode, state) => [
		EventFactory.simple.addRessourceToCardId({name:'science', valueStock:getScaling(cardCode, state)}, cardCode),
	],
	//CLM - The Hesitant Hivemind
	'CF3': () => [
		EventFactory.simple.effectPortal(EffectPortalEnum.clm, true)
	],
}
export const ACTIVATION_SCALING_EFFECT: Record<string, (clientstate: PlayerStateModel) => number> = {
	//Aquifer Pumping
	'7': (clientstate) => Math.max(0, 10 - (clientstate.getRessourceInfoFromType('steel')?.valueProd??0) * 2),
	//Developed Infrastructure
	'21': (state) => state.getProjectPlayedModelList({ type: ProjectFilterNameEnum.blueProject }).length >= 5 ? 5 : 10,
	//Solarpunk
	'54': (state) => Math.max(0, 15 - (state.getRessourceInfoFromType('titanium')?.valueProd ?? 0) * 2),
	//Volcanic Pools
	'62': (state) => Math.max(0, 12 - state.getTagsOfType('power')),
	//Water Import from Europa
	'63': (state) => Math.max(0, 12 - (state.getRessourceInfoFromType('titanium')?.valueProd ?? 0)),
	//Wood Burning Stoves
	'64': (state) => Math.max(0, 4 - Number(state.getPhaseSelected() === SelectablePhaseEnum.action)),
	//Hyperion Systems
	'D03': (state) => state.getPhaseSelected()===SelectablePhaseEnum.action?2:1,
	//Drone Assisted Construction
	'D06': (state) => state.isSelectedPhaseUpgraded()?4:2,
	//Interplanetary Superhighway
	'F05': (state) => state.getTagsOfType('science') >= 4 ? 5 : 10,
	//Maglev Trains
	'F06': (state) => Checker.isGlobalParameterOk(GlobalParameterNameEnum.infrastructure, GlobalParameterColorEnum.yellow, 'min', state)?2:1,
	//Sawmill
	'F08': (state) => Math.max(0, 10 - state.getTagsOfType('plant') * 2),
	//Progressive Policies
	'P09': (state) => state.getTagsOfType('event') >= 4 ? 5 : 10,
	//Community Afforestation
	'P21': (state) => 14 - state.getMilestoneCompleted() * 4,
	//Gas-Cooled Reactors
	'P23': (state) => 12 - state.getPhaseCardUpgradedCount() * 2,
	//Pride of the earth Arkship
	'FM11': (state) =>   Math.floor(state.getTagsOfType('science')/4),
	//Ants
	'FM15': (state) =>  Math.floor(state.getTagsOfType('microbe')/2),
	//Jovian Lanterns
	'FM27': (state) =>  Math.floor(state.getTagsOfType('jovian')/3),

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
}
export const ACTIVATION_SCALING_EFFECT_CAPTION: Record<string, (clientState: PlayerStateModel) => string> = {
	//Aquifer Pumping
	'7': (state) => `$ressource_megacreditvoid_${getScaling('7', state)}$: $other_ocean$`,
	//Developed Infrastructure
	'21': (state) => `$ressource_megacreditvoid_${getScaling('21', state)}$: $other_temperature$`,
	//Solarpunk
	'54': (state) => `$ressource_megacreditvoid_${getScaling('54', state)}$: $other_forest$`,
	//Volcanic Pools
	'62': (state) => `$ressource_megacreditvoid_${getScaling('62', state)}$: $other_ocean$`,
	//Water Import from Europa
	'63': (state) => `$ressource_megacreditvoid_${getScaling('63', state)}$: $other_ocean$`,
	//Wood Burning Stoves
	'64': (state) => `$-${getScaling('64', state)}$ressource_plant$: $other_temperature$`,
	//Hyperion Systems
	'D03': (state) => `$ressource_megacreditvoid_${getScaling('D03', state)}$`,
	//Drone Assisted Construction
	'D06': (state) => `$ressource_megacreditvoid_${getScaling('D06', state)}$`,
	//Interplanetary Superhighway
	'F05': (state) => `$ressource_megacreditvoid_${getScaling('F05', state)}$: $other_infrastructure$`,
	//Maglev Train
	'F06': (state) => {
		let caption = ''
		for(let i=0; i<getScaling('F06', state); i++){
			caption += '$ressource_card$'
		}
		return caption
	},
	//Sawmill
	'F08': (state) => `$ressource_megacreditvoid_${getScaling('F08', state)}$: $other_infrastructure$`,
	//Progressive Policies
	'P09': (state) => `$ressource_megacreditvoid_${getScaling('P09', state)}$: $other_oxygen$`,
	//City Council
	'P20': (state) => {
		let caption :string = ''
		for(let i=0; i< (1 + state.getMilestoneCompleted()); i++){
			caption += '$ressource_card$'
		}
		return caption
	},
	//Community Afforestation
	'P21': (state) => `$ressource_megacreditvoid_${getScaling('P21', state)}$: $other_forest$`,
	//Gas-Cooled Reactors
	'P23': (state) => `$ressource_megacreditvoid_${getScaling('P23', state)}$: $other_temperature$`,
	//Pride of the earth Arkship
	'FM11': (state) => {
		let caption :string = ''
		for(let i=0; i< (getScaling('FM11', state)); i++){
			caption += '$ressource_science$'
		}
		return caption
	},
	//Ants
	'FM15': (state) => {
		let caption :string = ''
		for(let i=0; i< (getScaling('FM15', state)); i++){
			caption += '$ressource_microbe$'
		}
		return caption
	},
	//Jovian Lanterns
	'FM27': (state) => {
		let caption :string = ''
		for(let i=0; i< (getScaling('FM27', state)); i++){
			caption += '$ressource_science$'
		}
		return caption
	},

	//SPECIAL
	'convertForest': (state) => `${getScaling('convertForest', state)}$ressource_plant$: $other_forest$`,
	'convertTemperature': (state) => `${getScaling('convertTemperature', state)}$ressource_heat$: $other_temperature$`,
	'convertInfrastructure': (state) => `${getScaling('convertInfrastructureHeat', state)}$ressource_heat$ + ${getScaling('convertInfrastructurePlant', state)}$ressource_plant$:$skipline$$other_infrastructure$ + $ressource_card$`,

	'buyForest': (state) => `$ressource_megacreditvoid_${getScaling('buyForest', state)}$: $other_forest$`,
	'buyInfrastructure': (state) => `$ressource_megacreditvoid_${getScaling('buyInfrastructure', state)}$: $other_infrastructure$ + $ressource_card$`,
	'buyOcean': (state) => `$ressource_megacreditvoid_${getScaling('buyOcean', state)}$: $other_ocean$`,
	'buyTemperature': (state) => `$ressource_megacreditvoid_${getScaling('buyTemperature', state)}$: $other_temperature$`,
	'buyUpgrade': (state) => `$ressource_megacreditvoid_${getScaling('buyUpgrade', state)}$: $other_upgrade$`,
}
export const ACTIVATE_REQUIREMENTS: Record<string, (activationOption: ActivationOption, clientState: PlayerStateModel) => boolean> = {
	//Aquifer Pumping
	'7': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('7', clientState), 'min', clientState),
	//Artificial Jungle
	'9': (_, clientState) => Checker.isRessourceOk('plant', 1, 'min', clientState),
	//Asset Liquidation
	'11': (_, clientState) => Checker.isTrOk(1, 'min', clientState),
	//Caretaker Contract
	'14': (_, clientState) => Checker.isRessourceOk('heat', 8, 'min', clientState),
	//Decomposing Fungus
	'20': (_, clientState) => {
		return Checker.hasCardWithStockQuantityPerType([{name:'microbe', valueStock:1}, {name:'animal', valueStock:1}], clientState)
	},
	//Developed Infrastructure
	'21': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('21', clientState), 'min', clientState),
	//Development Center
	'22': (_, clientState) => Checker.isRessourceOk('heat', 2, 'min', clientState),
	//Extreme-Cold Fungus
	'27': (activationOption, clientState) => activationOption === 1 || clientState.hasProjectPlayedOfFilterType({ type: ProjectFilterNameEnum.stockable, stockableType: 'microbe' }),
	//Farmers Market
	'28': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	//Farming Co-ops
	'29': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	//GHG Producing Bacteria
	'31': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('31').some(s => s.name === 'microbe' && s.valueStock >= 2),
	//GHG Producing Bacteria B
	'31B': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('31B').some(s => s.name === 'microbe' && s.valueStock >= 2),
	//Greenhouses
	'32': (_, clientState) => Checker.isRessourceOk('heat', 1,'min',clientState),
	//Hydro-Electric Energy
	'34': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	//Ironworks
	'38': (_, clientState) => Checker.isRessourceOk('heat', 4, 'min', clientState),
	//Matter Manufacturing
	'41': (_, clientState) => Checker.isRessourceOk('megacredit', 1, 'min', clientState),
	//Nitrite Reducing Bacteria
	'43': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('43').some(s => s.name === 'microbe' && s.valueStock >= 3),
	//Power Infrastructure
	'47': (_, clientState) => Checker.isRessourceOk('heat', 1, 'min', clientState),
	//Redrafted contracts
	'49': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	//Regolith Eaters
	'50': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('50').some(s => s.name === 'microbe' && s.valueStock >= 2),
	//Regolith Eaters B
	'50B': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('50B').some(s => s.name === 'microbe' && s.valueStock >= 2),
	//Solarpunk
	'54': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('54', clientState), 'min', clientState),
	//Steelworks
	'56': (_, clientState) => Checker.isRessourceOk('heat', 6, 'min', clientState),
	//Think Tank
	'59': (_, clientState) => Checker.isRessourceOk('megacredit', 2, 'min', clientState),
	//Volcanic Pools
	'62': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('62', clientState), 'min', clientState),
	//Water Import from Europa
	'63': (_, clientState) =>  Checker.isRessourceOk('megacredit', getScaling('63', clientState), 'min', clientState),
	//Wood Burning Stoves
	'64': (_, clientState) =>  Checker.isRessourceOk('plant', getScaling('64', clientState), 'min', clientState),
	//Experimental Technology
	'D07': (_, clientState) => Checker.isTrOk(1, 'min', clientState),
	//Fibrous Composite Material
	'D10': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('D10').some(s => s.name === 'science' && s.valueStock >= 3),
	//Interplanetary Superhighway
	'F05': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('F05', clientState), 'min', clientState),
	//Sawmill
	'F08': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('F08', clientState), 'min', clientState),
	//Matter Generator
	'P06': (_, clientState) => Checker.isHandCurrentSizeOk(1, 'min', clientState),
	//Progressive Policies
	'P09': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P09', clientState), 'min', clientState),
	//Self Replicating Bacteria
	'P11': (activationOption, clientState) => activationOption === 1 || clientState.getProjectPlayedStock('P11').some(s => s.name === 'microbe' && s.valueStock >= 5),
	//Community Afforestation
	'P21': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P21', clientState), 'min', clientState),
	//Gas-Cooled Reactors
	'P23': (_, clientState) => Checker.isRessourceOk('megacredit', getScaling('P23', clientState), 'min', clientState),
	//Research Grant
	'P24': (_, clientState) => {
		let card = clientState.getPlayedProjectWithId('P24')
		if(!card){return false}
		return !card.tagStock || card.tagStock.length<3
	},
	//CLM - The hesistant hiveming
	'CF3': (_, clientState) => Checker.isMinimumStockOnPlayedCardOk({name:'science', valueStock:0}, 'min', clientState, 'CF3'),
}
