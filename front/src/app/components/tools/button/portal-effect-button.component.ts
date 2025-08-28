import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EffectPortalButton, NonEventButton } from '../../../models/core-game/button.model';
import { ButtonComponent } from './button.component';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-portal-effect-button',
    imports: [
        CommonModule,
        TextWithImageComponent,
    ],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class PortalEffectButtonComponent extends ButtonComponent {
	@Output() portalEffectButtonClicked: EventEmitter<EffectPortalButton> = new EventEmitter<EffectPortalButton>()
	@Input() override button!: EffectPortalButton;
}
