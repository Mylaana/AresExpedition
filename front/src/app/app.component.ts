import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { PlayerHandComponent } from './components/project-hand/player-hand/player-hand.component';
import { ServerEmulationComponent } from './components/server-emulation/server-emulation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SelfInfoComponent,
    PlayerHandComponent,
    ServerEmulationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front';
}
