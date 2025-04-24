import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NonEventButton } from '../../../models/core-game/button.model';
import { ButtonComponent } from './button.component';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';

@Component({
    selector: 'app-non-event-button',
    imports: [
        CommonModule,
        TextWithImageComponent,
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class NonEventButtonComponent extends ButtonComponent {
	@Output() nonEventButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()
	@Input() override button!: NonEventButton ;
}
