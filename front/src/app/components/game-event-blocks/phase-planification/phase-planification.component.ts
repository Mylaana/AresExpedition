import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../tools/button/button.component';
import { ImageButton } from '../../../models/core-game/button.model';
import { PhaseCardModel } from '../../../models/cards/phase-card.model';

import { SelectablePhaseEnum } from '../../../enum/phase.enum';
import { ButtonNames, myUUID, SettingCardSize } from '../../../types/global.type';
import { expandCollapseVertical, fadeIn } from '../../../animations/animations';
import { EventBaseModel, EventGeneric } from '../../../models/core-game/event.model';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { PhaseCardComponent } from '../../cards/phase/phase-card/phase-card.component';
import { GameParamService } from '../../../services/core-game/game-param.service';
import { Subject, takeUntil } from 'rxjs';

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
    imports: [
        CommonModule,
		PhaseCardComponent
    ],
    templateUrl: './phase-planification.component.html',
    styleUrl: './phase-planification.component.scss',
    animations: [expandCollapseVertical, fadeIn]
})
export class PhasePlanificationComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	@Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
	buttonList: ImageButton [] = []
	currentPhaseSelected!: SelectablePhaseEnum;
	selectedPhaseCards: PhaseCardModel[] = []

	currentPhaseCard!: PhaseCardModel | undefined
	_hovered: boolean = false
	_previousSelectedPhase!: SelectablePhaseEnum | undefined

	_cardSize!: SettingCardSize

	destroy$ = new Subject<void>

	constructor(
		private gameStateService: GameState,
		private gameParam: GameParamService
	){}

	ngOnInit(){
		let playerPhase = this.gameStateService.getClientPhaseSelected()
		this.setPhaseCards()
		if(playerPhase===undefined){return}
		this._previousSelectedPhase = this.gameStateService.getClientPreviousPhaseSelected()
		this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	setPhaseCards(): void {
		this.selectedPhaseCards = this.gameStateService.getClientPhaseCards(true)
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
	public onPhaseSelected(phaseCard: PhaseCardModel){
		this.setSelectedPhase(this.event as EventGeneric, phaseCard.phaseGroup)
		this.currentPhaseCard = undefined
		this.setCurrentPhaseCard()
	}
	public setSelectedPhase(event: EventGeneric, phase: SelectablePhaseEnum): void {
		this.currentPhaseSelected = phase
		event.selectedPhase = phase
		event.button?.setEnabled(true)
	}
}
