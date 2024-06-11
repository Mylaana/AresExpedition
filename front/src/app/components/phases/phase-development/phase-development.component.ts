import { Component } from '@angular/core';
import { PlayerHandComponent } from '../../project-hand/player-hand/player-hand.component';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';

@Component({
  selector: 'app-phase-development',
  standalone: true,
  imports: [
    PlayerHandComponent,
    PlayerReadyComponent
  ],
  templateUrl: './phase-development.component.html',
  styleUrl: './phase-development.component.scss'
})
export class PhaseDevelopmentComponent {

}
