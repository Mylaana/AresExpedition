import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToggleButton } from '../../../models/core-game/button.model';
import { CreateGameOptionService, GameOption } from '../../../services/core-game/create-game.service';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CreateGameOptionCardComponent } from '../create-game-option-card/create-game-option-card.component';
import { AnyButton, GameOptionName } from '../../../types/global.type';
import { GameTextService } from '../../../services/core-game/game-text.service';

@Component({
  selector: 'app-create-game-options',
  imports: [
	CommonModule,
	CreateGameOptionCardComponent
  ],
  templateUrl: './create-game-options.component.html',
  styleUrl: './create-game-options.component.scss'
})
export class CreateGameOptionsComponent implements OnInit{
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
	updateButtonsState(options: GameOption){
		this._expansionDiscovery.value = options.discovery
		this._expansionFoundations.value = options.foundations
		this._expansionPromo.value = options.promo
		this._expansionDevFanMade.value = options.fanmade
		this._expansionBalancedCards.value = options.balanced

		this._modeInitialDraft.value = options.initialDraft
		this._modeInitialDraft.locked = true
		this._modeMerger.value = options.merger
		this._modeDeadHand.value = options.deadHand

		//bound sub-options
		this._modeInfrastructureMandatory.value = options.infrastructureMandatory
		this._modeInfrastructureMandatory.locked = options.foundations===false

		this._modeStandardProjectPhaseUpgrade.value = options.standardUpgrade
		this._modeStandardProjectPhaseUpgrade.locked = options.discovery===false
		this._modeAdditionalAwards.value = options.additionalAwards
		this._modeAdditionalAwards.locked = options.discovery===false
	}
	getCaption(option: GameOptionName): string {
		return this.gameTextService.getGameOptionCaption(option)
	}
	getTooltip(option: GameOptionName): string {
		return this.gameTextService.getGameOptionToolTip(option)
	}
}
