import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInfo } from '../../../interfaces/global.interface';
import { GlobalInfo } from '../../../services/global/global-info.service';


@Component({
    selector: 'app-tag-card',
    imports: [CommonModule],
    templateUrl: './tag-card.component.html',
    styleUrl: './tag-card.component.scss'
})
export class TagCardComponent implements OnInit{
	@Input() tagState!: TagInfo;
	imageUrl!: string;

	ngOnInit(): void {
		this.imageUrl = GlobalInfo.getUrlFromID(this.tagState.idImageUrl)
}
}
