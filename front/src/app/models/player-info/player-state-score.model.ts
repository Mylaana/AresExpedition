import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerScoreStateModel {
	private milestoneCount: number = 0
	private vp: number = 0
	private terraformingRating: number = 0

	constructor(data: PlayerScoreStateDTO){
		this.milestoneCount = data.milestoneCount
		this.vp = data.vp
		this.terraformingRating = data.terraformingRating
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
			milestoneCount: this.milestoneCount,
			vp: this.vp,
			terraformingRating: this.terraformingRating
		}
	}
	static fromJson(data: PlayerScoreStateDTO): PlayerScoreStateModel {
		if (!data.milestoneCount || !data.vp || !data.terraformingRating){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerScoreStateModel(data)
	}
	static empty(): PlayerScoreStateModel {
		return new PlayerScoreStateModel(
			{
				milestoneCount: 0,
				terraformingRating: 0,
				vp:0
			}
		)
	}
}
