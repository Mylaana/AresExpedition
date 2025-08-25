import { Component, Input } from '@angular/core';
import { RGB } from '../../../types/global.type';
import { CommonModule } from '@angular/common';

type PlayerNameStyle = 'default' | 'short'

@Component({
  selector: 'app-player-name',
  imports: [CommonModule],
  templateUrl: './player-name.component.html',
  styleUrl: './player-name.component.scss'
})
export class PlayerNameComponent {
	@Input() name!: string
	@Input() color!: RGB
	@Input() isReady!: boolean
	@Input() style: PlayerNameStyle = 'default'
}
