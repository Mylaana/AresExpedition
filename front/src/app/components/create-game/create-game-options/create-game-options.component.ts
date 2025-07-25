import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonWrapperComponent } from '../../tools/buttons/button-wrapper/button-wrapper.component';
import { ToggleButton } from '../../../models/core-game/button.model';
import { CreateGameOptionService, GameOption } from '../../../services/core-game/create-game.service';
import { ButtonDesigner } from '../../../factory/button-designer.service';

@Component({
  selector: 'app-create-game-options',
  imports: [
	CommonModule,
	ButtonWrapperComponent
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

	constructor(private createGameOptionService: CreateGameOptionService){}

	ngOnInit(): void {
		this._expansionDiscovery = ButtonDesigner.createToggleButton('expansionDiscovery')
		this._expansionFoundations = ButtonDesigner.createToggleButton('expansionFoundations')
		this._expansionPromo = ButtonDesigner.createToggleButton('expansionPromo')
		this._expansionDevFanMade = ButtonDesigner.createToggleButton('expansionDevFanMade')
		this._expansionBalancedCards = ButtonDesigner.createToggleButton('expansionBalancedCards')

		this._modeInitialDraft = ButtonDesigner.createToggleButton('modeInitialDraft')
		this._modeInfrastructureMandatory = ButtonDesigner.createToggleButton('modeInfrastructureMandatory')
		this._modeMerger = ButtonDesigner.createToggleButton('modeMerger')

		this.createGameOptionService.currentGameOptions.subscribe(options => this.updateButtonsValue(options))
	}
	onClick(button: ToggleButton){
		this.createGameOptionService.toggleOption(button.name)
	}
	updateButtonsValue(options: GameOption){
		this._expansionDiscovery.value = options.discovery
		this._expansionFoundations.value = options.foundations
		this._expansionPromo.value = options.promo
		this._expansionDevFanMade.value = options.fanmade
		this._expansionBalancedCards.value = options.balanced

		this._modeInitialDraft.value = options.initialDraft
		this._modeInfrastructureMandatory.value = options.infrastructureMandatory
		this._modeMerger.value = options.merger
	}
}
