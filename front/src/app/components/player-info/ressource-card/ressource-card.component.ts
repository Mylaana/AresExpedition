import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceState } from '../../../interfaces/global.interface';
import { GlobalRessourceInfoService } from '../../../services/global/global-ressource-info.service';

@Component({
  selector: 'app-ressource-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ressource-card.component.html',
  styleUrl: './ressource-card.component.scss'
})
export class RessourceCardComponent implements OnInit {
  //@Input() ressourceCard!: RessourceCardModel;
  @Input() playerId!: number;
  @Input() ressourceState!: RessourceState;

  imageUrl!: string;

  constructor(private globalRessourceService: GlobalRessourceInfoService){}

  ngOnInit(): void {
    this.imageUrl = this.globalRessourceService.getRessourceUrlFromID(this.ressourceState.imageUrlId)
  }
}
