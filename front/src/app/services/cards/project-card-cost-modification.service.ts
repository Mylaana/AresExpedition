import { Injectable } from "@angular/core";
import { CostMod } from "../../types/project-card.type";
import { GlobalTagInfoService } from "../global/global-tag-info.service";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardCostService {
	constructor(private tagInfoService: GlobalTagInfoService){}

	getCostModFromTriggers(mod: CostMod): number {
		if(!mod || !mod.playedTriggersList){return 0}
		let newMod: number = 0
		let tags: number[] = []
		
		if(mod.tagList!=undefined){
			tags = mod.tagList.filter((e, i) => e !== -1); 
		}

		for(let cardId of mod.playedTriggersList){
			switch(cardId){
				//Energy Subsidies
				case(25):{
					if(tags.includes(this.tagInfoService.getTagIdFromType('power'))!=true){break}
					newMod += 4
					console.log('cost mod -4')
					break
				}
			}
		}

		return newMod
	}
}
