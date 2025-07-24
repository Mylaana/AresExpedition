import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder, CardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../project/playable-card-list/playable-card-list.component';
import { EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { ProjectFilter } from '../../../interfaces/global.interface';
import { BuilderOption, ProjectFilterNameEnum } from '../../../enum/global.enum';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CardBuilderAlternativeCostComponent } from '../card-builder-alternative-cost/card-builder-alternative-cost.component';

type BuilderBackgroundColor = 'green' | 'red' | 'blue' | 'bluered' | 'white' | 'redbluegreen'

@Component({
    selector: 'app-card-builder',
    imports: [
        CommonModule,
        EventCardBuilderButtonComponent,
        PlayableCardListComponent,
		CardBuilderAlternativeCostComponent
    ],
    templateUrl: './card-builder.component.html',
    styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent implements OnInit{
	@Input() cardBuilder!: CardBuilder
	@Input() option!: BuilderOption
	@Input() projectFilter?: ProjectFilter
	@Input() discount: number = 0
	@Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Output() alternativePayButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()
	@ViewChildren('altCost') alternativeCost!: QueryList<CardBuilderAlternativeCostComponent>

	@Input() event!: EventBaseModel
	@Input() eventId!: number

	currentEvent!: EventCardBuilder
	_lockBuilder!: NonEventButton
	ngOnInit(): void {
		this._lockBuilder = ButtonDesigner.createNonEventButton('lockBuilder')
	}
	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		this.cardBuilderListButtonClicked.emit(button)
	}
	public hasOptionButton(): boolean {
		return [BuilderOption.drawCard, BuilderOption.gain6MC].includes(this.cardBuilder.getOption())
	}
	public getBackground(): BuilderBackgroundColor {
		switch(this.projectFilter?.type){
			case(ProjectFilterNameEnum.blueOrRedProject):{
				return 'bluered'
			}
			case(ProjectFilterNameEnum.developmentPhaseSecondBuilder):
			case(ProjectFilterNameEnum.green9MCFree):
			case(ProjectFilterNameEnum.greenProject):{
				return 'green'
			}
			case(ProjectFilterNameEnum.blueProject):{
				return 'blue'
			}
			case(ProjectFilterNameEnum.maiNiProductions):{
				return 'redbluegreen'
			}
			case(undefined):{
				return 'redbluegreen'
			}
		}
		return 'white'
	}
	onAlternativePayButtonClicked(button: NonEventButton){
		this.alternativePayButtonClicked.emit(button)
	}
	getAlternativePayLocked(): boolean {
		let builderEvent: EventCardBuilder = this.event as EventCardBuilder
		return !builderEvent.cardBuilder[0].getBuilderIsLocked() && builderEvent.cardBuilder[0] != this.cardBuilder
	}
	public updateAlternativeCostButtonsEnabled(){
		if(this.cardBuilder.getBuilderIsLocked()){return}
		console.log('calling update')
		for(let a of this.alternativeCost){
			a.updateButtonEnabled()
		}
	}
}
