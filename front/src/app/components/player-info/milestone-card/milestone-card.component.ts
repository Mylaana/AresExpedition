import { Component, Input } from '@angular/core';
import { MilestonesEnum } from '../../../enum/global.enum';
import { CommonModule } from '@angular/common';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { MilestoneAwardService } from '../../../services/core-game/milestone-award.service';
import { ClaimedMilestoneCard, MilestoneCard } from '../../../interfaces/global.interface';
import { PlayerColor } from '../../../types/global.type';
import { fadeIn } from '../../../animations/animations';

@Component({
  selector: 'app-milestone-card',
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './milestone-card.component.html',
  styleUrl: './milestone-card.component.scss',
  animations: [fadeIn]
})
export class MilestoneCardComponent {
	@Input() milestone!: MilestoneCard
	@Input() claimed!: ClaimedMilestoneCard | undefined

	_hovered: boolean = false

	getCaption(): string {
		return this.milestone.caption
	}
	getIcon(): string {
		return this.milestone.iconCaption
	}
	isProduction(): boolean {
		return this.milestone.isProduction
	}
	isClaimed(): boolean {
		return this.claimed!=undefined && this.claimed.color?.length!=0
	}
	getClaimedColors(): PlayerColor[] {
		return this.claimed?.color??[]
	}
	getHelper(): string{
		return this.milestone.helper
	}
}
