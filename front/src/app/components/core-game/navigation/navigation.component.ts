import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalParameter } from '../../../interfaces/global.interface';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GlobalInfo } from '../../../services/global/global-info.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{
  globalParameters: GlobalParameter[] = [];
  currentGroupPlayerState!: {};
  currentPhase: string = "planification"; 
  clientPlayerId!: number

  constructor(
    private gameStateService: GameState){}

  ngOnInit(): void {
    this.clientPlayerId = this.gameStateService.clientPlayerId
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.updateState(groupPlayerState)
    )
    this.gameStateService.currentPhase.subscribe(
      phase => this.currentPhase = phase
    )
    return
    let parameter!: GlobalParameter
    for(let i=0; i<4; i++){
      switch(i){
        case(0):{
          parameter = {
            name: 'oxygen',
            value: 0,
            color: 'purple',
            imageUrl: GlobalInfo.getUrlFromName('$other_oxygen$'),
            addEndOfPhase: 0
          }
          break
        }
        case(1):{
          parameter = {
            name: 'temperature',
            value: 0,
            color: 'purple',
            imageUrl: GlobalInfo.getUrlFromName('$other_temperature$'),
            addEndOfPhase: 0
          }
          break
        }
        case(2):{
          parameter = {
            name: 'ocean',
            value: 0,
            imageUrl: GlobalInfo.getUrlFromName('$other_ocean$'),
            addEndOfPhase: 0
          }
          break
        }
        case(3):{
          parameter = {
            name: 'infrastructure',
            value: 0,
            color: 'purple',
            imageUrl: GlobalInfo.getUrlFromName('$other_infrastructure$'),
            addEndOfPhase: 0
          }
          break
        }
      }
      this.globalParameters.push(parameter)
    }


  }
  updateState(state:PlayerStateModel[]): void {
    if(state[this.clientPlayerId]===undefined){return}
    if(this.currentGroupPlayerState===state){return}
    this.globalParameters = state[this.clientPlayerId].globalParameter.parameters
  }
}
