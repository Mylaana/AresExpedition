import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreatePlayer } from '../../../interfaces/global.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerColorSelectionComponent } from '../player-color-selection/player-color-selection.component';
import { PlayerColor } from '../../../types/global.type';

@Component({
    selector: 'app-player-creation-card',
    imports: [
        CommonModule,
        FormsModule,
        PlayerColorSelectionComponent
    ],
    templateUrl: './player-creation-card.component.html',
    styleUrl: './player-creation-card.component.scss'
})
export class PlayerCreationCardComponent {
	@Input() playerIndex!: number
	@Input() disabled!: boolean
	@Output() playerData = new EventEmitter<CreatePlayer>()

	_playerData: CreatePlayer = {
		index: this.playerIndex,
		name: '',
		color: undefined
	}
	onFieldUpdate() {
		this.validateAndEmit()
	}
	getNamePlaceholder(): string {
		return 'Player ' + (this.playerIndex + 1)
	}
	onColorPicked(color: PlayerColor){
		this._playerData.color = color
		this.validateAndEmit()
	}
	validateAndEmit(): void {
		if(this._playerData.name===''){return}
		if(this._playerData.color===undefined){return}
		this._playerData.index = this.playerIndex
		this.playerData.emit(this._playerData);
	}
}
