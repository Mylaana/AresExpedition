import { Component, Input } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { GameState } from '../../../services/core-game/game-state.service';

type PhaseFilter =  undefined | "development" | "construction"

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
export class PlayerHandComponent {
  @Input() cardsPhaseFilter!: PhaseFilter;
  projectHand!: ProjectCardModel[];
  displayedCards!: ProjectCardModel[];

  constructor(
    private projectCardInfoService: ProjectCardInfoService,
    private gameStateService:GameState
  ){}

  ngOnInit(): void {
    this.projectHand = this.projectCardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand());
    this.displayedCards = this.filterHand(this.projectHand.slice(), this.cardsPhaseFilter);
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
