import { Component } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';

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
  projectHand!: ProjectCardModel[];

  constructor(private projectCardInfoService: ProjectCardInfoService){}

  ngOnInit(): void {
    this.projectHand = this.projectCardInfoService.dummyGetCardList();
  }

}
