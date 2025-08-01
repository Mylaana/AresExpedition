import { Component, Input } from '@angular/core';
import { MilestonesEnum } from '../../../enum/global.enum';
import { CommonModule } from '@angular/common';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { MilestoneAwardService } from '../../../services/core-game/milestone-award.service';
import { MilestoneCard } from '../../../interfaces/global.interface';

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

	constructor(private milestoneAwardService: MilestoneAwardService){}

	getCaption(): string {
		return this.milestone.caption
	}
}
