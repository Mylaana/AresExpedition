import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { StatService} from '../../../../services/routes/stats.service';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { CardType, StatsRanking } from '../../../../types/project-card.type';
import { FilterPannelWrapperComponent } from '../../../tools/filter-pannel/filter-wrapper/filter-pannel-wrapper.component';
import { NonEventButtonNames } from '../../../../types/global.type';

@Component({
  selector: 'app-stats',
  imports: [
    CommonModule,
    PlayableCardListComponent,
	FilterPannelWrapperComponent
],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  providers: [StatService]
})
export class StatsComponent implements OnInit{

	_currentFilter: CardType = 'corporation'
	constructor(
		private apiService: ApiService,
		private statService: StatService,
	){}

	ngOnInit(): void {
		this.apiService.getStats().subscribe({
			next: (data) => (this.statService.initialize(data.body)),
			error: (err) => console.error('Failed to load stats', err)
		})
	}
	getRanking(): PlayableCardModel[]{
		return this.statService.getRanking(this._currentFilter)
	}
	getData(name: string): string {
		return this.statService.getData(name)
	}
	onButtonClicked(name: NonEventButtonNames){
		switch(name){
			case('corporation'):case('blueProject'):case('project'):case('greenProject'):case('redProject'):{
				this._currentFilter = name
			}
		}
	}
}
