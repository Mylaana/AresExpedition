import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { PlayerHandComponent } from './components/project-hand/player-hand/player-hand.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { PlayerReadyPannelComponent } from './components/player-info/player-ready-pannel/player-ready-pannel.component';
import { PlayerSelectedPhasePannelComponent } from './components/player-info/player-selected-phase-pannel/player-selected-phase-pannel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SelfInfoComponent,
    PlayerHandComponent,
    ServerEmulationComponent,
    GameEventComponent,
    PlayerReadyPannelComponent,
    PlayerSelectedPhasePannelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AresExpedition';
}
