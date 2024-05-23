import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceCardModel } from '../models/ressource-card.model';
import { RessourceProdService } from '../service/ressource-card.service';

@Component({
  selector: 'app-ressource-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ressource-card.component.html',
  styleUrl: './ressource-card.component.scss'
})
export class RessourceCardComponent implements OnInit {
  @Input() ressourceCard!: RessourceCardModel;

  constructor(private ressourceProdService: RessourceProdService) {}

  hasStock!: boolean;

  ngOnInit(): void {
    this.hasStock = true
  }
}
