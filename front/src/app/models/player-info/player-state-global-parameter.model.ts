import { PlayerGlobalParameterStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GlobalParameter, GlobalParameterValue } from "../../interfaces/global.interface";
import { GlobalParameterName } from "../../types/global.type";
import { Utils } from "../../utils/utils";


export class PlayerGlobalParameterStateModel {
private parameters: GlobalParameter[] = [
		{name: 'infrastructure',value: 0, addEndOfPhase: 0},
		{name: 'ocean',value: 0,addEndOfPhase: 0},
		{name: 'oxygen',value: 0,addEndOfPhase: 0},
		{name: 'temperature',value: 0,addEndOfPhase: 0}
	]

	constructor(dto: PlayerGlobalParameterStateDTO){
		let parameters: GlobalParameter[] = []
		for(let dtoParameter of dto.gp){
			let param: GlobalParameter = {
				name: dtoParameter.name,
				value: dtoParameter.value??0,
				addEndOfPhase: dtoParameter.addEndOfPhase??0
			}
			parameters.push(Utils.jsonCopy(param))
		}

		this.parameters = parameters
	}

	getGlobalParameters(): GlobalParameter[] {return this.parameters}
	getGlobalParameterIndex(parameter: GlobalParameterName): number | undefined {
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
	toJson(): PlayerGlobalParameterStateDTO {
		return {
			gp: this.parameters
		}
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
				gp: []
			}
		)
	}
}

