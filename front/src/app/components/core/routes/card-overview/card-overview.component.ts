import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { fadeIn } from '../../../../animations/animations';
import { CommonModule } from '@angular/common';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { CardOverviewTagListFilterComponent } from '../../../card-overview-blocks/card-overview-tag-list-filter/card-overview-tag-list-filter.component';
import { GAME_TAG_LIST } from '../../../../global/global-const';
import { TagType } from '../../../../types/global.type';
import { BalancedCardsListComponent } from '../../../card-overview-blocks/balanced-cards-list/balanced-cards-list.component';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';

@Component({
    selector: 'app-card-overview',
    imports: [
		CommonModule,
		PlayableCardListComponent,
		HexedBackgroundComponent,
		CardOverviewTagListFilterComponent,
		BalancedCardsListComponent,
		NonEventButtonComponent
	],
    templateUrl: './card-overview.component.html',
    styleUrl: './card-overview.component.scss',
    animations: [fadeIn]
})
export class CardOverviewComponent implements OnInit{
	@ViewChild ('tagListFilter') tagListFilter!: CardOverviewTagListFilterComponent
	_cardList: PlayableCardModel[] = []
	private allCards: PlayableCardModel[] = []

	//_filteredTags = GAME_TAG_LIST
	_displayAllCards: boolean = false

	_displayAllButton: NonEventButton = ButtonDesigner.createNonEventButton('cardOverviewDisplayAll')
	_displayBalancedButton: NonEventButton = ButtonDesigner.createNonEventButton('cardOverviewDisplayBalanced')

	constructor(private cardInfoService: ProjectCardInfoService){}
	ngOnInit(): void {
		this.allCards = this.cardInfoService.getAllProjectCard()
		this._cardList = this.allCards
	}
	onTagListUpdate(taglist: TagType[]){
		this.filterCardList(taglist)
	}
	onDisplayButtonClick(button: NonEventButton){
		this.resetFilteredTags()
		switch(button){
			case(this._displayAllButton):{
				this._displayAllCards = true
				return
			}
			case(this._displayBalancedButton):{
				this._displayAllCards = false
				return
			}
		}
	}
	resetFilteredTags(){
		this.tagListFilter.resetActiveTags()
		this._cardList = this.allCards
	}
	private filterCardList(tagList: TagType[]){
		this._cardList = this.allCards.filter((el) => el.hasTagInList(tagList))
	}
}
