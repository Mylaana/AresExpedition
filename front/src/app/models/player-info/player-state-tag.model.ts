import { TagInfo } from "../../interfaces/global.interface";
import { ProjectCardModel } from "../cards/project-card.model";
import { GAME_TAG_LIST } from "../../global/global-const";
import { PlayerTagStateDTO } from "../../interfaces/dto/player-state-dto.interface";

export class PlayerTagStateModel {
    private tags: TagInfo[] = [] //this.initializeTags()

	constructor(data: PlayerTagStateDTO){
		this.tags = data.t
	}

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
	toJson(): PlayerTagStateDTO {
		return {
			t: this.tags
		}
	}
	newGame(): void {
		this.tags = this.initializeTags()
	}
	static fromJson(data: PlayerTagStateDTO): PlayerTagStateModel {
		if (!data.t){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerTagStateModel(data)
	}
	static empty(): PlayerTagStateModel {
		return new PlayerTagStateModel(
			{
				t: []
			}
		)
	}
}
