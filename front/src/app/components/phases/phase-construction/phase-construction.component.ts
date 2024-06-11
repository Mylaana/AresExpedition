import { Component } from '@angular/core';
import { PlayerHandComponent } from '../../project-hand/player-hand/player-hand.component';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';

@Component({
  selector: 'app-phase-construction',
  standalone: true,
  imports: [
    PlayerHandComponent,
    PlayerReadyComponent],
  templateUrl: './phase-construction.component.html',
  styleUrl: './phase-construction.component.scss'
})
export class PhaseConstructionComponent {

}
