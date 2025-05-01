import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../../../tools/button/non-event-button.component';
import { CommonModule } from '@angular/common';
import { ButtonDesigner } from '../../../../../services/designers/button-designer.service';
import { NonEventButton } from '../../../../../models/core-game/button.model';
import { expandCollapseVertical } from '../../../../../animations/animations';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';

@Component({
    selector: 'app-card-activation',
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
	@Input() activationCostPayable: boolean = false
	@Input() projectCard!: PlayableCardModel
	@Output() activated = new EventEmitter<boolean>()
	_activateOnce!: NonEventButton
	_activateTwice!: NonEventButton

	ngOnInit(): void {
		this._activateOnce = ButtonDesigner.createNonEventButton('activateProjectOnce')
		this._activateTwice = ButtonDesigner.createNonEventButton('activateProjectTwice')
		this.updateButtonStatus()
	}
	onActivation(button: NonEventButton): void {
		this.projectCard.activated += 1
		this.updateButtonStatus()
		this.activated.emit(button===this._activateTwice)
	}
	private updateButtonStatus(): void {
		this._activateOnce.updateEnabled(this.projectCard.activated<1 && this.activationCostPayable)
		this._activateTwice.updateEnabled(this.projectCard.activated===1 && this.activationCostPayable)
	}
}
