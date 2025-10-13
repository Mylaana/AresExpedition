import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../../enum/global.enum";
import { GlobalParameterDTO, PlayerGlobalParameterStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GlobalParameter, GlobalParameterValue, OceanBonus } from "../../interfaces/global.interface";
import { GLOBAL_PARAMETER_MAX_STEP } from "../../maps/const-maps";
import { GameModeContent } from "../../types/global.type";
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
		let current = this.parameters.filter(p => p.name===parameterName)[0]
		return current.step >= GLOBAL_PARAMETER_MAX_STEP[parameterName]
	}
	getGlobalParameterColorAtPhaseBegining(parameterName: GlobalParameterNameEnum): GlobalParameterColorEnum {
		for(let param of this.parameters){
			if(param.name===parameterName){
				return Utils.toGlobalParameterColor(param.name, param.step)
			}
		}
		return GlobalParameterColorEnum.purple
	}
	getOceanFlippedNumberAtPhaseBeginning(): number {
		for(let param of this.parameters){
			if(param.name===GlobalParameterNameEnum.ocean){
				return param.step
			}
		}
		return 0
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
	newGame(parameterRelatedContent: GameModeContent[]): void {
		this.parameters = [
			{name: GlobalParameterNameEnum.ocean,step: 0,addEndOfPhase: 0},
			{name: GlobalParameterNameEnum.oxygen,step: 1,addEndOfPhase: 0},
			{name: GlobalParameterNameEnum.temperature,step: 1,addEndOfPhase: 0}
		]
		if(parameterRelatedContent.includes('expansionFoundations')){
			this.parameters.push(
				{name: GlobalParameterNameEnum.infrastructure,step: 1, addEndOfPhase: 0},
			)
		}
		if(parameterRelatedContent.includes('expansionMoon')){
			this.parameters.push(
				{name: GlobalParameterNameEnum.moon,step: 1, addEndOfPhase: 0},
			)
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
				gp: [],
				ofb: []
			}
		)
	}
}

