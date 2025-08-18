import { GlobalParameterNameEnum } from "../../enum/global.enum"
import { SelectablePhaseEnum } from "../../enum/phase.enum"
import { PlayerStatStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerStatStateModel {
	private selectedPhaseRound: Map<number, SelectablePhaseEnum> = new Map()
	private increasedParameter: Map<GlobalParameterNameEnum, number> = new Map(
		[
			[GlobalParameterNameEnum.temperature, 0],
			[GlobalParameterNameEnum.ocean, 0],
			[GlobalParameterNameEnum.oxygen, 0],
			[GlobalParameterNameEnum.infrastructure, 0],
		]
	)

	constructor(dto: PlayerStatStateDTO){
		this.selectedPhaseRound = this.selectedPhaseRoundFromJson(dto.spr)
		this.increasedParameter = PlayerStatStateModel.objectToMap(dto.ip)
	}

	public addSelectedPhaseOnRound(phase: SelectablePhaseEnum, round: number){
		this.selectedPhaseRound.set(round, phase)
	}
	public getSelectedPhaseOnRound(): Map<number, SelectablePhaseEnum> {
		return this.selectedPhaseRound
	}
	public increaseParameter(parameter: GlobalParameterNameEnum, value: number){
		this.increasedParameter.set(parameter, this.increasedParameter.get(parameter)??0 + value)
	}
	public getIncreasedParameters(): Map<GlobalParameterNameEnum, number> {return this.increasedParameter}
	static mapToObject<K extends string | number | symbol, V>(
		map: Map<K, V>
	): Record<K, V> {
		return Object.fromEntries(map) as Record<K, V>;
	}
	static objectToMap<K extends string, V>(
		obj: Record<K, V>
	): Map<K, V> {
		if(!obj){return new Map}
		return new Map(Object.entries(obj) as [K, V][]);
	}

	private selectedPhaseRoundFromJson(obj: { [key: number]: SelectablePhaseEnum }): Map<number, SelectablePhaseEnum> {
		const map = new Map<number, SelectablePhaseEnum>();
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
			map.set(Number(key), obj[key]);
			}
		}
		return map;
	}
	private selectedPhaseRoundToJson(): { [key: number]: SelectablePhaseEnum } {
		const obj: { [key: number]: SelectablePhaseEnum } = {};
		for (const [key, value] of this.selectedPhaseRound.entries()) {
			obj[key] = value;
		}
		return obj;
	}
	private increasedParameterFromJson(dto: Map<GlobalParameterNameEnum, number>): Map<GlobalParameterNameEnum, number> {
		if(!dto || dto.size === 0){
			return new Map<GlobalParameterNameEnum, number>([
				[GlobalParameterNameEnum.temperature,0],
				[GlobalParameterNameEnum.ocean, 0],
				[GlobalParameterNameEnum.oxygen, 0],
				[GlobalParameterNameEnum.infrastructure, 0]
			])
		}
		console.log(dto)
		let result = new Map<GlobalParameterNameEnum, number>([
			[GlobalParameterNameEnum.temperature, dto.get(GlobalParameterNameEnum.temperature)??0],
			[GlobalParameterNameEnum.ocean, dto.get(GlobalParameterNameEnum.ocean)??0],
			[GlobalParameterNameEnum.oxygen, dto.get(GlobalParameterNameEnum.oxygen)??0],
			[GlobalParameterNameEnum.infrastructure, dto.get(GlobalParameterNameEnum.infrastructure)??0],
		])
		return result
	}
	static fromJson(data: PlayerStatStateDTO): PlayerStatStateModel {
		if (!data.spr || !data.ip){
			throw new Error("Invalid PlayerStatStateDTO: Missing required fields")
		}
		return new PlayerStatStateModel(data)
	}
	static empty(): PlayerStatStateModel {
		return new PlayerStatStateModel({
			spr:{},
			ip: this.mapToObject(new Map)
		})
	}
	toJson(): PlayerStatStateDTO {
		return {
			spr: this.selectedPhaseRoundToJson(),
			ip: PlayerStatStateModel.mapToObject(this.increasedParameter)
		}
	}
}
