import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { GAME_MAXIMUM_PLAYER_NUMBER } from '../../../global/global-const';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-player-number',
    imports: [
        CommonModule,
        NonEventButtonComponent
    ],
    templateUrl: './player-number.component.html',
    styleUrl: './player-number.component.scss'
})
export class PlayerNumberComponent implements OnInit{
	@Output() playerNumberSelected = new EventEmitter<number>()
	_buttonList: NonEventButton[] = []
	ngOnInit(): void {
		for(let i=0; i<GAME_MAXIMUM_PLAYER_NUMBER; i++){
			let button = ButtonDesigner.createNonEventButton('createGamePlayerNumber')
			button.caption = (i+1).toString()
			this._buttonList.push(button)
		}
	}

	onPlayerNumberSelection(button: NonEventButton): void {
		this.playerNumberSelected.emit(+(button.caption??0))
	}
}
