import { Component, Input } from '@angular/core';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';

@Component({
  selector: 'app-global-pannel',
  standalone: true,
  imports: [],
  templateUrl: './global-pannel.component.html',
  styleUrl: './global-pannel.component.scss'
})
export class GlobalPannelComponent{
  @Input() playerId!: number;
  @Input() playerState!: PlayerStateModel
  @Input() playerIsReady!: boolean
}
