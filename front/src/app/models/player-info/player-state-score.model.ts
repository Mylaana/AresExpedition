export class PlayerScoreStateModel {
	private milestoneCount: number = 0
	private vp: number = 0
	private terraformingRating: number = 0

	addMilestoneCompleted(milestone: number = 1): void {
		this.milestoneCount += milestone
		console.log(this.milestoneCount)
	}
	getMilestoneCompletedNumber(): number {
		return this.milestoneCount
	}
	addVP(points: number): void {
		this.vp += points
	}
	getVP(): number {
		return this.vp
	}
	addTR(tr: number): void {
		this.terraformingRating += tr
	}
	getTR(): number {
		return this.terraformingRating
	}
}
