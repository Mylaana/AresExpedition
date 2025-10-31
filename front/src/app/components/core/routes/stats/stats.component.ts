import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { StatService} from '../../../../services/routes/stats.service';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { StatsCardFamily, StatsRanking } from '../../../../types/project-card.type';

@Component({
  selector: 'app-stats',
  imports: [
    CommonModule,
    PlayableCardListComponent,
],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  providers: [StatService]
})
export class StatsComponent implements OnInit{

	constructor(
		private apiService: ApiService,
		private statService: StatService,
	){}

	ngOnInit(): void {
		console.log('init stats')
		this.apiService.getStats().subscribe({
			next: (data) => (this.statService.initialize(data.body)),
			error: (err) => console.error('Failed to load stats', err)
		})
	}
	getRanking(ranking: StatsRanking, type: StatsCardFamily, size?: number): PlayableCardModel[]{
		return this.statService.getRanking(ranking, type, size)
	}
	getData(name: string): string {
		return this.statService.getData(name)
	}
}
