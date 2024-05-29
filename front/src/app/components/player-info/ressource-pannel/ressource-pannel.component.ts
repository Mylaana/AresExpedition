import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceCardComponent } from '../ressource-card/ressource-card.component';
import { RessourceCardModel } from '../../../models/ressource-card.model';
import { RessourceProdService } from '../../../service/ressource-info.service';

@Component({
  selector: 'app-ressource-pannel',
  standalone: true,
  imports: [
    CommonModule,
    RessourceCardComponent
  ],
  templateUrl: './ressource-pannel.component.html',
  styleUrl: './ressource-pannel.component.scss'
})
export class RessourcePannelComponent {
  ressourceCards!: RessourceCardModel[];

  constructor(private ressourceProdService: RessourceProdService){}

  ngOnInit(): void {
    this.ressourceCards = this.ressourceProdService.getRessourceStatus();
  }
}
