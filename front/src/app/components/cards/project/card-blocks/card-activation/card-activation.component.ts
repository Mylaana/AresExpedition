import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../../../tools/button/non-event-button.component';
import { CommonModule } from '@angular/common';
import { ButtonDesigner } from '../../../../../services/designers/button-designer.service';
import { NonEventButton } from '../../../../../models/core-game/button.model';
import { expandCollapseVertical } from '../../../../../animations/animations';

@Component({
  selector: 'app-card-activation',
  standalone: true,
  imports: [
	CommonModule,
	NonEventButtonComponent
],
  templateUrl: './card-activation.component.html',
  styleUrl: './card-activation.component.scss',
  animations: [expandCollapseVertical]
})
export class CardActivationComponent implements OnInit{
	@Input() maximumCardActivation!: boolean
	@Input() buttonIndexEnabled: number = 0
	@Output() activated = new EventEmitter<boolean>()
	_activateOnce!: NonEventButton
	_activateTwice!: NonEventButton

	ngOnInit(): void {
		this._activateOnce = ButtonDesigner.createNonEventButton('activateProjectOnce')
		this._activateTwice = ButtonDesigner.createNonEventButton('activateProjectTwice')
		this.updateButtonStatus()
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['buttonIndexEnabled'] && changes['buttonIndexEnabled'].currentValue) {
			this.updateButtonStatus()
		}
	}
	onActivation(button: NonEventButton): void {
		this.activated.emit(button===this._activateTwice)
	}
	private updateButtonStatus(): void {
		this._activateOnce.updateEnabled(this.buttonIndexEnabled===1)
		this._activateTwice.updateEnabled(this.buttonIndexEnabled===2)
	}
}
