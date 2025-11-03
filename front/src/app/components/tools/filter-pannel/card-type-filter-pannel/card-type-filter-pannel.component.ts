import { Component, Input, OnInit, Output } from '@angular/core';
import { CardType } from '../../../../types/project-card.type';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { EventEmitter } from '@angular/core';
import { NonEventButtonComponent } from '../../button/non-event-button.component';
import { ButtonNames, FilterPannelSelectedBehavior, NonEventButtonNames } from '../../../../types/global.type';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-card-type-filter-pannel',
	imports: [NonEventButtonComponent, CommonModule],
	templateUrl: './card-type-filter-pannel.component.html',
	styleUrl: './card-type-filter-pannel.component.scss'
})
export class CardTypeFilterPannelComponent implements OnInit{
	@Input() currentSelection!: NonEventButtonNames
	@Input() displayBehavior!: FilterPannelSelectedBehavior
	@Output() buttonClicked: EventEmitter<NonEventButtonNames> = new EventEmitter<NonEventButtonNames>()

	private buttons!: Record<CardType, NonEventButton>
	_buttonList: CardType[] = ['corporation', 'project', 'greenProject', 'blueProject', 'redProject']
	ngOnInit(): void {
		this.buttons = {
			corporation: ButtonDesigner.createNonEventButton('corporation'),
			project: ButtonDesigner.createNonEventButton('project'),
			blueProject: ButtonDesigner.createNonEventButton('blueProject'),
			activableProject: ButtonDesigner.createNonEventButton('activableProject'),
			triggerProject: ButtonDesigner.createNonEventButton('triggerProject'),
			greenProject: ButtonDesigner.createNonEventButton('greenProject'),
			redProject: ButtonDesigner.createNonEventButton('redProject'),
		}
	}
	getButton(type: CardType): NonEventButton{
		return this.buttons[type]
	}
	onButtonClicked(button: NonEventButtonNames){
		this.buttonClicked.emit(button)
	}
}
