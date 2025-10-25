import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { StatService } from '../../../../services/routes/stats.service';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  providers: [StatService]
})
export class StatsComponent implements OnInit{

	constructor(
		private apiService: ApiService,
		private statService: StatService
	){}

	ngOnInit(): void {
		this.apiService.getStats().subscribe({
			next: (data) => (this.statService.initialize(data.body)),
			error: (err) => console.error('Failed to load stats', err)
		})
	}
	getData(name: string): string {
		return this.statService.getData(name)
	}
}
