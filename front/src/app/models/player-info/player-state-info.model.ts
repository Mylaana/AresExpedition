import { PlayerInfoStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { RGB } from "../../types/global.type";

export class PlayerInfoStateModel{
	private id!: number;
	private name!: string;
	private color!: RGB;

	constructor(data: PlayerInfoStateDTO){
		this.id = data.id
		this.name = data.name
		this.color = data.color
	}

	setId(id: number): void {this.id = id}
	getId(): number {return this.id}
	setName(name: string): void {this.name = name}
	getName(): string {return this.name}
	setColor(color: RGB): void {this.color = color}
	getColor(): RGB {return this.color}

	toJson(): PlayerInfoStateDTO {
		return {
			id: this.id,
			name: this.name,
			color: this.color
		}
	}
	static fromJson(data: PlayerInfoStateDTO): PlayerInfoStateModel {
		if (!data.id || !data.name || !data.color){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerInfoStateModel(data)
	}
	static empty(): PlayerInfoStateModel {
		return new PlayerInfoStateModel(
			{
				id:0,
				color: "rgb(0, 0, 0)",
				name:"Player 0"
		})
	}
}
