import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../../cards/phase-card/phase-card.component';

@Component({
  selector: 'app-phase-card-upgrade-list',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardComponent
],
  templateUrl: './phase-card-upgrade-list.component.html',
  styleUrl: './phase-card-upgrade-list.component.scss'
})
export class PhaseCardUpgradeListComponent {
	@Input() phaseIndex!: number;
}
