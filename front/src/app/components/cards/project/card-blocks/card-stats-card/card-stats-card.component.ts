import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { VpComponent } from '../../../../tools/vp/vp.component';
import { StatService } from '../../../../../services/routes/stats.service';
import { GameTextService } from '../../../../../services/core-game/game-text.service';
import { StatTooltipKey } from '../../../../../types/text.type';
import { fadeIn } from '../../../../../animations/animations';

@Component({
  selector: 'app-card-stats-card',
  imports: [
	CommonModule,
	VpComponent
  ],
  templateUrl: './card-stats-card.component.html',
  styleUrl: './card-stats-card.component.scss',
  animations: [fadeIn]
})
export class CardStatsCardComponent {
	@Input() statType!: 'stat' | 'vp'
	@Input() value!: string | number
	@Input() image!: string
	@Input() unit!: string
	@Input() tooltipKey!: StatTooltipKey

	_hovered:boolean = false

	constructor(private textService: GameTextService){}
	hover(h: boolean){
		this._hovered = h
	}
	getTooltip(): string {
		if(!this.tooltipKey){return ''}
		return this.textService.getStatToolTip(this.tooltipKey)
	}
}
