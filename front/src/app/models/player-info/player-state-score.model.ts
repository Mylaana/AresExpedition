import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerScoreStateModel {
	private milestoneCount: number = 0
	private vp: number = 0
	private terraformingRating: number = 0

	constructor(data: PlayerScoreStateDTO){
		this.milestoneCount = data.mc
		this.vp = data.v
		this.terraformingRating = data.tr
	}

	addMilestoneCompleted(milestone: number = 1): void {
		this.milestoneCount += milestone
		console.log(this.milestoneCount)
	}
	getMilestoneCompletedNumber(): number {return this.milestoneCount}
	addVP(points: number): void {this.vp += points}
	getVP(): number {return this.vp}
	addTR(tr: number): void {this.terraformingRating += tr}
	getTR(): number {return this.terraformingRating}

	toJson(): PlayerScoreStateDTO {
		return {
			mc: this.milestoneCount,
			v: this.vp,
			tr: this.terraformingRating
		}
	}

	newGame(): void {
		this.addTR(5)
		this.addVP(5)
	}
	static fromJson(data: PlayerScoreStateDTO): PlayerScoreStateModel {
		if (!data.mc || !data.v || !data.tr){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerScoreStateModel(data)
	}
	static empty(): PlayerScoreStateModel {
		return new PlayerScoreStateModel(
			{
				mc: 0,
				tr: 0,
				v:0
			}
		)
	}
}
