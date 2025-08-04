import { Component, Input } from '@angular/core';
import { MilestonesEnum } from '../../../enum/global.enum';
import { CommonModule } from '@angular/common';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { MilestoneAwardService } from '../../../services/core-game/milestone-award.service';
import { ClaimedMilestoneCard, MilestoneCard } from '../../../interfaces/global.interface';
import { PlayerColor } from '../../../types/global.type';

@Component({
  selector: 'app-milestone-card',
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './milestone-card.component.html',
  styleUrl: './milestone-card.component.scss'
})
export class MilestoneCardComponent {
	@Input() milestone!: MilestoneCard
	@Input() claimed!: ClaimedMilestoneCard | undefined

	getCaption(): string {
		return this.milestone.caption
	}
	isClaimed(): boolean {
		return this.claimed!=undefined && this.claimed.color?.length!=0
	}
	getClaimedColors(): PlayerColor[] {
		return this.claimed?.color??[]
	}
}
