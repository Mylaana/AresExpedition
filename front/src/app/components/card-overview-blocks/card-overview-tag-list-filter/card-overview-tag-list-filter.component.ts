import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { GAME_TAG_LIST, GAME_TAG_LIST_WITHNONE } from '../../../global/global-const';
import { NonEventButton } from '../../../models/core-game/button.model';
import { TagType } from '../../../types/global.type';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';

@Component({
  selector: 'app-card-overview-tag-list-filter',
  imports: [
	CommonModule,
	NonEventButtonComponent,
  ],
  templateUrl: './card-overview-tag-list-filter.component.html',
  styleUrl: './card-overview-tag-list-filter.component.scss'
})
export class CardOverviewTagListFilterComponent {
	@Output() tagList = new EventEmitter<TagType[]>()
	private buttons: NonEventButton[] = []
	_tagButtonsId: number [] = []
	_selected:number = -1
	_authorizedTagList!: TagType[]

	_invertTagSelection = ButtonDesigner.createNonEventButton('cardOverviewInvertTagSelection')
	_resetTagSelection = ButtonDesigner.createNonEventButton('cardOverviewResetTagSelection')
	_noneTagButton = ButtonDesigner.createNonEventButton('cardOverviewNoneTag', `$other_none$`)

	private activeTags: TagType [] = []

	ngOnInit(): void {
		let index = 0
		this._authorizedTagList = this.getAuthorizedTagList()
		for(let tag of this._authorizedTagList){
			if(tag==='none'){
				this.buttons.push(this._noneTagButton)
			} else {
				this.buttons.push(ButtonDesigner.createNonEventButton('tagGain', `$tag_${tag}$`))
			}
			this._tagButtonsId.push(index)
			index ++
		}

		this.resetActiveTags()
	}
	resetActiveTags(){
		this.activeTags = []
		for(let t of this._authorizedTagList){
			this.activeTags.push(t)
		}
	}
	onTagSelected(id: number){
		if(this.isActive(id)){
			this.activeTags = this.activeTags.filter((el) => el!=this._authorizedTagList[id])
		} else {
			this.activeTags.push(this._authorizedTagList[id])
		}
		this.tagList.emit(this.activeTags)
	}
	getButton(id: number): NonEventButton{
		return this.buttons[id]
	}
	private getAuthorizedTagList(): TagType[] {
		return GAME_TAG_LIST_WITHNONE
	}
	isActive(buttonId: number): boolean {
		if(this.buttons[buttonId]===this._noneTagButton){

		}
		return this.activeTags.includes(this._authorizedTagList[buttonId])
	}
	onNonTagButtonClick(button :NonEventButton){
		switch(button){
			case(this._resetTagSelection):{
				this.activeTags = this._authorizedTagList
				this.tagList.emit(this.activeTags)
				break
			}
			case(this._invertTagSelection):{
				this.invertTagSelection()
				break
			}
		}
	}
	private invertTagSelection(){
		let newList: TagType[] = []
		for(let t of this._authorizedTagList){
			if(!this.activeTags.includes(t)){
				newList.push(t)
			}
		}
		this.activeTags = newList
		this.tagList.emit(this.activeTags)
	}
}
