import { Component, Input, OnInit } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhaseFilter } from '../../../types/phase-card.type';


@Component({
  selector: 'app-player-hand',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent
  ],
  templateUrl: './player-hand.component.html',
  styleUrl: './player-hand.component.scss'
})
export class PlayerHandComponent implements OnInit{
  @Input() cardsPhaseFilter!: PhaseFilter;
  projectHand!: ProjectCardModel[];
  displayedCards!: ProjectCardModel[];
  handCardList: number[] = [];

  constructor(
    private projectCardInfoService: ProjectCardInfoService,
    private gameStateService:GameState
  ){}

  ngOnInit(): void {
    //this.displayedCards = this.refreshHand(this.projectHand.slice(), this.cardsPhaseFilter);
    this.gameStateService.currentGroupPlayerState.subscribe(
      state => this.updateHandOnStateChange()
    )
  }

  updateHandOnStateChange():void{
    var stateHand = this.gameStateService.getClientPlayerStateHand()
    if(stateHand===this.handCardList){
      return
    }
    this.handCardList = stateHand
    this.projectHand = this.projectCardInfoService.getProjectCardList(this.handCardList);
    this.displayedCards = this.filterHand(this.projectHand, this.cardsPhaseFilter)
  }

  filterHand(cards:ProjectCardModel[], filter: PhaseFilter): ProjectCardModel[] {
    if(filter === undefined){
      return cards
    }

    var result: ProjectCardModel[] = [];
    cards.forEach(element => {
      if((element.cardType === "greenProject" && filter === 'development')
          || (element.cardType != "greenProject" && filter === 'construction')){
        result.push(element)
      }
    });
    return result
  }
}
