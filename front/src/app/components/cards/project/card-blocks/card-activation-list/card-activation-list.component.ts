import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';
import { CardActivationComponent } from '../card-activation/card-activation.component';
import { ActivationOption } from '../../../../../types/project-card.type';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../../../services/game-state/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayerStateModel } from '../../../../../models/player-info/player-state.model';
import { PlayableCard } from '../../../../../factory/playable-card.factory';
import { SettingCardSize } from '../../../../../types/global.type';

interface Activation {
	index: ActivationOption
	caption: string
}

@Component({
  selector: 'app-card-activation-list',
  imports: [
	CommonModule,
	CardActivationComponent
],
  templateUrl: './card-activation-list.component.html',
  styleUrl: './card-activation-list.component.scss'
})
export class CardActivationListComponent implements OnInit, OnDestroy{
	@Input() maximumCardActivation!: boolean
	@Input() projectCard!: PlayableCardModel
	@Input() cardSize!: SettingCardSize
	@Output() activated: EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}> = new EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}>()

	activationOptions: Activation[] = []
	clientState!: PlayerStateModel
	destroy$ = new Subject<void>()
	isScalingCostActivation: boolean = false

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		if(this.projectCard.effectSummaryOption==='scalingCostActivation' || this.projectCard.effectSummaryOption2==='scalingCostActivation'){
			this.isScalingCostActivation = true
			this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		} else {
			this.updateActivationOptions()
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public onActivation(activation: {option: ActivationOption, twice: boolean}): void {
		this.activated.emit({card: this.projectCard, option: activation.option, twice: activation.twice})
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.updateActivationOptions()
	}
	private updateActivationOptions(){
		this.activationOptions = []
		let options = PlayableCard.activable.getActivationOption(this.projectCard.cardCode)
		for(let i=0; i<options.length; i++){
			this.activationOptions.push({
				caption: this.projectCard.getActionCaption(i),
				index: options[i]
			})
		}
	}
}
