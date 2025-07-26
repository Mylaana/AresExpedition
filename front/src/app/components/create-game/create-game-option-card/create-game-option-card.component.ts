import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonWrapperComponent } from '../../tools/buttons/button-wrapper/button-wrapper.component';
import { AnyButton } from '../../../types/global.type';

@Component({
  selector: 'app-create-game-option-card',
  imports: [
	CommonModule,
	ButtonWrapperComponent
  ],
  templateUrl: './create-game-option-card.component.html',
  styleUrl: './create-game-option-card.component.scss'
})
export class CreateGameOptionCardComponent {
	@Input() button!: AnyButton
	@Input() caption!: string
	@Input() isSubCat!: boolean
	@Output() buttonClick = new EventEmitter<AnyButton>()
	onClick(){
		this.buttonClick.emit(this.button)
	}
}
