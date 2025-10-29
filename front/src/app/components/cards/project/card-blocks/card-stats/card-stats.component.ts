import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-stats',
  imports: [CommonModule],
  templateUrl: './card-stats.component.html',
  styleUrl: './card-stats.component.scss'
})
export class CardStatsComponent {
	@Input() played!: number
	@Input() winrate: number = 0
}
