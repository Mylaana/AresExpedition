import { TagInfo } from "../../interfaces/global.interface";
import { ProjectCardModel } from "../cards/project-card.model";
import { GAME_TAG_LIST } from "../../global/global-const";

export class PlayerTagStateModel {
    private tags: TagInfo[] = this.initializeTags()

	private initializeTags(): TagInfo[]{
		let result: TagInfo[] = []
		for(let i=0; i<=9; i++){
			let tag: TagInfo = {
				id: i,
				name: GAME_TAG_LIST[i],
				idImageUrl: i,
				valueCount: 0,
				valueMod: 0
			}
			result.push(tag)
		}
		return result
	}

	addTag(tagId:number):void{
		if(tagId===-1){return}
		this.tags[tagId].valueCount += 1
	}
	addPlayedCardTags(card: ProjectCardModel): void {
		for(let tagId of card.tagsId){
			this.addTag(tagId)
		}
	}
	getTags(): TagInfo[] {return this.tags}
}
