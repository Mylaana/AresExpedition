import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { EventBaseModel, EventGeneric } from '../../../models/core-game/event.model';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { InputComponent } from '../../tools/input/input.component';
import { InputFactoryService } from '../../../services/core-game/input-factory.service';
import { InputRule } from '../../../interfaces/global.interface';
import { InputRuleEnum } from '../../../enum/global.enum';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';

@Component({
  selector: 'app-convert-resource',
  imports: [
	CommonModule,
	PlayableCardListComponent,
	HexedBackgroundComponent,
	InputComponent,
	TextWithImageComponent
	],
  templateUrl: './convert-resource.component.html',
  styleUrl: './convert-resource.component.scss',
})
export class ConvertResourceComponent implements OnInit{
	@Input() event!: EventBaseModel
	_card!: PlayableCardModel
	_inputRule!: InputRule
	_rule!: InputRuleEnum
	_convertValueInitial!: number
	constructor(
		private cardInfoService: ProjectCardInfoService,
		private inputFactory: InputFactoryService
	){}

	ngOnInit(): void {
		this.getCardFromOrigin()
		this.setInputRule(this.event as EventGeneric)
		this._convertValueInitial = this._inputRule.numberMin??0
		this.setEventResourceConversion(this._convertValueInitial)
	}
	private getCardFromOrigin(){
		if(!this.event.eventOrigin || this.event.eventOrigin.originType != 'cardCode'){return}
		let card = this.cardInfoService.getCardById(this.event.eventOrigin?.originValue)
		if(!card){return}
		this._card = card
	}
	private setInputRule(event: EventGeneric){
		if(event.resourceConversionInputRule===undefined){return}
		this._inputRule = this.inputFactory.getInputParams(event.resourceConversionInputRule)
	}
	onInputValueNumberUpdate(value: number){
		this._convertValueInitial = value
		this.setEventResourceConversion(value)
	}
	setEventResourceConversion(value: number){
		let e = this.event as EventGeneric
		e.resourceConversionQuantity = value
	}
}
