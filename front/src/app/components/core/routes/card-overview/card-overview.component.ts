import { Component, OnInit } from '@angular/core';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { fadeIn } from '../../../../animations/animations';
import { CommonModule } from '@angular/common';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { CardOverviewTagListFilterComponent } from '../../../card-overview-blocks/card-overview-tag-list-filter/card-overview-tag-list-filter.component';
import { GAME_TAG_LIST } from '../../../../global/global-const';
import { TagType } from '../../../../types/global.type';

@Component({
    selector: 'app-card-overview',
    imports: [
		CommonModule,
		PlayableCardListComponent,
		HexedBackgroundComponent,
		CardOverviewTagListFilterComponent
	],
    templateUrl: './card-overview.component.html',
    styleUrl: './card-overview.component.scss',
    animations: [fadeIn]
})
export class CardOverviewComponent implements OnInit{
	_cardList: PlayableCardModel[] = []
	private allCards: PlayableCardModel[] = []

	_filteredTags = GAME_TAG_LIST

	constructor(private cardInfoService: ProjectCardInfoService){}
	ngOnInit(): void {
		this.allCards = this.cardInfoService.getAllProjectCard()
		this._cardList = this.allCards
	}
	onTagListUpdate(taglist: TagType[]){
		console.log(taglist)
		this.filterCardList(taglist)
	}
	private filterCardList(tagList: TagType[]){
		this._cardList = this.allCards.filter((el) => el.hasTagInList(tagList))
	}
}
