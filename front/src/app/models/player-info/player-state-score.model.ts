import { MilestonesEnum } from "../../enum/global.enum"
import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"

export class PlayerScoreStateModel {
	private vp: number = 0
	private scalingVp: number = 0
	private terraformingRating: number = 0
	private forest: number = 0
	private claimedMilestones: MilestonesEnum[] = []
	private awardsVp: number = 0

	constructor(data: PlayerScoreStateDTO){
		this.vp = data.v
		this.terraformingRating = data.tr
		this.forest = data.f
		this.claimedMilestones = data.cm
		this.awardsVp = data.a
	}

	addMilestoneCompleted(milestone: MilestonesEnum): void {
		if(this.claimedMilestones.includes(milestone)){return}
		this.claimedMilestones.push(milestone)
	}
	getClaimedMilestoneList(): MilestonesEnum[] {
		return this.claimedMilestones
	}
	getClaimedMilestoneCount(): number {return this.claimedMilestones.length}
	setAwardsVp(vp: number){
		this.awardsVp = vp
	}
	addBaseVP(points: number): void {this.vp += points}
	getBaseVP(): number {return this.vp }
	getTotalVP(): number {
		return this.vp + this.scalingVp + this.terraformingRating + this.forest + this.getClaimedMilestoneCount() * 3 + this.awardsVp
	}
	setScalingVP(scalingVp: number){this.scalingVp = scalingVp}
	addTR(tr: number): void {this.terraformingRating += tr}
	getTR(): number {return this.terraformingRating}
	addForest(forest: number): void {this.forest += forest}
	getForest(): number {return this.forest}

	toJson(): PlayerScoreStateDTO {
		return {
			cm: this.claimedMilestones,
			v: this.vp,
			tr: this.terraformingRating,
			f: this.forest,
			a: this.awardsVp
		}
	}

	newGame(): void {
		this.addTR(5)
	}
	static fromJson(data: PlayerScoreStateDTO): PlayerScoreStateModel {
		if (!data.cm || !data.v || !data.tr || !data.f){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerScoreStateModel(data)
	}
	static empty(): PlayerScoreStateModel {
		return new PlayerScoreStateModel(
			{
				cm: [],
				tr: 0,
				v:0,
				f: 0,
				a: 0
			}
		)
	}
}
