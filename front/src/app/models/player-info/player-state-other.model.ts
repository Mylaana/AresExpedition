import { ScanKeep } from "../../interfaces/global.interface"

export class PlayerOtherStateModel {
	sellCardValueMod: number = 0
	research: ScanKeep = {scan:0, keep:0}

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
}
