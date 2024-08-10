import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';
import { CardOptions } from '../../../interfaces/global.interface';
import { GameState } from '../../../services/core-game/game-state.service';

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
	@Input() phaseList: number[] = [0,1,2,3,4]

	cardOptions: CardOptions = {selectable: false, upgradable: true};

	constructor(private gameStateService: GameState){}

	public cardUpgraded(phaseCard: {phaseIndex: number, phaseCardLevel: number}): void {
		this.cardOptions.selectable = true
		this.cardOptions.upgradable = false
	}
}
