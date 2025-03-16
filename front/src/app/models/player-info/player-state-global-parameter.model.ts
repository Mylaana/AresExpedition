import { GlobalParameterNameEnum } from "../../enum/global.enum";
import { GlobalParameterDTO, PlayerGlobalParameterStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GlobalParameter, GlobalParameterValue } from "../../interfaces/global.interface";
import { Utils } from "../../utils/utils";


export class PlayerGlobalParameterStateModel {
private parameters: GlobalParameter[] = [
		{name: GlobalParameterNameEnum.infrastructure,step: 0, addEndOfPhase: 0},
		{name: GlobalParameterNameEnum.ocean,step: 0,addEndOfPhase: 0},
		{name: GlobalParameterNameEnum.oxygen,step: 0,addEndOfPhase: 0},
		{name: GlobalParameterNameEnum.temperature,step: 0,addEndOfPhase: 0}
	]

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
	toJson(): PlayerGlobalParameterStateDTO {
		let parameters: GlobalParameterDTO[] = []
		for(let state of this.parameters){
			parameters.push(this.parameterToJson(state))
		}
		return {
			gp: parameters
		}
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
				gp: []
			}
		)
	}
}

