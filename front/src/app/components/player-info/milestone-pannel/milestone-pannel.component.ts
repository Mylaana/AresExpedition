import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MilestoneCardComponent } from '../milestone-card/milestone-card.component';
import { MilestonesEnum } from '../../../enum/global.enum';
import { ClaimedMilestoneCard, MilestoneCard } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-milestone-pannel',
  imports: [
	CommonModule,
	MilestoneCardComponent
  ],
  templateUrl: './milestone-pannel.component.html',
  styleUrl: './milestone-pannel.component.scss'
})
export class MilestonePannelComponent {
	@Input() milestones!: MilestoneCard[]
	@Input() claimed!: ClaimedMilestoneCard[]
}
