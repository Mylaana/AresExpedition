import { GlobalParameterNameEnum, ProjectFilterNameEnum } from "../enum/global.enum"
import { RessourceStock } from "../interfaces/global.interface"
import { PlayerStateModel } from "../models/player-info/player-state.model"

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