import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';

@Component({
  selector: 'app-global-pannel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-pannel.component.html',
  styleUrl: './global-pannel.component.scss'
})
export class GlobalPannelComponent{
  @Input() playerId!: number;
  @Input() playerState!: PlayerStateModel
  @Input() playerIsReady!: boolean
  @Input() playerPhase!: PlayerPhase
  @Input() currentPhase!: NonSelectablePhaseEnum
}
