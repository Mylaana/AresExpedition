import { Component, Input, OnInit } from '@angular/core';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { SettingCardSize } from '../../../types/global.type';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { CommonModule } from '@angular/common';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { CardBuilderEventHandlerService } from '../../../services/core-game/card-builder-event-handler.service';

@Component({
	selector: 'app-card-builder-alternative-option',
	imports: [
		CommonModule,
		EventCardBuilderButtonComponent
	],
	templateUrl: './card-builder-alternative-option.component.html',
	styleUrl: './card-builder-alternative-option.component.scss'
})
export class CardBuilderAlternativeOptionComponent implements OnInit{
	@Input() builder!: CardBuilder
	@Input() cardSize!: SettingCardSize

	_buttons: EventCardBuilderButton[] = []

	constructor(private builderService: CardBuilderEventHandlerService){}

	ngOnInit(): void {
		this._buttons = this.builder.getButtons('option')
		console.log(this._buttons, this.builder)
	}
	onButtonClicked(button: EventCardBuilderButton){
		this.builderService.onAlternativeOptionButtonClicked(button)
	}
}
