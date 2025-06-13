import { PlayerEventStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { EventStateDTO } from "../../interfaces/event-state.interface";
import { EventBaseModel } from "../core-game/event.model";

export class PlayerEventStateModel {
	eventQueueState: EventStateDTO[] = []
	constructor(dto: PlayerEventStateDTO){
		this.eventQueueState = dto.e
	}
	static fromJson(data: PlayerEventStateDTO): PlayerEventStateModel {
		if (!data.e){
			throw new Error("Invalid PlayerEventStateDTO: Missing required fields")
		}
		return new PlayerEventStateModel(data)
	}
	toJson(eventState?: EventStateDTO[]): PlayerEventStateDTO {
		if(!eventState){return {e:[]}}
		this.eventQueueState = eventState
		return {e: this.eventQueueState}
	}
	static empty(): PlayerEventStateModel {
		return new PlayerEventStateModel({
			e:[]
		})
	}
}
