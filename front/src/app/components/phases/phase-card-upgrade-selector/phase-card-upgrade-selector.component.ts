import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';

@Component({
  selector: 'app-phase-card-upgrade-selector',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardUpgradeListComponent
],
  templateUrl: './phase-card-upgrade-selector.component.html',
  styleUrl: './phase-card-upgrade-selector.component.scss'
})
export class PhaseCardUpgradeSelectorComponent {
	@Input() phaseList: number[] = [1, 2, 3, 4, 5]

}
