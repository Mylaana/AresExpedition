import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../tools/button/button.component';
import { ImageButton } from '../../../models/core-game/button.model';
import { PhaseCardModel } from '../../../models/cards/phase-card.model';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { SelectablePhaseEnum } from '../../../enum/phase.enum';
import { ButtonNames, myUUID } from '../../../types/global.type';
import { expandCollapseVertical, fadeIn } from '../../../animations/animations';
import { EventBaseModel, EventGeneric } from '../../../models/core-game/event.model';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';

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
		TextWithImageComponent,
		HexedBackgroundComponent
	],
	templateUrl: './phase-planification.component.html',
	styleUrl: './phase-planification.component.scss',
	animations: [expandCollapseVertical, fadeIn]
})
export class PhasePlanificationComponent {
	@Input() event!: EventBaseModel
	@Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
	buttonList: ImageButton [] = []
	currentPhaseSelected!: SelectablePhaseEnum;
	selectedPhaseCards: PhaseCardModel[] = []
	currentPhaseCard!: PhaseCardModel | undefined

	constructor(private gameStateService: GameState){}

	ngOnInit(){
		let playerPhase = this.gameStateService.getClientPhaseSelected()
		if(playerPhase===undefined){return}
		/*
		for(let phase of phaseList){
			this.createPhaseButtons(phase, playerPhase.previousSelectedPhase!=phase)
		}
			*/
		this.setPhaseCards()
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
		if(button.name===undefined){return}
		this.setSelectedPhase(this.event as EventGeneric, button.name as SelectablePhaseEnum)

		//this.gameStateService.playerSelectPhase(this.clientPlayerId, button.value as SelectablePhaseEnum)

		this.currentPhaseCard = undefined
		this.setCurrentPhaseCard()
		//this.phaseSelected.emit()
	}
	public setSelectedPhase(event: EventGeneric, phase: SelectablePhaseEnum): void {
		this.currentPhaseSelected = phase
		event.selectedPhase = phase
		event.button?.updateEnabled(true)
	}
}
