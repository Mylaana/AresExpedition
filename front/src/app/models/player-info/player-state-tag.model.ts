import { TagInfo } from "../../interfaces/global.interface";
import { PlayableCardModel } from "../cards/project-card.model";
import { GAME_TAG_LIST } from "../../global/global-const";
import { PlayerTagStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { TagType } from "../../types/global.type";
import { Utils } from "../../utils/utils";

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

	addTag(tagId:number, quantity: number):void{
		if(tagId===-1){return}
		if(tagId===10){return}
		this.tags[tagId].valueCount += quantity
	}
	addPlayedCardTags(card: PlayableCardModel): void {
		for(let tagId of card.tagsId){
			this.addTag(tagId, 1)
		}
	}
	getTags(): TagInfo[] {return this.tags}
	getTagsOfType(tagType: TagType): number {
		for(let tag of this.tags){
			if(tag.name===tagType){return tag.valueCount}
		}
		return 0
	}
	removeTags(tagsIds: number[]){
		for(let t of tagsIds){
			if([-1,10].includes(t)){continue}
			this.tags[t].valueCount -= 1
		}
	}
	/**counts the number of different tag type possessed */
	getDifferentTagTypeCount(): number {
		let different: number = 0
		for(let i=0; i<10; i++){
			different += this.getTagsOfType(Utils.toTagType(i))>=1?1:0
		}
		return different
	}
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
