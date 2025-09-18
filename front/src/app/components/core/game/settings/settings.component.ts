import { Component, Output, EventEmitter } from '@angular/core';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { CarouselButton, NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { ButtonCarouselComponent } from '../../../tools/buttons/button-carousel/button-carousel.component';
import { SETTING_CARD_SIZE, SETTING_INTERFACE_SIZE, SETTING_PLAYERPANNEL_SIZE, SETTING_SUPPORTED_LANGUAGE } from '../../../../global/global-const';


@Component({
    selector: 'app-settings',
    imports: [
        NonEventButtonComponent,
        HexedBackgroundComponent,
		ButtonCarouselComponent
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
	@Output() closeSettings: EventEmitter<any> = new EventEmitter<any>()
	_closeButton!: NonEventButton
	_toggleDebugMode!: NonEventButton
	_toggleLanguage!: NonEventButton
	_carouselLanguage!: CarouselButton
	_carouselCardSize!: CarouselButton
	_carouselHandCardSize!: CarouselButton
	_carouselInterfaceSize!: CarouselButton
	_carouselPlayerPannelSize!: CarouselButton

	constructor(private gameParam: GameParamService){}
	ngOnInit(): void {
		this._closeButton = ButtonDesigner.createNonEventButton('closeSettings')
		this._toggleDebugMode = ButtonDesigner.createNonEventButton('settingToggleDebug')
		this._toggleLanguage = ButtonDesigner.createNonEventButton('settingToggleLanguage')
		this._carouselLanguage = ButtonDesigner.createCarouselButton('carousel', SETTING_SUPPORTED_LANGUAGE, this.gameParam.getCurrentLanguage())
		this._carouselCardSize = ButtonDesigner.createCarouselButton('carousel', SETTING_CARD_SIZE, this.gameParam.getCurrentCardSize())
		this._carouselHandCardSize = ButtonDesigner.createCarouselButton('carousel', SETTING_CARD_SIZE, this.gameParam.getCurrentHandCardSize())
		this._carouselInterfaceSize = ButtonDesigner.createCarouselButton('carousel', SETTING_INTERFACE_SIZE, this.gameParam.getCurrentInterfaceSize())
		this._carouselPlayerPannelSize = ButtonDesigner.createCarouselButton('carousel', SETTING_PLAYERPANNEL_SIZE, this.gameParam.getCurrentPlayerPannelSize())
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
		}
	}
	public nonEventButtonClicked(button: NonEventButton){
		switch(button.name){
		}
	}
	public onCarouselButtonClicked(button: CarouselButton, value: string){
		switch(button){
			case(this._carouselLanguage):{
				this.gameParam.setNewLanguage(value)
				break
			}
			case(this._carouselCardSize):{
				this.gameParam.setNewCardSize(value)
				break
			}
			case(this._carouselHandCardSize):{
				this.gameParam.setNewHandCardSize(value)
				break
			}
			case(this._carouselInterfaceSize):{
				this.gameParam.setInterfaceSize(value)
				break
			}
			case(this._carouselPlayerPannelSize):{
				this.gameParam.setPlayerPannelSize(value)
				break
			}
		}
	}
}
