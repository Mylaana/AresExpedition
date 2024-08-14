import { Component, OnInit , AfterViewInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { PlayerReadyPannelComponent } from './components/player-info/player-ready-pannel/player-ready-pannel.component';
import { PlayerSelectedPhasePannelComponent } from './components/player-info/player-selected-phase-pannel/player-selected-phase-pannel.component';
import { ProjectCardListComponent } from './components/cards/project/project-card-list/project-card-list.component';
import { GameState } from './services/core-game/game-state.service';
import { ProjectCardModel } from './models/cards/project-card.model';
import { ProjectCardInfoService } from './services/player-hand/project-card-info.service';
import { NavigationComponent } from './components/core-game/navigation/navigation.component';
import { PlayerPannelComponent } from './components/player-info/player-pannel/player-pannel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SelfInfoComponent,
    ServerEmulationComponent,
    GameEventComponent,
    PlayerReadyPannelComponent,
    PlayerSelectedPhasePannelComponent,
    ProjectCardListComponent,
    NavigationComponent,
    PlayerPannelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'AresExpedition';
  playerHand!: ProjectCardModel[];
  playerPlayed!: ProjectCardModel[];
  playerIdList: number[] = this.gameStateService.playerCount.getValue()
  clientPlayerId!: number;
  loading: boolean = false

  constructor(
    private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService
  ){}

  ngOnInit(): void {
    this.clientPlayerId = this.gameStateService.clientPlayerId
    this.gameStateService.currentGroupPlayerState.subscribe(
      state => this.updateHandOnStateChange()
    )
    this.gameStateService.currentGroupPlayerState.subscribe(
      state => this.updateHandOnStateChange()
    )
    this.gameStateService.currentLoadingState.subscribe(
      loading => this.loadingFinished(loading)
    )
  }

  ngAfterViewInit(): void{
  //sets loading to true after view init
    setTimeout(() => {
      this.gameStateService.loading.next(false);
    }, 0)
  }

  updateHandOnStateChange(): void {
    this.playerHand = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
    this.playerPlayed = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStatePlayed())
  }
  updatePlayerList(playerIdList: number[]){
    this.playerIdList = playerIdList
  }

  loadingFinished(loading: boolean):void{
    if(loading===true){return}

    this.loading = loading
    this.gameStateService.currentPlayerCount.subscribe(
      playerCount => this.updatePlayerList(playerCount)
    )
  }
}
