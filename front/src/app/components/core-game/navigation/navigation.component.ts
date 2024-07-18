import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalParameter } from '../../../interfaces/global.interface';
import { GameState } from '../../../services/core-game/game-state.service';
import { GlobalItemInfoService } from '../../../services/global/global-other-info.service';

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

  constructor(
    private gameStateService: GameState,
    private globalItemInfoService : GlobalItemInfoService){}

  ngOnInit(): void {
    let parameter!: GlobalParameter
    for(let i=0; i<4; i++){
      switch(i){
        case(0):{
          parameter = {
            name: 'oxygen',
            value: 0,
            color: 'purple',
            imageUrl: this.globalItemInfoService.getItemUrlFromTextItemName('$other_oxygen$'),
          }
          break
        }
        case(1):{
          parameter = {
            name: 'temperature',
            value: 0,
            color: 'purple',
            imageUrl: this.globalItemInfoService.getItemUrlFromTextItemName('$other_temperature$')
          }
          break
        }
        case(2):{
          parameter = {
            name: 'ocean',
            value: 0,
            imageUrl: this.globalItemInfoService.getItemUrlFromTextItemName('$other_ocean$')
          }
          break
        }
        case(3):{
          parameter = {
            name: 'infrastructure',
            value: 0,
            color: 'purple',
            imageUrl: this.globalItemInfoService.getItemUrlFromTextItemName('$other_infrastructure$')
          }
          break
        }
      }
      this.globalParameters.push(parameter)
    }

    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.currentGroupPlayerState = groupPlayerState
    )
    this.gameStateService.currentPhase.subscribe(
      phase => this.currentPhase = phase
    )
  }
}
