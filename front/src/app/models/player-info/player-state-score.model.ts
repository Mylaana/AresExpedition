import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerScoreStateModel {
	private milestoneCount: number = 0
	private vp: number = 0
	private scalingVp: number = 0
	private terraformingRating: number = 0
	private forest: number = 0

	constructor(data: PlayerScoreStateDTO){
		this.milestoneCount = data.mc
		this.vp = data.v
		this.terraformingRating = data.tr
		this.forest = data.f
	}

	addMilestoneCompleted(milestone: number = 1): void {
		this.milestoneCount += milestone
	}
	getMilestoneCompletedNumber(): number {return this.milestoneCount}
	addVP(points: number): void {this.vp += points}
	getVP(): number {return this.vp + this.scalingVp}
	setScalingVP(scalingVp: number){this.scalingVp = scalingVp}
	addTR(tr: number): void {this.terraformingRating += tr}
	getTR(): number {return this.terraformingRating}
	addForest(forest: number): void {this.forest += forest}
	getForest(): number {return this.forest}

	toJson(): PlayerScoreStateDTO {
		return {
			mc: this.milestoneCount,
			v: this.vp,
			tr: this.terraformingRating,
			f: this.forest
		}
	}

	newGame(): void {
		this.addTR(5)
		this.addVP(5)
	}
	static fromJson(data: PlayerScoreStateDTO): PlayerScoreStateModel {
		if (!data.mc || !data.v || !data.tr || !data.f){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerScoreStateModel(data)
	}
	static empty(): PlayerScoreStateModel {
		return new PlayerScoreStateModel(
			{
				mc: 0,
				tr: 0,
				v:0,
				f: 0
			}
		)
	}
}
