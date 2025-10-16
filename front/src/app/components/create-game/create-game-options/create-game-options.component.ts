import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NonEventButton, ToggleButton } from '../../../models/core-game/button.model';
import { CreateGameOptionService, GameOption } from '../../../services/core-game/create-game.service';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CreateGameOptionCardComponent } from '../create-game-option-card/create-game-option-card.component';
import { AnyButton, GameContentName, NonEventButtonNames, ToggleButtonNames } from '../../../types/global.type';
import { GameTextService } from '../../../services/core-game/game-text.service';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { GameOptionKey, InterfaceTitleKey } from '../../../types/text.type';
import { GAME_OPTIONS_TEMPLATE } from '../../../maps/const-maps';

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
	private buttons: Partial<Record<GameContentName, ToggleButton>> = {}
	private contentNameList: GameContentName[] = []

	_activateAll!: NonEventButton
	_deactivateAll!: NonEventButton

	constructor(
		private createGameOptionService: CreateGameOptionService,
		private gameTextService: GameTextService
	){}
	ngOnInit(): void {
		for(let k in GAME_OPTIONS_TEMPLATE){
			this.contentNameList.push(k as GameContentName)
			this.buttons[k as GameContentName] = ButtonDesigner.createToggleButton(k as GameContentName)
		}

		this._activateAll = ButtonDesigner.createNonEventButton('createGameOptionActivateAll')
		this._deactivateAll = ButtonDesigner.createNonEventButton('createGameOptionDeactivateAll')

		this.createGameOptionService.currentGameOptions.subscribe(options => this.updateButtonsState(options))
	}
	onClick(button: AnyButton){
		this.createGameOptionService.toggleOption((button as ToggleButton).name)
	}
	updateButtonsState(options: Record<GameContentName, boolean>){
		for(let n of this.contentNameList){
			if(n in this.buttons && this.buttons[n]){
				this.buttons[n].value = options[n]
			}
		}

		this.setButtonLocked('modeInitialDraft', true)

		//bound sub-options
		this.setButtonLocked('modeInfrastructureMandatory', options['expansionFoundations']===false)
		this.setButtonLocked('modeStandardProjectPhaseUpgrade', options['expansionDiscovery']===false)
		this.setButtonLocked('modeAdditionalAwards', options['expansionDiscovery']===false)
	}
	setButtonLocked(name: GameContentName, locked: boolean){
		if(!(name in this.buttons) || !this.buttons[name]){return}
		this.buttons[name].locked = locked
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
	getToggleButton(name: GameContentName): ToggleButton {
		return this.buttons[name] || new ToggleButton
	}
}
