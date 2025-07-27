import { AfterViewInit, Component, EventEmitter, Input, input, OnDestroy, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { EventMainButton, NonEventButton } from '../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { Subject, take, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { EventBaseModel, EventCardActivator } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { DeckQueryOptionsEnum, GlobalParameterNameEnum } from '../../../enum/global.enum';
import { ActivationOption } from '../../../types/project-card.type';
import { EventFactory } from '../../../factory/event/event-factory';
import { PlayableCard } from '../../../factory/playable-card.factory';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { GameOption } from '../../../services/core-game/create-game.service';
import { CommonModule } from '@angular/common';

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
export class PhaseActionComponent implements OnInit, OnDestroy, AfterViewInit{
	@Input() event!: EventBaseModel
	@Output() projectActivated = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	_convertForest: NonEventButton = ButtonDesigner.createNonEventButton('convertForest')
	_buyForest: NonEventButton = ButtonDesigner.createNonEventButton('buyForest')
	_convertTemperature: NonEventButton = ButtonDesigner.createNonEventButton('convertTemperature')
	_buyTemperature: NonEventButton = ButtonDesigner.createNonEventButton('buyTemperature')
	_convertInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('convertInfrastructure')
	_buyInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('buyInfrastructure')
	_buyOcean: NonEventButton = ButtonDesigner.createNonEventButton('buyOcean')
	_buyUpgrade: NonEventButton = ButtonDesigner.createNonEventButton('buyUpgrade')

	_gameOptions!: GameOption

	private _mcStock: number = 0
	private _plantStock: number = 0
	private _heatStock: number = 0
	private _actionEvent!: EventCardActivator
	private _loaded = false
	private destroy$ = new Subject<void>()
	private clientState!: PlayerStateModel

	private convertPlantCost: number = 8
	private convertHeatCost: number = 8
	private convertInfrastructureHeatCost: number = 5
	private convertInfrastructurePlantCost: number = 3
	private _buyForestCost!: number
	private _buyInfrastructureCost!: number
	private _buyOceanCost!: number
	private _buyTemperatureCost!: number
	private _buyUpgradeCost!: number

	convertPlantLock!: boolean
	 convertTemperatureLock!: boolean
	 convertInfrastructureLock!: boolean

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => {this.onStateUpdate(state)})
		this.gameStateService.currentGameOptions.pipe(takeUntil(this.destroy$)).subscribe(options => this._gameOptions = options)
		this._actionEvent = this.event as EventCardActivator
		this.applyPhaseCardBonusIfRelevant()
		this.updateConvertButtonLock()
		this.updateButtonState()
		//if(this.event.button){this.updateEndPhaseButton(this.event.button as EventMainButton)}
	}
	ngAfterViewInit(): void {
		this._loaded = true
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(state: PlayerStateModel): void {
		this.clientState = state
		this.convertPlantCost = PlayableCard.activable.getScalingCostActivation('ConvertForest', this.clientState)
		this._convertForest.caption = PlayableCard.activable.getScalingCostActivationCaption('ConvertForest', this.clientState)

		this._buyForest.caption = PlayableCard.activable.getScalingCostActivationCaption('buyForest', this.clientState)
		this._buyForestCost = PlayableCard.activable.getScalingCostActivation('buyForest', this.clientState)

		this._buyInfrastructure.caption = PlayableCard.activable.getScalingCostActivationCaption('buyInfrastructure', this.clientState)
		this._buyInfrastructureCost = PlayableCard.activable.getScalingCostActivation('buyInfrastructure', this.clientState)

		this._buyOcean.caption = PlayableCard.activable.getScalingCostActivationCaption('buyOcean', this.clientState)
		this._buyOceanCost = PlayableCard.activable.getScalingCostActivation('buyOcean', this.clientState)

		this._buyTemperature.caption = PlayableCard.activable.getScalingCostActivationCaption('buyTemperature', this.clientState)
		this._buyTemperatureCost = PlayableCard.activable.getScalingCostActivation('buyTemperature', this.clientState)

		this._buyUpgrade.caption = PlayableCard.activable.getScalingCostActivationCaption('buyUpgrade', this.clientState)
		this._buyUpgradeCost = PlayableCard.activable.getScalingCostActivation('buyUpgrade', this.clientState)

		this._mcStock = state.getRessourceInfoFromType('megacredit')?.valueStock??0
		this._plantStock = state.getRessourceInfoFromType('plant')?.valueStock??0
		this._heatStock = state.getRessourceInfoFromType('heat')?.valueStock??0
		if(!this._loaded){return}
		this.updateConvertButtonLock()
		this.updateButtonState()
		if(this.event.button){
			this.updateEndPhaseButton(this.event.button as EventMainButton)
		}
	}
	updateButtonState(): void {
		this._buyForest.setEnabled(this._mcStock>=this._buyForestCost)
		this._convertForest.setEnabled(this._plantStock>=this.convertPlantCost)
		this._convertForest.warning = this.convertPlantLock

		this._buyTemperature.setEnabled(this._mcStock>=this._buyTemperatureCost)
		this._convertTemperature.setEnabled(this._heatStock>=8)
		this._convertTemperature.warning = this.convertTemperatureLock

		this._buyInfrastructure.setEnabled(this._mcStock>=this._buyInfrastructureCost)
		this._convertInfrastructure.setEnabled(this._heatStock>=5 && this._plantStock>=3)
		this._convertInfrastructure.warning = this.convertInfrastructureLock

		this._buyOcean.setEnabled(this._mcStock>=this._buyOceanCost)
		this._buyUpgrade.setEnabled(this._mcStock>=this._buyUpgradeCost)
	}
	updateConvertButtonLock(){
		this.convertPlantLock = this.isConvertForestLocked()
		this.convertTemperatureLock = this.isConvertTemperatureLocked()
		this.convertInfrastructureLock = this.isConvertInfrastructureLocked()
	}
	updateEndPhaseButton(button: EventMainButton){
		button.setEnabled(!this.convertTemperatureLock && !this.convertInfrastructureLock && !this.convertPlantLock)
	}
	applyPhaseCardBonusIfRelevant() {
		if(this._actionEvent.hasScan===false || this._actionEvent.scanUsed){return}
		this._actionEvent.scanUsed=true
		this.gameStateService.addEventQueue(EventFactory.simple.scanKeep({scan:3, keep:1}, DeckQueryOptionsEnum.actionPhaseScan), 'first')
	}
	onClick(button: NonEventButton): void {
		let newEvents: EventBaseModel[] = []
		switch(button.name){
			case('convertForest'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'plant', valueStock: - this.convertPlantCost}}))
				newEvents.push(EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint: 1}))
				break
			}
			case('buyForest'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - this._buyForestCost}}))
				newEvents.push(EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint: 1}))
				break
			}
			case('convertTemperature'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'heat', valueStock: -8}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.temperature, steps:1}}))
				break
			}
			case('buyTemperature'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - this._buyTemperatureCost}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.temperature, steps:1}}))
				break
			}
			case('convertInfrastructure'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: [{name:'heat', valueStock: -5}, {name:'plant', valueStock: -3}]}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.infrastructure, steps:1}}))
				newEvents.push(EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}}))
				break
			}
			case('buyInfrastructure'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - this._buyInfrastructureCost}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.infrastructure, steps:1}}))
				newEvents.push(EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}}))
				break
			}
			case('buyOcean'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - this._buyOceanCost}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.ocean, steps:1}}))
				break
			}
			case('buyUpgrade'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: - this._buyUpgradeCost}}))
				newEvents.push(EventFactory.simple.upgradePhaseCard(1))
				break
			}
		}
		this.gameStateService.addEventQueue(newEvents, 'first')

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
	isConvertForestLocked(): boolean {
		if(this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.oxygen)){return false}
		return this._plantStock>=this.convertPlantCost
	}
	isConvertTemperatureLocked(): boolean {
		if(this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.temperature)){return false}
		return this._heatStock>=this.convertHeatCost
	}
	isConvertInfrastructureLocked(): boolean {
		if(!this._gameOptions.foundations){return false}
		if(!this._gameOptions.infrastructureMandatory){return false}
		if(this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.infrastructure)){return false}
		return this._heatStock>=this.convertInfrastructureHeatCost && this._plantStock>=this.convertInfrastructurePlantCost
	}
}
