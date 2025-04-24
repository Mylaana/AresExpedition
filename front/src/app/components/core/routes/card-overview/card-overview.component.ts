import { Component, OnInit } from '@angular/core';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { fadeIn } from '../../../../animations/animations';

@Component({
    selector: 'app-card-overview',
    imports: [PlayableCardListComponent],
    templateUrl: './card-overview.component.html',
    styleUrl: './card-overview.component.scss',
    animations: [fadeIn]
})
export class CardOverviewComponent implements OnInit{
	_cardList: PlayableCardModel[] = []

	constructor(private cardInfoService: ProjectCardInfoService){}
	ngOnInit(): void {
		this._cardList = this.cardInfoService.getAllProjectCard()
	}
}
