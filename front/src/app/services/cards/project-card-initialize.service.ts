import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";

@Injectable({
	providedIn: 'root'
})
export class ProjectCardInitializeService {
	initialize(card: ProjectCardModel): void {
		switch(card.id){
			//Bacterial Aggregate
			case(222):{
				card.triggerLimit = {limit:5, value:0}
				break
			}
		}
	}
}
