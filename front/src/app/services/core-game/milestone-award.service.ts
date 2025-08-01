import { Injectable } from "@angular/core"
import { AwardsEnum, MilestonesEnum, ProjectFilterNameEnum } from "../../enum/global.enum";
import { GameState } from "./game-state.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AwardCard, AwardValue, ClaimedMilestone, ClaimedMilestoneCard, MilestoneCard, MilestoneValue } from "../../interfaces/global.interface";
import { myUUID, PlayerColor } from "../../types/global.type";
import { Utils } from "../../utils/utils";

interface PlayerMilestoneTemp {
	color: PlayerColor,
	value: number
}

@Injectable({
  providedIn: 'root'
})
export class MilestoneAwardService {
	_groupState!: PlayerStateModel[]
	private clientState!: PlayerStateModel
	private milestoneList!: MilestonesEnum[]
	private milestoneCards!: MilestoneCard[]
	private claimedMilestones!:ClaimedMilestone[]
	private awardList!: AwardsEnum[]
	private awardCards!: AwardCard[]

    constructor(private gameStateService: GameState){
		this.gameStateService.currentGroupPlayerState.subscribe(state => this.onGroupStateUpdate(state))
		this.gameStateService.currentMilestones.subscribe(v => this.onMilestonesUpdate(v))
		this.gameStateService.currentAwards.subscribe(v => this.onAwardsUpdate(v))
		this.gameStateService.currentClientState.subscribe(v => this.onClientStateUpdate(v))
	}

