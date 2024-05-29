import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceCardModel } from '../../../models/ressource-card.model';


@Component({
  selector: 'app-ressource-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ressource-card.component.html',
  styleUrl: './ressource-card.component.scss'
})
export class RessourceCardComponent implements OnInit {
  @Input() ressourceCard!: RessourceCardModel;

  ngOnInit(): void {
    if (this.ressourceCard.id <= 3){
      this.ressourceCard.hasStock = true
    } else {
      this.ressourceCard.hasStock = false
    }
      
  }
}
