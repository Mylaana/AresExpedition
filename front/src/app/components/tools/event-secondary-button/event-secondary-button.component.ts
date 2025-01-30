import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NonEventButton } from '../../../models/core-game/button.model';

@Component({
	selector: 'app-event-secondary-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './event-secondary-button.component.html',
	styleUrl: './event-secondary-button.component.scss'
})
export class NonEventButtonComponent{
	@Output() nonEventButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()
	@Input() button!: NonEventButton;

	public onClick(): void {
		this.nonEventButtonClicked.emit(this.button)
	}
}
