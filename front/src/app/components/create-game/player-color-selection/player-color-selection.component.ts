import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorButton } from '../../../models/core-game/button.model';
import { PlayerColor } from '../../../types/global.type';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { ButtonComponent } from '../../tools/button/button.component';
import { CommonModule } from '@angular/common';
import { GAME_PLAYER_COLOR_LIST } from '../../../global/global-const';

@Component({
    selector: 'app-player-color-selection',
    imports: [
        CommonModule,
        ButtonComponent
    ],
    templateUrl: './player-color-selection.component.html',
    styleUrl: './player-color-selection.component.scss'
})
export class PlayerColorSelectionComponent implements OnInit{
	@Output() colorPicked = new EventEmitter<PlayerColor>()
	_buttonList: ColorButton[] = []
	ngOnInit(): void {
		for(let color of GAME_PLAYER_COLOR_LIST){
			this._buttonList.push(
				ButtonDesigner.createColorButton(color)
			)
		}
	}

	onButtonClicked(button: ColorButton): void {
		this.colorPicked.emit(button.color)
	}
}
