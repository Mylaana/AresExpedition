import { Component, Input, OnInit } from '@angular/core';
import { NonEventButton } from '../../../models/core-game/button.model';
import { GAME_TAG_LIST } from '../../../global/global-const';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { CommonModule } from '@angular/common';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { EventBaseModel, EventTagSelector } from '../../../models/core-game/event.model';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { TagType } from '../../../types/global.type';

@Component({
  selector: 'app-tag-gain-list',
  imports: [
	CommonModule,
	NonEventButtonComponent,
	PlayableCardListComponent,
	HexedBackgroundComponent
  ],
  templateUrl: './tag-gain-list.component.html',
  styleUrl: './tag-gain-list.component.scss'
})
export class TagGainListComponent implements OnInit{
	@Input() event!: EventBaseModel
	private buttons: NonEventButton[] = []
	_buttonsId: number [] = []
	_card!: PlayableCardModel
	_selected:number = -1
	_authorizedTagList!: TagType[]

	constructor(private cardService: ProjectCardInfoService){}
	ngOnInit(): void {
		let index = 0
		this._authorizedTagList = this.getAuthorizedTagList(this.event as EventTagSelector)
		for(let tag of this._authorizedTagList){
			this.buttons.push(ButtonDesigner.createNonEventButton('tagGain', `$tag_${tag}$`))
			this._buttonsId.push(index)
			index ++
		}
		let e = this.event as EventTagSelector
		let card = this.cardService.getCardById(e.targetCardId)
		if(card){
			this._card = card
		}
	}
	onTagSelected(id: number){
		let e = this.event as EventTagSelector
		e.selectedTag = this._authorizedTagList[id]
		if(e.button){
			e.button.setEnabled(true)
		}
		this._selected = id
	}
	getButton(id: number): NonEventButton{
		return this.buttons[id]
	}
	private getAuthorizedTagList(event: EventTagSelector): TagType[] {
		return event.authorizedTagList??GAME_TAG_LIST
	}
}
