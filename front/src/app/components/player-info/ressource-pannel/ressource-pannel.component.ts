import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceCardComponent } from '../ressource-card/ressource-card.component';
import { RessourceProdService } from '../../../services/player-info/ressource-info.service';
import { RessourceState } from '../../../interfaces/global.interface';

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
  @Input() playerId!: number;
  @Input() ressourceState!: RessourceState[];


  constructor(private ressourceProdService: RessourceProdService){}

  ngOnInit(): void {

  }
}
