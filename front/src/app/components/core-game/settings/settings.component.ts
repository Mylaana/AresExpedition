import { Component, Output, EventEmitter } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../services/designers/button-designer.service';


@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [NonEventButtonComponent],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent {
	@Output() closeSettings: EventEmitter<any> = new EventEmitter<any>()
	closeButton!: NonEventButton

	ngOnInit(): void {
		this.closeButton = ButtonDesigner.createNonEventButton('closeSettings')
	}

	public closeSettingsPannel(){
		console.log('close settings pannel:')
		this.closeSettings.emit()
	}

	public nonEventButtonClicked(button: NonEventButton){
		console.log('button clicked in settings:', button)
		switch(button.name){
		}
	}
}
