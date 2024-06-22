import { Component, Input, OnInit } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { PhaseFilter } from '../../../types/phase-card.type';

@Component({
  selector: 'app-project-card-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent],
  templateUrl: './project-card-list.component.html',
  styleUrl: './project-card-list.component.scss'
})
export class ProjectCardListComponent {
  @Input() cardsPhaseFilter!: PhaseFilter;
  @Input() cardList!:ProjectCardModel[];
  projectHand!: ProjectCardModel[];
  displayedCards!: ProjectCardModel[];
  handCardList: number[] = [];

  ngOnInit(){
    this.displayedCards = this.filterCards(this.cardList, this.cardsPhaseFilter)
    console.log(this.cardList)
    console.log(this.displayedCards)
  }

  filterCards(cards:ProjectCardModel[], filter: PhaseFilter): ProjectCardModel[] {
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

