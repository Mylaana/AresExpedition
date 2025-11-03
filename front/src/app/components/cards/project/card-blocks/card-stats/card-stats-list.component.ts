import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardStatsCardComponent } from '../card-stats-card/card-stats-card.component';
import { CardStats } from '../../../../../interfaces/card.interface';

@Component({
  selector: 'app-card-stats-list',
  imports: [
	CommonModule,
	CardStatsCardComponent
],
  templateUrl: './card-stats-list.component.html',
  styleUrl: './card-stats-list.component.scss'
})
export class CardStatsListComponent {
	@Input() stats!: CardStats
}
