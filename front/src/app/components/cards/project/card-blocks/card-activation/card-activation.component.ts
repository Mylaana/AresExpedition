import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../../../tools/button/non-event-button.component';
import { CommonModule } from '@angular/common';
import { ButtonDesigner } from '../../../../../services/designers/button-designer.service';
import { NonEventButton } from '../../../../../models/core-game/button.model';
import { expandCollapseVertical } from '../../../../../animations/animations';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';
import { ProjectCardActivatedEffectService } from '../../../../../services/cards/project-card-activated-effect.service';
import { PlayerStateModel } from '../../../../../models/player-info/player-state.model';
import { GameState } from '../../../../../services/core-game/game-state.service';
import { Subject, takeUntil } from 'rxjs';

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
export class CardActivationComponent implements OnInit, OnDestroy{
	@Input() maximumCardActivation!: boolean
	@Input() projectCard!: PlayableCardModel
	@Output() activated = new EventEmitter<boolean>()
	_activateOnce!: NonEventButton
	_activateTwice!: NonEventButton

	private activationCostPayable: boolean = false
	private clientState!: PlayerStateModel
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this._activateOnce = ButtonDesigner.createNonEventButton('activateProjectOnce')
		this._activateTwice = ButtonDesigner.createNonEventButton('activateProjectTwice')
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		this.updateButtonStatus()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onActivation(button: NonEventButton): void {
		this.projectCard.activated += 1
		this.updateButtonStatus()
		this.activated.emit(button===this._activateTwice)
		this.setActivationPayable()
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.setActivationPayable()
	}
	private setActivationPayable(): void {
		this.activationCostPayable = ProjectCardActivatedEffectService.isActivationCostPayable(this.projectCard, this.clientState)
		this.updateButtonStatus()
	}
	private updateButtonStatus(): void {
		this._activateOnce.updateEnabled(this.projectCard.activated<1 && this.activationCostPayable)
		this._activateTwice.updateEnabled(this.projectCard.activated===1 && this.activationCostPayable)
	}
}
