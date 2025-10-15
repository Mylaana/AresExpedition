import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NonEventButton, ToggleButton } from '../../../models/core-game/button.model';
import { CreateGameOptionService, GameOption } from '../../../services/core-game/create-game.service';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CreateGameOptionCardComponent } from '../create-game-option-card/create-game-option-card.component';
import { AnyButton, GameContentName } from '../../../types/global.type';
import { GameTextService } from '../../../services/core-game/game-text.service';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { GameOptionKey, InterfaceTitleKey } from '../../../types/text.type';

@Component({
  selector: 'app-create-game-options',
  imports: [
	CommonModule,
	CreateGameOptionCardComponent,
	NonEventButtonComponent
  ],
  templateUrl: './create-game-options.component.html',
  styleUrl: './create-game-options.component.scss'
})
export class CreateGameOptionsComponent implements OnInit{
	_activateAll!: NonEventButton
	_deactivateAll!: NonEventButton

	_expansionDiscovery!: ToggleButton
	_expansionFoundations!: ToggleButton
	_expansionPromo!: ToggleButton
	_expansionDevFanMade!: ToggleButton
	_expansionBalancedCards!: ToggleButton

	_modeInitialDraft!: ToggleButton
	_modeInfrastructureMandatory!: ToggleButton
	_modeMerger!: ToggleButton
	_modeDeadHand!: ToggleButton
	_modeStandardProjectPhaseUpgrade!: ToggleButton
	_modeAdditionalAwards!: ToggleButton

	constructor(
		private createGameOptionService: CreateGameOptionService,
		private gameTextService: GameTextService
	){}
	ngOnInit(): void {
		this._activateAll = ButtonDesigner.createNonEventButton('createGameOptionActivateAll')
		this._deactivateAll = ButtonDesigner.createNonEventButton('createGameOptionDeactivateAll')

		this._expansionDiscovery = ButtonDesigner.createToggleButton('expansionDiscovery')
		this._expansionFoundations = ButtonDesigner.createToggleButton('expansionFoundations')
		this._expansionPromo = ButtonDesigner.createToggleButton('expansionPromo')
		this._expansionDevFanMade = ButtonDesigner.createToggleButton('expansionDevFanMade')
		this._expansionBalancedCards = ButtonDesigner.createToggleButton('expansionBalancedCards')

		this._modeInitialDraft = ButtonDesigner.createToggleButton('modeInitialDraft')
		this._modeInfrastructureMandatory = ButtonDesigner.createToggleButton('modeInfrastructureMandatory')
		this._modeMerger = ButtonDesigner.createToggleButton('modeMerger')
		this._modeStandardProjectPhaseUpgrade = ButtonDesigner.createToggleButton('modeStandardProjectPhaseUpgrade')
		this._modeDeadHand = ButtonDesigner.createToggleButton('modeDeadHand')
		this._modeAdditionalAwards = ButtonDesigner.createToggleButton('modeAdditionalAwards')

		this.createGameOptionService.currentGameOptions.subscribe(options => this.updateButtonsState(options))
	}
	onClick(button: AnyButton){
		this.createGameOptionService.toggleOption((button as ToggleButton).name)
	}
	updateButtonsState(options: Record<GameContentName, boolean>){
		this._expansionDiscovery.value = options['expansionDiscovery']
		this._expansionFoundations.value = options['expansionFoundations']
		this._expansionPromo.value = options['expansionPromo']
		this._expansionDevFanMade.value = options['expansionDevFanMade']
		this._expansionBalancedCards.value = options['expansionBalancedCards']

		this._modeInitialDraft.value = options['modeInitialDraft']
		this._modeInitialDraft.locked = true
		this._modeMerger.value = options['modeMerger']
		this._modeDeadHand.value = options['modeDeadHand']

		//bound sub-options
		this._modeInfrastructureMandatory.value = options['modeInfrastructureMandatory']
		this._modeInfrastructureMandatory.locked = options['expansionFoundations']===false

		this._modeStandardProjectPhaseUpgrade.value = options['modeStandardProjectPhaseUpgrade']
		this._modeStandardProjectPhaseUpgrade.locked = options['expansionDiscovery']===false
		this._modeAdditionalAwards.value = options['modeAdditionalAwards']
		this._modeAdditionalAwards.locked = options['expansionDiscovery']===false
	}
	getCaption(key: GameOptionKey): string {
		return this.gameTextService.getGameOptionCaption(key)
	}
	getTooltip(key: GameOptionKey): string {
		return this.gameTextService.getGameOptionToolTip(key)
	}
	getTitle(key: InterfaceTitleKey): string {
		return this.gameTextService.getInterfaceTitle(key)
	}
	onAllOptionClick(button: NonEventButton){
		this.createGameOptionService.toggleAllOptions(button===this._activateAll)
	}
}
