import { Component } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';

@Component({
  selector: 'app-phase-action',
  standalone: true,
  imports: [PlayerReadyComponent],
  templateUrl: './phase-action.component.html',
  styleUrl: './phase-action.component.scss'
})
export class PhaseActionComponent {

}
