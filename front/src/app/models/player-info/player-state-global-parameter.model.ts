import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../../enum/global.enum";
import { GAME_GLOBAL_PARAMETER_INFRASTRUCTURE_MAX_STEP, GAME_GLOBAL_PARAMETER_OCEAN_MAX_STEP, GAME_GLOBAL_PARAMETER_OXYGEN_MAX_STEP, GAME_GLOBAL_PARAMETER_TEMPERATURE_MAX_STEP } from "../../global/global-const";
import { GlobalParameterDTO, PlayerGlobalParameterStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GlobalParameter, GlobalParameterValue, OceanBonus } from "../../interfaces/global.interface";
import { Utils } from "../../utils/utils";


export class PlayerGlobalParameterStateModel {
	private parameters: GlobalParameter[] = []
	private oceanFlippedBonus: OceanBonus[] = []

	constructor(dto: PlayerGlobalParameterStateDTO){
		let parameters: GlobalParameter[] = []
		for(let dtoParameter of dto.gp){
			let param: GlobalParameter = {
				name: dtoParameter.n,
				step: dtoParameter.s,
				addEndOfPhase: dtoParameter.ae
			}
			parameters.push(Utils.jsonCopy(param))
		}
		this.parameters = parameters
		this.oceanFlippedBonus = dto.ofb
	}

	getGlobalParameters(): GlobalParameter[] {return this.parameters}
	getGlobalParameterIndex(parameter: GlobalParameterNameEnum): number | undefined {
		for(let i=0; i<this.parameters.length; i++){
			if(this.parameters[i].name===parameter){return i}
		}

		return undefined
	}
	addGlobalParameterStepEOP(parameter: GlobalParameterValue): void {
		let parameterIndex = this.getGlobalParameterIndex(parameter.name)
		if(parameterIndex===undefined){return}

		if(this.parameters[parameterIndex].addEndOfPhase===undefined){
			this.parameters[parameterIndex].addEndOfPhase=parameter.steps
			return
		}
		this.parameters[parameterIndex].addEndOfPhase += parameter.steps
	}
	addOceanFlippedBonus(bonus: OceanBonus){
		this.oceanFlippedBonus.push(bonus)
	}
	getOceanFlippedBonus(): OceanBonus[] {
		return this.oceanFlippedBonus
	}
	isGlobalParameterMaxedOutAtPhaseBeginning(parameterName: GlobalParameterNameEnum): boolean {
		for(let param of this.parameters){
			if(param.name===parameterName){
				switch(param.name){
					case(GlobalParameterNameEnum.infrastructure):{
						return param.step>=GAME_GLOBAL_PARAMETER_INFRASTRUCTURE_MAX_STEP
					}
					case(GlobalParameterNameEnum.temperature):{
						return param.step>=GAME_GLOBAL_PARAMETER_TEMPERATURE_MAX_STEP
					}
					case(GlobalParameterNameEnum.oxygen):{
						return param.step>=GAME_GLOBAL_PARAMETER_OXYGEN_MAX_STEP
					}
					case(GlobalParameterNameEnum.ocean):{
						return param.step>=GAME_GLOBAL_PARAMETER_OCEAN_MAX_STEP
					}
				}

			}
		}
		return false
	}
	getGlobalParameterColorAtPhaseBegining(parameterName: GlobalParameterNameEnum): GlobalParameterColorEnum {
		for(let param of this.parameters){
			if(param.name===parameterName){
				return Utils.toGlobalParameterColor(param.name, param.step)
			}
		}
		return GlobalParameterColorEnum.purple
	}
	toJson(): PlayerGlobalParameterStateDTO {
		let parameters: GlobalParameterDTO[] = []
		for(let state of this.parameters){
			parameters.push(this.parameterToJson(state))
		}
		return {
			gp: parameters,
			ofb: this.oceanFlippedBonus
		}
	}
	newGame(): void {
		this.parameters = [
			{name: GlobalParameterNameEnum.infrastructure,step: 0, addEndOfPhase: 0},
			{name: GlobalParameterNameEnum.ocean,step: 0,addEndOfPhase: 0},
			{name: GlobalParameterNameEnum.oxygen,step: 0,addEndOfPhase: 0},
			{name: GlobalParameterNameEnum.temperature,step: 0,addEndOfPhase: 0}
		]
	}
	private parameterToJson(parameter: GlobalParameter): GlobalParameterDTO {
		return {n:parameter.name, s:parameter.step, ae:parameter.addEndOfPhase}
	}
	static fromJson(dto: PlayerGlobalParameterStateDTO): PlayerGlobalParameterStateModel {
		if (!dto.gp){
			throw new Error("Invalid PlayerGlobalParameterStateDTO: Missing required fields")
		}
		return new PlayerGlobalParameterStateModel(dto)
	}
	static empty(): PlayerGlobalParameterStateModel {
		return new PlayerGlobalParameterStateModel(
			{
				gp: [],
				ofb: []
			}
		)
	}
}

