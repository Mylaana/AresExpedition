import { PlayerGlobalParameterStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GlobalParameter, GlobalParameterValue } from "../../interfaces/global.interface";
import { GlobalParameterName } from "../../types/global.type";

const globalParameterIndex = new Map<GlobalParameterName, number>(
	[
		['infrastructure', 0],
		['ocean', 1],
		['oxygen', 2],
		['temperature', 3],
	]
)

export class PlayerGlobalParameterStateModel {
private parameters: GlobalParameter[] = [
		{name: 'infrastructure',value: 0, addEndOfPhase: 0},
		{name: 'ocean',value: 0,addEndOfPhase: 0},
		{name: 'oxygen',value: 0,addEndOfPhase: 0},
		{name: 'temperature',value: 0,addEndOfPhase: 0}
	]

	constructor(data: PlayerGlobalParameterStateDTO){
		this.parameters = data.parameters
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
			parameters: this.parameters
		}
	}
	static fromJson(data: PlayerGlobalParameterStateDTO): PlayerGlobalParameterStateModel {
		if (!data.parameters){
			throw new Error("Invalid PlayerGlobalParameterStateDTO: Missing required fields")
		}
		return new PlayerGlobalParameterStateModel(data)
	}
	static empty(): PlayerGlobalParameterStateModel {
		return new PlayerGlobalParameterStateModel(
			{
				parameters: []
			}
		)
	}
}

