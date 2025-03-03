import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../tools/button/button.component';
import { ImageButton } from '../../../models/core-game/button.model';
import { PhaseCardModel } from '../../../models/cards/phase-card.model';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { SelectablePhaseEnum } from '../../../enum/phase.enum';
import { ButtonNames } from '../../../types/global.type';

const phaseList: SelectablePhaseEnum[] = [SelectablePhaseEnum.development, SelectablePhaseEnum.construction, SelectablePhaseEnum.action, SelectablePhaseEnum.production, SelectablePhaseEnum.research]
const phaseIndexMap = new Map<number, SelectablePhaseEnum>([
	[0, SelectablePhaseEnum.development],
	[1, SelectablePhaseEnum.construction],
	[2, SelectablePhaseEnum.action],
	[3, SelectablePhaseEnum.production],
	[4, SelectablePhaseEnum.research]
])

@Component({
	selector: 'app-phase-planification',
	standalone: true,
	imports: [
		CommonModule,
		ButtonComponent,
		TextWithImageComponent
	],
	templateUrl: './phase-planification.component.html',
	styleUrl: './phase-planification.component.scss'
})
export class PhasePlanificationComponent {
	@Input() clientPlayerId!: number;
	@Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
	buttonList: ImageButton [] = []
	currentPhaseSelected!: string;
	selectedPhaseCards: PhaseCardModel[] = []
	currentPhaseCard!: PhaseCardModel | undefined

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		let playerPhase = this.gameStateService.getPlayerPhase(this.clientPlayerId)
		if(playerPhase===undefined){return}
		for(let phase of phaseList){
			this.createPhaseButtons(phase, playerPhase.previousSelectedPhase!=phase)
		}
		this.setPhaseCards()
		console.log('playerphase: ', playerPhase)
	}
	createPhaseButtons(buttonPhase: SelectablePhaseEnum, enabled: boolean): void {
		let newButton = new ImageButton
		newButton.name = buttonPhase.toLocaleLowerCase() as ButtonNames,
		newButton.enabled = enabled,
		newButton.startEnabled = enabled,
		newButton.value = buttonPhase,
		newButton.imageUrl = `/assets/other/phase_${buttonPhase.toLocaleLowerCase()}.png`
		this.buttonList.push(newButton)
	}
	setPhaseCards(): void {
		this.selectedPhaseCards = this.gameStateService.getClientUpgradedPhaseCards()
	}
	setCurrentPhaseCard(): void {
		for(let index of phaseIndexMap.keys()){
			if(String(phaseIndexMap.get(index))===this.currentPhaseSelected){
				this.currentPhaseCard = this.selectedPhaseCards[index]
				return
			}
		}

		this.currentPhaseCard = undefined
	}
	public buttonClicked(button: ImageButton){
		console.log('planif button clicked:', button)
		if(button.name===undefined){return}
		this.currentPhaseSelected = button.name

		this.gameStateService.playerSelectPhase(this.clientPlayerId, button.value as SelectablePhaseEnum)

		this.currentPhaseCard = undefined
		this.setCurrentPhaseCard()
		this.phaseSelected.emit()
	}
}
