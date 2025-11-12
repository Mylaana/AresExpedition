import { Injectable } from "@angular/core";
import { GAME_RESSOURCE_STEEL_BASE_REDUCTION, GAME_RESSOURCE_TITANIUM_BASE_REDUCTION } from "../../global/global-const";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayableCard } from "../../factory/playable-card.factory";
import { PlayerStateModel } from "../../models/player-info/player-state.model";

@Injectable()
export class ProjectCardCostService {
	private projectCard!: PlayableCardModel
	private clientState!: PlayerStateModel

	private discount: number = 0
	private canBePlayed: boolean = false

	private megacreditsAvailable: number = 0

	initialize(projectCard: PlayableCardModel):void{
		this.projectCard = projectCard
		this.updateCurrentCost()
	}
	onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.megacreditsAvailable = this.clientState.getRessourceInfoFromType('megacredit')?.valueStock??0
		this.updateCurrentCost()
	}
	setBuilderDiscount(discount: number){
		this.discount = discount
		this.updateCurrentCost()
	}
	private updateCurrentCost(){
		if(!this.clientState){
			this.projectCard.cost = this.projectCard.costInitial
			return
		}
		let triggerList = this.clientState.getTriggersIdActive()
		let costMod = PlayableCard.getCostMod(triggerList, this.projectCard, this.clientState)
		let steelAvailable = this.clientState.getRessourceInfoFromType('steel')
		let titaniumAvailable = this.clientState.getRessourceInfoFromType('titanium')

		if(titaniumAvailable && this.projectCard.hasTag('space')){
			costMod += titaniumAvailable.valueBaseProd * (GAME_RESSOURCE_TITANIUM_BASE_REDUCTION + titaniumAvailable.valueMod)
		}
		if(steelAvailable && this.projectCard.hasTag('building')){
			costMod += steelAvailable.valueProd * (GAME_RESSOURCE_STEEL_BASE_REDUCTION + steelAvailable.valueMod)
		}
		this.projectCard.cost = Math.max(this.projectCard.costInitial - costMod - this.discount, 0)
		this.setCanBePlayed()
	}
	getCurrentCost(): number {
		return this.projectCard.cost
	}
	private setCanBePlayed(){
		this.canBePlayed = this.checkCanBePlayed()
		//console.trace(this.canBePlayed, this.megacreditsAvailable)
	}
	private checkCanBePlayed(): boolean {
		if(this.megacreditsAvailable < this.projectCard.cost){return false}
		return PlayableCard.prerequisite.canBePlayed(this.projectCard, this.clientState)
	}
	getCanBePlayed(): boolean {
		return this.canBePlayed
	}
}

