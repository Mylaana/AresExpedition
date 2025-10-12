import { TagInfo } from "../../interfaces/global.interface";
import { PlayableCardModel } from "../cards/project-card.model";
import { GAME_TAG_LIST } from "../../global/global-const";
import { PlayerTagStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { TagType } from "../../types/global.type";
import { Utils } from "../../utils/utils";
import { Injector } from "@angular/core";

export class PlayerTagStateModel {
    private tags: TagInfo[] = [] //this.initializeTags()

	constructor(
		data: PlayerTagStateDTO,
	){
		this.tags = data.t
	}

	private initializeTags(tagList: TagType[]): TagInfo[]{
		let result: TagInfo[] = []
		for(let t of tagList){
			let tag: TagInfo = {
				id: Utils.toTagId(t),
				name: t,
				valueCount: 0,
			}
			result.push(tag)
		}
		return result
	}

	addTag(tagId:number, quantity: number):void{
		if(tagId===-1){return}
		let type = Utils.toTagType(tagId)
		if(type==='wild'){return}
		for(let info of this.tags){
			if(info.name===type){
				info.valueCount += quantity
				return
			}
		}
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
		let excluded: number[] = [Utils.toTagId('none'), Utils.toTagId('wild')]
		for(let t of tagsIds){
			if(excluded.includes(t)){continue}
			this.tags[t].valueCount -= 1
		}
	}
	/**counts the number of different tag type possessed */
	getDifferentTagTypeCount(): number {
		return this.tags.filter(tag => tag.valueCount>0).length
	}
	toJson(): PlayerTagStateDTO {
		return {
			t: this.tags
		}
	}
	newGame(tagList: TagType[]): void {
		this.tags = this.initializeTags(tagList)
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
