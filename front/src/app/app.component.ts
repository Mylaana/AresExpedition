import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { PlayerHandComponent } from './components/project-hand/player-hand/player-hand.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { PlayerReadyPannelComponent } from './components/player-info/player-ready-pannel/player-ready-pannel.component';
import { PlayerSelectedPhasePannelComponent } from './components/player-info/player-selected-phase-pannel/player-selected-phase-pannel.component';
import { ProjectCardListComponent } from './components/project-hand/project-card-list/project-card-list.component';
import { GameState } from './services/core-game/game-state.service';
import { ProjectCardModel } from './models/player-hand/project-card.model';
import { ProjectCardInfoService } from './services/player-hand/project-card-info.service';

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
    PlayerSelectedPhasePannelComponent,
    ProjectCardListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'AresExpedition';
  playerHand!: ProjectCardModel[];
  playerPlayed!: ProjectCardModel[];

  constructor(
    private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService
  ){}

  ngOnInit(): void {
    //this.displayedCards = this.refreshHand(this.projectHand.slice(), this.cardsPhaseFilter);
    this.gameStateService.currentGroupPlayerState.subscribe(
      state => this.updateHandOnStateChange()
    )
  }

  updateHandOnStateChange(): void {
    this.playerHand = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
    this.playerPlayed = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStatePlayed())
  }
}
