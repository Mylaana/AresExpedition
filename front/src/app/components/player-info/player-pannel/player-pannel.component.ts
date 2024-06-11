import { Component, Input, OnInit} from '@angular/core';
import { RessourcePannelComponent } from '../ressource-pannel/ressource-pannel.component';
import { TagPannelComponent } from '../tag-pannel/tag-pannel.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';

@Component({
  selector: 'app-player-pannel',
  standalone: true,
  imports: [
    RessourcePannelComponent,
    TagPannelComponent,
  ],
  templateUrl: './player-pannel.component.html',
  styleUrl: './player-pannel.component.scss'
})
export class PlayerPannelComponent implements OnInit{
  @Input() playerId!: number;

  playerState!: PlayerStateModel;
  playerName!: string;
  currentPlayersState!: {};
  
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.gameStateService.currentGroupPlayerState.subscribe(
      playersState => this.updatePlayerState()
    )
    this.updatePlayerState()
  }
  updatePlayerState(): void {
    var checkPlayerState = this.gameStateService.getPlayerStateFromId(this.playerId) 
    if(checkPlayerState === undefined){
      return
    }
    //updates this component's player state if changed
    if(checkPlayerState != this.playerState){
      this.playerState = checkPlayerState
      this.playerName = checkPlayerState.name
    }
  }
}
