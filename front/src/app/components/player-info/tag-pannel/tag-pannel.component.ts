import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCardComponent } from '../tag-card/tag-card.component';
import { TagInfo } from '../../../interfaces/global.interface';
import { myUUID } from '../../../types/global.type';

@Component({
	selector: 'app-tag-pannel',
	standalone: true,
	imports: [
		CommonModule,
		TagCardComponent
	],
	templateUrl: './tag-pannel.component.html',
	styleUrl: './tag-pannel.component.scss'
})
export class TagPannelComponent {
	@Input() playerId!: myUUID;
	@Input() tagState!: TagInfo[];

	ngOnInit(): void {

	}
}
