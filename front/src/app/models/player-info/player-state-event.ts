import { EventDTO } from "../../interfaces/dto/event-dto.interface";
import { PlayerEventStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { EventBaseModel } from "../core-game/event.model";

export class PlayerEventStateModel {
	eventQueueState: EventDTO[] = []
	constructor(dto: PlayerEventStateDTO){
		this.eventQueueState = dto.e
	}

	static fromJson(data: PlayerEventStateDTO): PlayerEventStateModel {
		if (!data.e){
			throw new Error("Invalid PlayerEventStateDTO: Missing required fields")
		}
		return new PlayerEventStateModel(data)
	}
	toJson(eventQueue?: EventBaseModel[]): PlayerEventStateDTO {
		if(!eventQueue){return {e:[]}}
		let events: EventDTO[] = this.convertEventQueue(eventQueue)
		return {e: events}
	}
	static empty(): PlayerEventStateModel {
		return new PlayerEventStateModel({
			e:[]
		})
	}
	private convertEventQueue(eventQueue: EventBaseModel[]): EventDTO[] {
		let result: EventDTO[] = []
		for(let event of eventQueue){
			let dto = event.toJson()
			if(dto){
				result.push(dto)
			}
		}
		return result
	}
}
