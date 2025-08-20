import { Injectable } from "@angular/core"
import { AwardsEnum, MilestonesEnum, ProjectFilterNameEnum } from "../../enum/global.enum";
import { GameState } from "./game-state.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AwardCard, AwardValue, ClaimedMilestone, ClaimedMilestoneCard, MilestoneCard, MilestoneValue } from "../../interfaces/global.interface";
import { MilestoneState, myUUID, PlayerColor } from "../../types/global.type";
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
	private milestoneState!: Partial<MilestoneState>
	private milestoneList!: MilestonesEnum[]
	private milestoneCards!: MilestoneCard[]
	private claimedMilestones!:ClaimedMilestone[]
	private awardList!: AwardsEnum[]
	private awardCards!: AwardCard[]

    constructor(private gameStateService: GameState){
		if(gameStateService.isDiscoveryEnabled()){
			this.gameStateService.currentGroupPlayerState.subscribe(state => this.onGroupStateUpdate(state))
			this.gameStateService.currentMilestones.subscribe(v => this.onMilestonesUpdate(v))
			this.gameStateService.currentAwards.subscribe(v => this.onAwardsUpdate(v))
			this.gameStateService.currentClientState.subscribe(v => this.onClientStateUpdate(v))
		}
	}
	getMilestoneCards(): MilestoneCard[]{
		return this.milestoneCards
	}
	getAwardsCards(): AwardCard[]{
		return this.awardCards
	}
	private getAwardCaption(award: AwardsEnum): string {
		switch(award){
			case(AwardsEnum.celebrity):{return '$ressource_megacredit$'}
			case(AwardsEnum.collecter):{return '$ressource_wild$$other_omnicard$'}
			case(AwardsEnum.generator):{return '$ressource_heat$'}
			case(AwardsEnum.industrialist):{return '$ressource_steel$$ressource_titanium'}
			case(AwardsEnum.projectManager):{return '$other_omnicard$'}
			case(AwardsEnum.researcher):{return '$tag_science$'}
			case(AwardsEnum.visionary):{return '$other_upgrade$'}
			default:{return ''}
		}
	}
	getMilestoneHelp(milestone: MilestonesEnum): string{
		switch(milestone){
			case(MilestonesEnum.diversifier):{return 'Have 9 or more different tags'}
			case(MilestonesEnum.energizer):case(MilestonesEnum.farmer):
				{return `Have ${this.getMilestoneClaimTreshold(milestone)} or more ${this.getMilestoneIconCaption(milestone)} production`}
			case(MilestonesEnum.legend):case(MilestonesEnum.magnate):case(MilestonesEnum.tycoon):case(MilestonesEnum.planner):
				{return `Have ${this.getMilestoneClaimTreshold(milestone)} or more ${this.getMilestoneIconCaption(milestone)} played cards`}
			default:{return `Have ${this.getMilestoneClaimTreshold(milestone)} or more ${this.getMilestoneIconCaption(milestone)}`}
		}
	}
	getAwardHelp(award: AwardsEnum): string{
		switch(award){
			case(AwardsEnum.celebrity):{return 'Most $ressource_megacredit$ production (w/o TR)'}
			case(AwardsEnum.collecter):{return 'Most resources on cards'}
			case(AwardsEnum.generator):{return 'Most $ressource_heat$ production'}
			case(AwardsEnum.industrialist):{return 'Most $ressource_steel$+$ressource_titanium$ production total'}
			case(AwardsEnum.projectManager):{return 'Most project cards played'}
			case(AwardsEnum.researcher):{return 'Most $tag_science$ played'}
			case(AwardsEnum.visionary):{return 'Most upgraded phase cards.'}
			default:{return ''}
		}
	}
	getClaimedMilestoneStatus(): ClaimedMilestoneCard[]{
		let result: ClaimedMilestoneCard[] = []
		for(let c of this.claimedMilestones){
			result.push({color: Array.from(c.color)})
		}
		return result
	}
	private getMilestoneIconCaption(milestone: MilestonesEnum): string {
		switch(milestone){
			case(MilestonesEnum.builder):{return '$tag_building$'}
			case(MilestonesEnum.diversifier):{return '$tag_omni$'}
			case(MilestonesEnum.energizer):{return '$ressource_heat$'}
			case(MilestonesEnum.farmer):{return '$ressource_plant$'}
			case(MilestonesEnum.gardener):{return '$other_forest$'}
			case(MilestonesEnum.legend):{return '$other_redcard$'}
			case(MilestonesEnum.magnate):{return '$other_greencard$'}
			case(MilestonesEnum.planner):{return '$other_omnicard$'}
			case(MilestonesEnum.spaceBaron):{return '$tag_space$'}
			case(MilestonesEnum.terraformer):{return '$other_tr$'}
			case(MilestonesEnum.tycoon):{return '$other_bluecard$'}
			default:{return ''}
		}
	}
	private isMilestoneProductionBased(milestone: MilestonesEnum): boolean {
		switch(milestone){
			case(MilestonesEnum.energizer):{return true}
			case(MilestonesEnum.farmer):{return true}
			default:{return false}
		}
	}
	private onGroupStateUpdate(state: PlayerStateModel[]){
		this._groupState = state
		this.updateMilestone()
		this.updateAward()
		this.updateGroupClaimedMilestones()
	}
	private updateGroupClaimedMilestones(){
		if(!this._groupState){return}
		if(!this.milestoneList){return}
		for(let s of this._groupState){
			this.addPlayerClaimedMilestoneToSet(s)
		}
	}
	private onMilestonesUpdate(milestones: Partial<MilestoneState>){
		this.milestoneState = milestones
		this.updateMilestoneList()
		if(!this.claimedMilestones){this.initializeClaimedMilestones()}
		this.updateGroupClaimedMilestones()
	}
	private updateMilestoneList(){
		this.milestoneList = []
		for(let v of Object.values(MilestonesEnum)){
			if(v in this.milestoneState){
				this.milestoneList.push(v)
			}
		}
	}
	private initializeClaimedMilestones(){
		if(!this.milestoneList || this.milestoneList.length===0){return}
		this.claimedMilestones = []
		for(let m of this.milestoneList){
			this.claimedMilestones.push({
				name:m,
				player: new Set<myUUID>,
				color: new Set<PlayerColor>
			})
		}
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
			caption: this.getMilestoneClaimTreshold(milestone).toString(),
			iconCaption: this.getMilestoneIconCaption(milestone),
			isProduction: this.isMilestoneProductionBased(milestone),
			helper: this.getMilestoneHelp(milestone),
			value: []
		}
		//generate a temporary array with color,value
		for(let s of this._groupState){
			let activeState: PlayerStateModel = this.getStateOrClientState(s)
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
				return state.getDifferentTagTypeCount()
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
		for(let a of this.awardList){
			this.awardCards.push(this.getAwardCard(a))
		}
	}
	private getAwardCard(award: AwardsEnum): AwardCard {
		let groupTemp: AwardValue[] = []
		let card: AwardCard = {
			caption: this.getAwardCaption(award),
			isProduction: this.isAwardProductionBased(award),
			help: this.getAwardHelp(award),
			value: []
		}
		//generate a temporary array with color,value
		for(let s of this._groupState){
			let activeState: PlayerStateModel = this.getStateOrClientState(s)
			groupTemp.push({
				color: s.getColor() as PlayerColor,
				playersValue: this.getAwardValueFromState(activeState, award)
			})
		}

		groupTemp.sort((a, b) => b.playersValue - a.playersValue);

		//remove second place players in case of first place equality
		let maxValue = groupTemp[0].playersValue
		let firstPlaceGroup = groupTemp.filter((el) => el.playersValue===maxValue)
		if(firstPlaceGroup.length>1){
			groupTemp = firstPlaceGroup
		}

		card.value = groupTemp
		return card
	}
	private isAwardProductionBased(award: AwardsEnum): boolean {
		switch(award){
			case(AwardsEnum.celebrity):{return true}
			case(AwardsEnum.generator):{return true}
			default:{return false}
		}
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
		this.clientState.setAwardsVp(this.getAwardsVp())
		for(let m of this.milestoneList){
			if(this.shouldClaimMilestone(state, m)){
				this.claimMilestone(m)
			}
		}
		this.updateAward()
		this.updateMilestone()
	}
	private shouldClaimMilestone(state: PlayerStateModel, milestone: MilestonesEnum): boolean {
		//only claim milestone if not already claimed
		if(this.milestoneState[milestone]===true){return false}
		return this.getMilestoneValueFromState(state, milestone) >= this.getMilestoneClaimTreshold(milestone)
	}
	private getMilestoneClaimTreshold(milestone: MilestonesEnum): number {
		switch(milestone){
			case(MilestonesEnum.builder):{return 8}
			case(MilestonesEnum.diversifier):{return 9}
			case(MilestonesEnum.energizer):{return 10}
			case(MilestonesEnum.farmer):{return 5}
			case(MilestonesEnum.gardener):{return 3}
			case(MilestonesEnum.legend):{return 6}
			case(MilestonesEnum.magnate):{return 8}
			case(MilestonesEnum.planner):{return 12}
			case(MilestonesEnum.spaceBaron):{return 6}
			case(MilestonesEnum.terraformer):{return 15}
			case(MilestonesEnum.tycoon):{return 6}
			default:{return 0}
		}
	}
	private claimMilestone(milestone: MilestonesEnum){
		if(this.gameStateService.getClientState().getClaimedMilestoneList().includes(milestone)){return}
		this.gameStateService.claimMilestone(milestone)
		this.addPlayerClaimedMilestoneToSet(this.clientState)
	}
	private getStateOrClientState(state: PlayerStateModel): PlayerStateModel {
		if(!this.clientState){return state}
		if(state.getId()!=this.clientState.getId()){return state}
		return this.clientState
	}
	private addPlayerClaimedMilestoneToSet(state: PlayerStateModel) {
		let claimed: MilestonesEnum[] = state.getClaimedMilestoneList()
		for(let i=0; i<this.claimedMilestones.length; i++){
			if(claimed.includes(this.claimedMilestones[i].name)){
				this.claimedMilestones[i].player.add(state.getId())
				this.claimedMilestones[i].color.add(state.getColor() as PlayerColor)
			}
		}
	}
	private getAwardsVp(): number {
		let result = 0
		let clientColor: PlayerColor = this.clientState.getColor() as PlayerColor

		//for each card, set 5vp for first player (4 in case of tie), and 2vp for second player(1 in case of tie)
		for(let a of this.awardCards){
			let firstValue = a.value[0].playersValue
			let firstPoints = a.value.filter((el) => el.playersValue===firstValue).length <= 1? 5:4
			let otherValueGroup = a.value.filter((el) => el.playersValue<firstValue)
			let secondPoints: number
			if(otherValueGroup.length>0){
				let secondValueGroup = a.value.filter((el) => el.playersValue===otherValueGroup[0].playersValue)
				secondPoints = secondValueGroup.length<=1?2:1
			} else {
				secondPoints = 0
			}
			let secondValue: number | undefined
			if(otherValueGroup.length!=0){secondValue = otherValueGroup[0].playersValue}
			for(let player of a.value){
				if(player.color===clientColor){
					result += player.playersValue===firstValue?firstPoints:0
					result += (secondValue!=undefined && player.playersValue===secondValue)?secondPoints:0
				}
			}
		}

		return result
	}
}
