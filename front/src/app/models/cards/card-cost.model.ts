import { Injectable } from "@angular/core";
import { CostMod } from "../../types/project-card.type";
import { ProjectCardPlayedEffectService } from "../../services/cards/project-card-played-effect.service";
import { GAME_RESSOURCE_STEEL_BASE_REDUCTION, GAME_RESSOURCE_TITANIUM_BASE_REDUCTION } from "../../global/global-const";
import { PlayableCardModel } from "./project-card.model";

@Injectable()
export class CardCost {
	cost!: number
	costInitial!: number
	costMod!: number
	projectCard!: PlayableCardModel

	constructor(private projectCardPlayed: ProjectCardPlayedEffectService){}

	initialize(initialCost: number, projectCard: PlayableCardModel):void{
		this.projectCard = projectCard
		this.costInitial = initialCost
		this.updateCost()
	}
	updateCost(mod?: CostMod): number{
		this.costMod = this.updateCostMod(mod)
		this.cost = Math.max(this.costInitial - this.costMod, 0)
		return this.cost
	}
	updateCostMod(mod?: CostMod): number{
		if(!mod){return 0}
		let newMod: number = 0
		console.log(this.projectCard)
		if(mod.steelState && mod.tagList?.includes(0)){newMod += mod.steelState.valueProd * (mod.steelState.valueMod + GAME_RESSOURCE_STEEL_BASE_REDUCTION)}
		if(mod.titaniumState && mod.tagList?.includes(1)){newMod += mod.titaniumState.valueProd * (mod.titaniumState.valueMod + GAME_RESSOURCE_TITANIUM_BASE_REDUCTION)}
		if(mod.playedTriggersList){newMod += this.projectCardPlayed.getCostModFromTriggers(mod, this.projectCard)}
		if(mod.buildDiscount){newMod += mod.buildDiscount}

		return newMod
	}
}

