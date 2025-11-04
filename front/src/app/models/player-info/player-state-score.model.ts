import { MilestonesEnum } from "../../enum/global.enum"
import { GAME_STARTING_TR } from "../../global/global-const"
import { CardScalingVP } from "../../interfaces/card.interface"
import { PlayerScoreStateDTO } from "../../interfaces/dto/player-state-dto.interface"
import { SCALING_VP } from "../../maps/playable-card-scaling-vp-maps"
import { MoonTileType } from "../../types/global.type"
import { PlayerStateModel } from "./player-state.model"

export class PlayerScoreStateModel {
	private vp: number = 0
	private scalingVp: number = 0
	private terraformingRating: number = 0
	private forest: number = 0
	private claimedMilestones: MilestonesEnum[] = []
	private awardsVp: number = 0
	private habitat: number = 0
	private road: number = 0
	private mine: number = 0

	private scaledVpList: CardScalingVP[]= []

	constructor(data: PlayerScoreStateDTO){
		this.vp = data.v
		this.terraformingRating = data.tr
		this.forest = data.f
		this.claimedMilestones = data.cm
		this.awardsVp = data.a
		this.habitat = data.mh
		this.road = data.mr
		this.mine = data.mm
	}

	addMilestoneCompleted(milestone: MilestonesEnum): void {
		if(this.claimedMilestones.includes(milestone)){return}
		this.claimedMilestones.push(milestone)
	}
	getClaimedMilestoneList(): MilestonesEnum[] {
		return this.claimedMilestones
	}
	getClaimedMilestoneCount(): number {return this.claimedMilestones.length}
	setAwardsVp(vp: number){this.awardsVp = vp}
	getAwardsVp(): number {return this.awardsVp}
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
	addHabitat(quantity: number){this.habitat += quantity}
	getHabitat(): number {return this.habitat}
	addRoad(quantity: number){this.road += quantity}
	getRoad(): number {return this.road}
	addMine(quantity: number){this.mine += quantity}
	getMine(): number{return this.mine}
	getMoonTileOfType(tileType: MoonTileType){
		switch(tileType){
			case('habitat'):{return this.getHabitat()}
			case('mine'):{return this.getMine()}
			case('road'):{return this.getRoad()}
		}
	}
	updateCardScalingVPList(clientState: PlayerStateModel) {
		const result: CardScalingVP[] = [];

		for (const card of clientState.getProjectPlayedModelList()) {
			const calculator = SCALING_VP[card.cardCode];
			if (!calculator) continue;

			const vp = calculator(card, clientState);
			result.push({ cardCode: card.cardCode, vp });
		}

		this.scaledVpList = result
	}
	getCardScaledVp(cardCode: string): number {
		let result = this.scaledVpList.filter((code) => code.cardCode===cardCode)
		if(result.length>0){return result[0].vp}
		return 0
	}
	getTotalScalingVP(): number {
		return this.scaledVpList.reduce((sum, entry) => sum + entry.vp, 0);
	}

	toJson(): PlayerScoreStateDTO {
		return {
			cm: this.claimedMilestones,
			v: this.vp,
			tr: this.terraformingRating,
			f: this.forest,
			a: this.awardsVp,
			mh: this.habitat,
			mr: this.road,
			mm: this.mine
		}
	}

	newGame(): void {
		this.terraformingRating = GAME_STARTING_TR
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
				a: 0,
				mh: 0,
				mr: 0,
				mm: 0
			}
		)
	}
}
