import { MilestonesEnum } from "../../enum/global.enum"
import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerScoreStateModel {
	private milestoneCount: number = 0
	private vp: number = 0
	private scalingVp: number = 0
	private terraformingRating: number = 0
	private forest: number = 0
	private claimedMilestones: MilestonesEnum[] = []

	constructor(data: PlayerScoreStateDTO){
		this.milestoneCount = data.mc
		this.vp = data.v
		this.terraformingRating = data.tr
		this.forest = data.f
	}

	addMilestoneCompleted(milestone: MilestonesEnum): void {
		if(this.claimedMilestones.includes(milestone)){return}
		this.milestoneCount += 1
		this.claimedMilestones.push(milestone)
	}
	getClaimedMilestoneList(): MilestonesEnum[] {
		return this.claimedMilestones
	}
	getMilestoneCompletedNumber(): number {return this.milestoneCount}
	addBaseVP(points: number): void {this.vp += points}
	getBaseVP(): number {return this.vp }
	getTotalVP(): number {
		return this.vp + this.scalingVp + this.terraformingRating + this.forest
	}
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
