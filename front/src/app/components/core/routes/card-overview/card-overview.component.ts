import { Component, OnInit } from '@angular/core';
import { ProjectCardListComponent } from '../../../cards/project/project-card-list/project-card-list.component';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { fadeIn } from '../../../../animations/animations';

@Component({
  selector: 'app-card-overview',
  standalone: true,
  imports: [ProjectCardListComponent],
  templateUrl: './card-overview.component.html',
  styleUrl: './card-overview.component.scss',
  animations: [fadeIn]
})
export class CardOverviewComponent implements OnInit{
	_cardList: ProjectCardModel[] = []

	constructor(private cardInfoService: ProjectCardInfoService){}
	ngOnInit(): void {
		this._cardList = this.cardInfoService.getAllProjectCard()
	}
}
