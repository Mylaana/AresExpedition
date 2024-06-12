import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { PlayerHandComponent } from './components/project-hand/player-hand/player-hand.component';
import { ServerEmulationComponent } from './components/server-emulation/server-emulation.component';
import { GameEventComponent } from './game-event/game-event.component';
import { PlayerReadyPannelComponent } from './components/player-info/player-ready-pannel/player-ready-pannel.component';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AresExpedition';
}
