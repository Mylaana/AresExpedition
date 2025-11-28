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
import { GameActiveContentService } from '../../../services/core-game/game-active-content.service';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { CardSelectorService } from '../../../services/core-game/components-services/card-selector.service';
import { Subject, takeUntil } from 'rxjs';

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

	private tagListFromActiveContent!: TagType[]
	private destory$ = new Subject<void>()

	constructor(
		private gameContentService: GameActiveContentService,
		private gameFacadeService: GameStateFacadeService,
		private selectorService: CardSelectorService
	){}
	ngOnInit(): void {
		this.selectorService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destory$)).subscribe(() => this.initialize())
		this.initialize()
	}
	private initialize(){
		let index = 0
		this._buttonsId = []
		this.buttons = []
		this._selected = -1
		
		this.tagListFromActiveContent = this.gameContentService.getTagListFromActiveContent()
		this._authorizedTagList = this.getAuthorizedTagList()
		for(let tag of this._authorizedTagList){
			this.buttons.push(ButtonDesigner.createNonEventButton('tagGain', `$tag_${tag}$`))
			this._buttonsId.push(index)
			index ++
		}
		let e = this.event as EventTagSelector
		let card = this.gameFacadeService.getClientState().getProjectPlayedModelFromId(e.targetCardId)
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
	private getAuthorizedTagList(): TagType[] {
		if(!this.event){return this.tagListFromActiveContent}
		let event = this.event as EventTagSelector
		return event.authorizedTagList
	}
}
