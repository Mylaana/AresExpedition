import { SelectablePhaseEnum } from "../../enum/phase.enum"
import { PlayerStatStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerStatStateModel {
	private selectedPhaseRound: Map<number, SelectablePhaseEnum> = new Map()
	constructor(dto: PlayerStatStateDTO){
		this.selectedPhaseRound = this.selectedPhaseRoundFromJson(dto.spr)
		console.log(dto.spr, this.selectedPhaseRound)
	}

	public addSelectedPhaseOnRound(phase: SelectablePhaseEnum, round: number){
		this.selectedPhaseRound.set(round, phase)
	}
	public getSelectedPhaseOnRound(): Map<number, SelectablePhaseEnum> {
		return this.selectedPhaseRound
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
		console.log(obj)
		return obj;
	}
	static fromJson(data: PlayerStatStateDTO): PlayerStatStateModel {
		if (!data.spr){
			throw new Error("Invalid PlayerStatStateDTO: Missing required fields")
		}
		return new PlayerStatStateModel(data)
	}
	static empty(): PlayerStatStateModel {
		return new PlayerStatStateModel({
			spr:{}
		})
	}
	toJson(): PlayerStatStateDTO {
		return {
			spr: this.selectedPhaseRoundToJson()
		}
	}
}
