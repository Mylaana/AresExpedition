import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceCardComponent } from '../ressource-card/ressource-card.component';
import { RessourceInfo } from '../../../interfaces/global.interface';
import { myUUID, SettingInterfaceSize } from '../../../types/global.type';

@Component({
    selector: 'app-ressource-pannel',
    imports: [
        CommonModule,
        RessourceCardComponent
    ],
    templateUrl: './ressource-pannel.component.html',
    styleUrl: './ressource-pannel.component.scss'
})
export class RessourcePannelComponent {
	@Input() playerId!: myUUID;
	@Input() ressource!: RessourceInfo[];
	@Input() handSize!: number
	@Input() interfaceSize!: SettingInterfaceSize
}
