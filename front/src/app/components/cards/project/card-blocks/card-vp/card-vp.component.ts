import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { VpComponent } from '../../../../tools/vp/vp.component';

@Component({
    selector: 'app-card-vp',
    imports: [
        CommonModule,
        TextWithImageComponent,
        VpComponent
    ],
    templateUrl: './card-vp.component.html',
    styleUrl: './card-vp.component.scss'
})
export class CardVpComponent {
	@Input() vpNumber!: string
	@Input() vpDescription?: string
}
