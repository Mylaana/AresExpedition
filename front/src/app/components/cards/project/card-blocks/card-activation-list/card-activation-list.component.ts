import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';
import { CardActivationComponent } from '../card-activation/card-activation.component';
import { ActivationOption } from '../../../../../types/project-card.type';
import { ProjectCardActivatedEffectService } from '../../../../../services/cards/project-card-activated-effect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-activation-list',
  imports: [
	CommonModule,
	CardActivationComponent
],
  templateUrl: './card-activation-list.component.html',
  styleUrl: './card-activation-list.component.scss'
})
export class CardActivationListComponent implements OnInit{
	@Input() maximumCardActivation!: boolean
	@Input() projectCard!: PlayableCardModel
	@Output() activated: EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}> = new EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}>()

	activationOptions: ActivationOption[] = []

	ngOnInit(): void {
		this.activationOptions = ProjectCardActivatedEffectService.getActivationOption(this.projectCard)
	}
	public onActivation(activation: {option: ActivationOption, twice: boolean}): void {
		this.activated.emit({card: this.projectCard, option: activation.option, twice: activation.twice})
	}
}
