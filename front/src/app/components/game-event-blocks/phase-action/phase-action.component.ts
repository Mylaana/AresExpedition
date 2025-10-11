import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { EventBaseModel, EventCardActivator } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { DeckQueryOptionsEnum } from '../../../enum/global.enum';
import { ActivationOption } from '../../../types/project-card.type';
import { EventFactory } from '../../../factory/event/event-factory';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { GameOption } from '../../../services/core-game/create-game.service';
import { CommonModule } from '@angular/common';
import { ActionPhaseService } from '../../../services/core-game/action-phase.service';
import { StandardProjectButtonNames } from '../../../types/global.type';

@Component({
    selector: 'app-phase-action',
    imports: [
		CommonModule,
        NonEventButtonComponent,
        PlayableCardListComponent,
		HexedBackgroundComponent
    ],
    templateUrl: './phase-action.component.html',
    styleUrl: './phase-action.component.scss'
})
export class PhaseActionComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	@Output() projectActivated = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	_convertForest!: NonEventButton
	_buyForest!: NonEventButton
	_convertTemperature!: NonEventButton
	_buyTemperature!: NonEventButton
	_convertInfrastructure!: NonEventButton
	_buyInfrastructure!: NonEventButton
	_buyOcean!: NonEventButton
	_buyUpgrade!: NonEventButton

	_gameOptions!: GameOption


	private _actionEvent!: EventCardActivator
	private destroy$ = new Subject<void>()

	constructor(
		private gameStateService: GameState,
		private actionPhaseService: ActionPhaseService
	){}

	ngOnInit(): void {
		this._convertForest = this.actionPhaseService.getButton('convertForest')
		this._buyForest = this.actionPhaseService.getButton('buyForest')
		this._convertTemperature = this.actionPhaseService.getButton('convertTemperature')
		this._buyTemperature = this.actionPhaseService.getButton('buyTemperature')
		this._convertInfrastructure = this.actionPhaseService.getButton('convertInfrastructure')
		this._buyInfrastructure = this.actionPhaseService.getButton('buyInfrastructure')
		this._buyOcean = this.actionPhaseService.getButton('buyOcean')
		this._buyUpgrade = this.actionPhaseService.getButton('buyUpgrade')

		this.gameStateService.currentGameOptions.pipe(takeUntil(this.destroy$)).subscribe(options => this._gameOptions = options)
		this._actionEvent = this.event as EventCardActivator
		this.applyPhaseCardBonusIfRelevant()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	applyPhaseCardBonusIfRelevant() {
		if(this._actionEvent.hasScan===false || this._actionEvent.scanUsed){return}
		this._actionEvent.scanUsed=true
		this.gameStateService.addEventQueue(EventFactory.simple.scanKeep({scan:3, keep:1}, DeckQueryOptionsEnum.actionPhaseScan), 'first')
	}
	onClick(button: NonEventButton): void {
		this.actionPhaseService.onButtonClicked(button.name as StandardProjectButtonNames)
	}
	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}){
		this.projectActivated.emit(input)
	}
	public isStandardPhaseUpgradeOptionActive(): boolean {
		if(!this._gameOptions){return false}
		return this._gameOptions.standardUpgrade && this._gameOptions.discovery
	}
	public isFoundationsActive(): boolean {
		if(!this._gameOptions){return false}
		return this._gameOptions.foundations
	}
}
