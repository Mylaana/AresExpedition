import { PlayerInfoStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { myUUID, RGB } from "../../types/global.type";

export class PlayerInfoStateModel{
	private id!: myUUID;
	private name!: string;
	private color!: RGB;

	constructor(data: PlayerInfoStateDTO){
		this.id = data.i
		this.name = data.n
		this.color = data.c
	}

	setId(id: myUUID): void {this.id = id}
	getId(): myUUID {return this.id}
	setName(name: string): void {this.name = name}
	getName(): string {return this.name}
	setColor(color: RGB): void {this.color = color}
	getColor(): RGB {return this.color}

	toJson(): PlayerInfoStateDTO {
		return {
			i: this.id,
			n: this.name,
			c: this.color
		}
	}
	static fromJson(data: PlayerInfoStateDTO): PlayerInfoStateModel {
		if (!data.i || !data.n || !data.c){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerInfoStateModel(data)
	}
	static empty(): PlayerInfoStateModel {
		return new PlayerInfoStateModel(
			{
				i:"0",
				c:"rgb(0, 0, 0)",
				n:"Player 0"
		})
	}
}
