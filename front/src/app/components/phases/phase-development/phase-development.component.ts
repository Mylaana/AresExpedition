import { Component, Input, OnInit } from '@angular/core';
import { PlayerHandComponent } from '../../project-hand/player-hand/player-hand.component';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { ProjectCardListComponent } from '../../project-hand/project-card-list/project-card-list.component';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { PhaseFilter } from '../../../types/phase-card.type';

@Component({
  selector: 'app-phase-development',
  standalone: true,
  imports: [
    PlayerHandComponent,
    PlayerReadyComponent,
    ProjectCardListComponent
  ],
  templateUrl: './phase-development.component.html',
  styleUrl: './phase-development.component.scss'
})
export class PhaseDevelopmentComponent implements OnInit{
  @Input() cardList: ProjectCardModel[] = [];
  @Input() cardsPhaseFilter: PhaseFilter;

  ngOnInit(){
    console.log(this.cardList)
  }
}
