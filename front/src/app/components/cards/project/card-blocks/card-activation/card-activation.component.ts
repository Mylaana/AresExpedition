import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../../../tools/button/non-event-button.component';
import { CommonModule } from '@angular/common';
import { ButtonDesigner } from '../../../../../factory/button-designer.service';
import { NonEventButton } from '../../../../../models/core-game/button.model';
import { expandCollapseVertical } from '../../../../../animations/animations';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';
import { PlayerStateModel } from '../../../../../models/player-info/player-state.model';
import { GameState } from '../../../../../services/core-game/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivationOption } from '../../../../../types/project-card.type';
import { PlayableCard } from '../../../../../factory/playable-card.factory';
import { SettingCardSize } from '../../../../../types/global.type';

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
	//@Input() maximumCardActivation!: boolean
	@Input() projectCard!: PlayableCardModel
	@Input() actionIndex: ActivationOption = 1
	@Input() caption!: string
	@Input() optionTotalQuantity: number = 1
	@Input() isScalingCostActivation!: boolean
	@Input() cardSize!: SettingCardSize
	@Output() activated = new EventEmitter<{option: ActivationOption, twice: boolean}>()
	_activateOnce!: NonEventButton
	_activateTwice!: NonEventButton

	private activationCostPayable: boolean = false
	private clientState!: PlayerStateModel
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this._activateOnce = ButtonDesigner.createNonEventButton('activateProjectOnce', this.caption)
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
		this.activated.emit({option: this.actionIndex, twice: button===this._activateTwice})
		this.setActivationPayable()
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.setActivationPayable()
		this.updateCaption()
	}
	private updateCaption(){
		if(!this.isScalingCostActivation){return}
		this.caption = PlayableCard.activable.getScalingCostActivationCaption(this.projectCard.cardCode, this.clientState)
		this._activateOnce.caption = this.caption
	}
	private setActivationPayable(): void {
		this.activationCostPayable = PlayableCard.prerequisite.canBeActivated(this.projectCard, this.clientState, this.actionIndex)
		this.updateButtonStatus()
	}
	private updateButtonStatus(): void {
		this._activateOnce.setEnabled(this.projectCard.activated<1 && this.activationCostPayable)
		this._activateTwice.setEnabled(this.projectCard.activated===1 && this.activationCostPayable)
	}
}