	getMilestoneCards(): MilestoneCard[]{
		return this.milestoneCards
	}
	getAwardsCards(): AwardCard[]{
		return this.awardCards
	}
	getAwardCaption(award: AwardsEnum): string {
		switch(award){
			case(AwardsEnum.celebrity):{return '+$ressource_megacredit$'}
			case(AwardsEnum.collecter):{return '$ressource_wild$$other_omnicard$'}
			case(AwardsEnum.generator):{return '+$ressource_heat$'}
			case(AwardsEnum.industrialist):{return '$ressource_steel$$ressource_titanium'}
			case(AwardsEnum.projectManager):{return '$other_omnicard$'}
			case(AwardsEnum.researcher):{return '$tag_science$'}
			case(AwardsEnum.visionary):{return '$other_upgrade$'}
			default:{return ''}
		}
	}
	getClaimedMilestoneStatus(): ClaimedMilestoneCard[]{
		let result: ClaimedMilestoneCard[] = []

		return []
	}
	private getMilestoneCaption(milestone: MilestonesEnum): string {
		switch(milestone){
			case(MilestonesEnum.builder):{return '8$tag_building$'}
			case(MilestonesEnum.diversifier):{return '9$tag_wild$'}
			case(MilestonesEnum.energizer):{return '10P$ressource_heat$'}
			case(MilestonesEnum.farmer):{return '5P$ressource_plant$'}
			case(MilestonesEnum.gardener):{return '3$other_forest$'}
			case(MilestonesEnum.legend):{return '6$other_redcard$'}
			case(MilestonesEnum.magnate):{return '8$other_greencard$'}
			case(MilestonesEnum.planner):{return '12$other_omnicard$'}
			case(MilestonesEnum.spaceBaron):{return '6$tag_space$'}
			case(MilestonesEnum.terraformer):{return '15$other_tr$'}
			case(MilestonesEnum.tycoon):{return '6$other_bluecard$'}
			default:{return ''}
		}
	}
	private onGroupStateUpdate(state: PlayerStateModel[]){
		this._groupState = state
		this.updateMilestone()
		this.updateAward()
	}
	private onMilestonesUpdate(milestones: MilestonesEnum[]){
		if(!this.milestoneList || this.milestoneList.length===0){
			this.claimedMilestones = []
			for(let m of milestones){
				this.claimedMilestones.push({
					name:m,
					player: new Set<myUUID>,
					color: new Set<PlayerColor>
				})
			}
			this.milestoneList = milestones
		}
		this.updateMilestone()
	}
	private onAwardsUpdate(awards: AwardsEnum[]){
		this.awardList = awards
		this.updateAward()
	}
	private updateMilestone(){
		if(!this._groupState){return}
		if(!this.milestoneList){return}
		this.milestoneCards = []
		for(let m of this.milestoneList){
			this.milestoneCards.push(this.getMilestoneCard(m))
		}
	}
	private getMilestoneCard(milestone: MilestonesEnum): MilestoneCard {
		let groupTemp: MilestoneValue[] = []
		let card: MilestoneCard = {
			caption: this.getMilestoneCaption(milestone),
			value: []
		}
		//generate a temporary array with color,value
		for(let s of this._groupState){
			let activeState: PlayerStateModel = s.getId()===this.clientState.getId()?this.clientState:s
			groupTemp.push({
				color: s.getColor() as PlayerColor,
				playersValue: this.getMilestoneValueFromState(activeState, milestone)
			})
		}

		groupTemp.sort((a, b) => b.playersValue - a.playersValue);
		card.value = groupTemp
		return card
	}
	private getMilestoneValueFromState(state: PlayerStateModel, milestone: MilestonesEnum): number {
		switch(milestone){
			case(MilestonesEnum.builder):{return state.getTagsOfType('building')}
			case(MilestonesEnum.diversifier):{
				let diversifier: number = 0
				for(let i=0; i<10; i++){
					diversifier += state.getTagsOfType(Utils.toTagType(i))>=1?1:0
				}
				return diversifier
			}
			case(MilestonesEnum.energizer):{return state.getRessourceInfoFromType('heat')?.valueProd??0}
			case(MilestonesEnum.farmer):{return state.getRessourceInfoFromType('plant')?.valueProd??0}
			case(MilestonesEnum.gardener):{return state.getForest()}
			case(MilestonesEnum.legend):{return state.getProjectPlayedModelList({type:ProjectFilterNameEnum.redProject}).length}
			case(MilestonesEnum.magnate):{return state.getProjectPlayedModelList({type:ProjectFilterNameEnum.greenProject}).length}
			case(MilestonesEnum.planner):{return state.getProjectPlayedModelList({type:ProjectFilterNameEnum.notCorporations}).length}
			case(MilestonesEnum.spaceBaron):{return state.getTagsOfType('space')}
			case(MilestonesEnum.terraformer):{return state.getTR()}
			case(MilestonesEnum.tycoon):{return state.getProjectPlayedModelList({type:ProjectFilterNameEnum.blueProject}).length}
			default:{return 0}
		}
	}
	private updateAward(){
		if(!this._groupState){return}
		if(!this.awardList){return}
		this.awardCards = []
		for(let m of this.awardList){
			this.awardCards.push(this.getAwardCard(m))
		}
	}
	private getAwardCard(award: AwardsEnum): AwardCard {
		let groupTemp: AwardValue[] = []
		let card: AwardCard = {
			caption: this.getAwardCaption(award),
			value: []
		}
		//generate a temporary array with color,value
		for(let s of this._groupState){
			let activeState: PlayerStateModel = s.getId()===this.clientState.getId()?this.clientState:s
			groupTemp.push({
				color: s.getColor() as PlayerColor,
				playersValue: this.getAwardValueFromState(activeState, award)
			})
		}

		groupTemp.sort((a, b) => b.playersValue - a.playersValue);
		card.value = groupTemp
		return card
	}
	private getAwardValueFromState(state: PlayerStateModel, award: AwardsEnum): number {
		switch(award){
			case(AwardsEnum.celebrity):{return state.getRessourceInfoFromType('megacredit')?.valueProd??0}
			case(AwardsEnum.collecter):{
				let collecter: number = 0
				for(let c of state.getPlayedListWithStockableTypes(['animal','microbe','science'])){
					for(let s of c.stock??[]){
						collecter += s.valueStock
					}
				}
				return collecter
			}
			case(AwardsEnum.generator):{return state.getRessourceInfoFromType('heat')?.valueProd??0}
			case(AwardsEnum.industrialist):{
				return (state.getRessourceInfoFromType('steel')?.valueProd??0) + (state.getRessourceInfoFromType('titanium')?.valueProd??0)
			}
			case(AwardsEnum.projectManager):{return state.getProjectPlayedModelList({type:ProjectFilterNameEnum.notCorporations}).length}
			case(AwardsEnum.researcher):{return state.getTagsOfType('science')}
			case(AwardsEnum.visionary):{return state.getPhaseCardUpgradedCount()}
			default:{return 0}
		}
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		if(this.milestoneList.length===0){return}

		for(let m of this.milestoneList){
			if(this.shouldClaimMilestone(state, m)){
				console.log('claim it FFS !', m)
				this.claimMilestone(state, m)
			}
		}
		console.log(this.claimedMilestones)
		this.updateAward()
		this.updateMilestone()
	}
	private shouldClaimMilestone(state: PlayerStateModel, milestone: MilestonesEnum): boolean {
		return true
	}
	private claimMilestone(state: PlayerStateModel, milestone: MilestonesEnum){
		for(let claimed of this.claimedMilestones){
			if(claimed.name===milestone){
				claimed.player.add(state.getId())
				claimed.color.add(state.getColor() as PlayerColor)
			}
		}
	}
}
