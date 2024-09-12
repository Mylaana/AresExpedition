import { Injectable } from "@angular/core";
import { CostMod } from "../../types/project-card.type";


@Injectable()
export class CardCost {
	cost!: number
	costInitial!: number
	costMod!: number

	initialize(initialCost: number):void{
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
		if(mod.steelState && mod.tagList?.includes(0)){newMod += mod.steelState.valueProd * mod.steelState.valueMod}
		if(mod.titaniumState && mod.tagList?.includes(1)){newMod += mod.titaniumState.valueProd * mod.titaniumState.valueMod}

		return newMod
	}
}


export class CardState {
	selectable?: boolean = false
	selected?: boolean = false

	upgradable?: boolean = false
	upgraded?: boolean = false

    playable?: boolean = false
	activable?:boolean = false

	ignoreCost?:boolean = false
}
