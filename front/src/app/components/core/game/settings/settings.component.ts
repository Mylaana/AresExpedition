import { Component, Output, EventEmitter } from '@angular/core';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { GameParamService } from '../../../../services/core-game/game-param.service';


@Component({
    selector: 'app-settings',
    imports: [
        NonEventButtonComponent,
        HexedBackgroundComponent,
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
	@Output() closeSettings: EventEmitter<any> = new EventEmitter<any>()
	_closeButton!: NonEventButton
	_toggleDebugMode!: NonEventButton
	_toggleLanguage!: NonEventButton

	constructor(private gameParam: GameParamService){}
	ngOnInit(): void {
		this._closeButton = ButtonDesigner.createNonEventButton('closeSettings')
		this._toggleDebugMode = ButtonDesigner.createNonEventButton('settingToggleDebug')
		this._toggleLanguage = ButtonDesigner.createNonEventButton('settingToggleLanguage')
	}
	public closeSettingsPannel(){
		this.closeSettings.emit()
	}
	public onButtonClicked(button: NonEventButton){
		switch(button.name){
			case('settingToggleDebug'):{
				this.gameParam.toggleDebug()
				break
			}
			case('settingToggleLanguage'):{
				this.gameParam.toggleLanguage()
				break
			}
		}
	}
	public nonEventButtonClicked(button: NonEventButton){
		switch(button.name){
		}
	}
}
