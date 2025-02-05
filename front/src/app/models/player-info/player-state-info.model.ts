import { RGB } from "../../types/global.type";

export class PlayerInfoStateModel{
	private id!: number;
	private name!: string;
	private color!: RGB;

	setId(id: number): void {
		this.id = id
	}
	getId(): number {
		return this.id
	}
	setName(name: string): void {
		this.name = name
	}
	getName(): string {
		return this.name
	}
	setColor(color: RGB): void {
		this.color = color
	}
	getColor(): RGB {
		return this.color
	}
}
