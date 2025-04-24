import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventMainButton } from '../../../models/core-game/button.model';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';
import { ButtonComponent } from './button.component';

@Component({
    selector: 'app-event-main-button',
    imports: [
        CommonModule,
        TextWithImageComponent,
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class EventMainButtonComponent extends ButtonComponent {
	@Output() eventMainButtonClicked: EventEmitter<EventMainButton> = new EventEmitter<EventMainButton>()
	@Input() override button!: EventMainButton;
}
