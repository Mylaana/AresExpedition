import { PlayerOtherStateDTO } from "../../interfaces/dto/player-state-dto.interface"
import { ScanKeep } from "../../interfaces/global.interface"

export class PlayerOtherStateModel {
	sellCardValueMod: number = 0
	research: ScanKeep = {scan:0, keep:0}

	constructor(dto: PlayerOtherStateDTO){
		this.sellCardValueMod = dto.scvm
		this.research = dto.r
	}

	//research
	getResearch(): ScanKeep {return this.research}
	getResearchScan(): number {return this.research.scan}
	getResearchKeep(): number {return this.research.keep}
	setResearch(research: ScanKeep): void {this.research = research }
	addResearchValue(research: Partial<ScanKeep>): void {
		this.research.keep += research.keep??0
		this.research.scan += research.scan??0
	}

	//sellCardValueMod
	getSellCardValueMod(): number {return this.sellCardValueMod}
	addSellCardValueMod(value: number): void {this.sellCardValueMod += value}

	toJson(): PlayerOtherStateDTO {
		return {
			scvm: this.sellCardValueMod,
			r: this.research
		}
	}
	newGame(): void {

	}
	static fromJson(data: PlayerOtherStateDTO): PlayerOtherStateModel {
		if (!data.scvm || !data.r){
			throw new Error("Invalid PlayerOtherStateDTO: Missing required fields")
		}
		return new PlayerOtherStateModel(data)
	}
	static empty(): PlayerOtherStateModel {
		return new PlayerOtherStateModel(
			{
				scvm: 0,
				r: {scan:0, keep:0}
			}
		)
	}
}
