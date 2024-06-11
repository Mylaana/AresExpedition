import { Component } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';

@Component({
  selector: 'app-phase-production',
  standalone: true,
  imports: [PlayerReadyComponent],
  templateUrl: './phase-production.component.html',
  styleUrl: './phase-production.component.scss'
})
export class PhaseProductionComponent {

}
