import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceInfo } from '../../../interfaces/global.interface';
import { GlobalInfo } from '../../../services/global/global-info.service';

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
  @Input() ressource!: RessourceInfo;

  imageUrl!: string;


  ngOnInit(): void {
    this.imageUrl = GlobalInfo.getUrlFromID(this.ressource.imageUrlId)
  }
}
