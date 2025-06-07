import { AfterViewInit, Component, EventEmitter, Input, input, OnDestroy, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { EventMainButton, NonEventButton } from '../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { EventBaseModel, EventCardActivator } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { GlobalParameterNameEnum } from '../../../enum/global.enum';
import { ActivationOption } from '../../../types/project-card.type';
import { EventFactory } from '../../../factory/event factory/event-factory';
import { ProjectCardActivatedEffectService } from '../../../services/cards/project-card-activated-effect.service';

@Component({
    selector: 'app-phase-action',
    imports: [
        NonEventButtonComponent,
        PlayableCardListComponent
    ],
    templateUrl: './phase-action.component.html',
    styleUrl: './phase-action.component.scss'
})
export class PhaseActionComponent implements OnInit, OnDestroy, AfterViewInit{
	@Input() event!: EventBaseModel
	@Output() actionPhaseButtonUpdate: EventEmitter<boolean> = new EventEmitter<boolean>()
	@Output() projectActivated = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	_convertForest: NonEventButton = ButtonDesigner.createNonEventButton('convertForest')
	_buyForest: NonEventButton = ButtonDesigner.createNonEventButton('buyForest')
	_convertTemperature: NonEventButton = ButtonDesigner.createNonEventButton('convertTemperature')
	_buyTemperature: NonEventButton = ButtonDesigner.createNonEventButton('buyTemperature')
	_convertInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('convertInfrastructure')
	_buyInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('buyInfrastructure')
	_buyOcean: NonEventButton = ButtonDesigner.createNonEventButton('buyOcean')

	private _mcStock: number = 0
	private _plantStock: number = 0
	private _heatStock: number = 0
	private _actionEvent!: EventCardActivator
	private _loaded = false
	private destroy$ = new Subject<void>()
	private clientState!: PlayerStateModel
	private convertPlantCost: number = 8

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => {this.onStateUpdate(state)})
		this._actionEvent = this.event as EventCardActivator
		this.updateButtonState()
	}
	ngAfterViewInit(): void {
		if(this.event.button){this.updateEndPhaseButton(this.event.button as EventMainButton)}
		this._loaded = true
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(state: PlayerStateModel): void {
		this.clientState = state
		this.convertPlantCost = ProjectCardActivatedEffectService.getScalingActivationCost('ConvertForest', this.clientState)
		this._convertForest.caption = ProjectCardActivatedEffectService.getScalingCostActivationCaption('ConvertForest', this.clientState)

		this._mcStock = state.getRessourceInfoFromType('megacredit')?.valueStock??0
		this._plantStock = state.getRessourceInfoFromType('plant')?.valueStock??0
		this._heatStock = state.getRessourceInfoFromType('heat')?.valueStock??0
		if(!this._loaded){return}
		this.updateButtonState()
		if(this.event.button){this.updateEndPhaseButton(this.event.button as EventMainButton)}
	}
	updateButtonState(): void {
		this._convertForest.updateEnabled(this._plantStock>=this.convertPlantCost)
		this._buyForest.updateEnabled(this._mcStock>=16)
		this._convertTemperature.updateEnabled(this._heatStock>=8)
		this._buyTemperature.updateEnabled(this._mcStock>=14)
		this._convertInfrastructure.updateEnabled(this._heatStock>=5 && this._plantStock>=3)
		this._buyInfrastructure.updateEnabled(this._mcStock>=15)
		this._buyOcean.updateEnabled(this._mcStock>=16)
	}
	updateEndPhaseButton(button: EventMainButton){
		let finishPhaseButtonEnabled = (this._heatStock>=8  || this._plantStock>=8 || (this._heatStock>=5  && this._plantStock>=3)) === false
		button.updateEnabled(finishPhaseButtonEnabled)
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
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -16}}))
				newEvents.push(EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint: 1}))
				break
			}
			case('convertTemperature'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'heat', valueStock: -8}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.temperature, steps:1}}))
				break
			}
			case('buyTemperature'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -14}}))
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
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -15}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.infrastructure, steps:1}}))
				newEvents.push(EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}}))
				break
			}
			case('buyOcean'):{
				newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -16}}))
				newEvents.push(EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter: {name:GlobalParameterNameEnum.ocean, steps:1}}))
				break
			}
		}
		this.gameStateService.addEventQueue(newEvents, 'first')
	}

	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}){
		this.projectActivated.emit(input)
	}
}
