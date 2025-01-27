import { Component, OnInit , AfterViewInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { ProjectCardListComponent } from './components/cards/project/project-card-list/project-card-list.component';
import { GameState } from './services/core-game/game-state.service';
import { ProjectCardModel } from './models/cards/project-card.model';
import { ProjectCardInfoService } from './services/cards/project-card-info.service';
import { NavigationComponent } from './components/core-game/navigation/navigation.component';
import { PlayerPannelComponent } from './components/player-info/player-pannel/player-pannel.component';
import { PlayerStateModel } from './models/player-info/player-state.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SelfInfoComponent,
    ServerEmulationComponent,
    GameEventComponent,
    ProjectCardListComponent,
    NavigationComponent,
    PlayerPannelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'AresExpedition';
  playerHand: ProjectCardModel[] = [];
  playerPlayed: ProjectCardModel[] = [];
  playerIdList: number[] = this.gameStateService.playerCount.getValue()
  clientPlayerId!: number;
  loading: boolean = false
  @ViewChild('hand') handProjectList!: ProjectCardListComponent

  constructor(
    private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService,
  ){}

  ngOnInit(): void {
    this.clientPlayerId = this.gameStateService.clientPlayerId

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

  updateHandOnStateChange(state: PlayerStateModel[]): void {
    let cardState = state[this.clientPlayerId].cards
    this.playerHand = this.cardInfoService.getProjectCardList(cardState.hand)
    this.playerPlayed = cardState.getProjectPlayedList()
    this.handProjectList.updatePlayedCardList(this.playerPlayed)
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
    this.gameStateService.currentGroupPlayerState.subscribe(
      state => this.updateHandOnStateChange(state)
    )
  }
}
