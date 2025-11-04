import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardStatsCardComponent } from '../card-stats-card/card-stats-card.component';
import { CardStats } from '../../../../../interfaces/card.interface';
import { PlayableCard } from '../../../../../factory/playable-card.factory';

@Component({
	selector: 'app-card-stats-list',
	imports: [
		CommonModule,
		CardStatsCardComponent
	],
	templateUrl: './card-stats-list.component.html',
	styleUrl: './card-stats-list.component.scss'
})
export class CardStatsListComponent{
	@Input() stats!: CardStats
	_production!: string
}
