import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCardComponent } from '../tag-card/tag-card.component';
import { TagInfo } from '../../../interfaces/global.interface';
import { myUUID, SettingPlayerPannelSize } from '../../../types/global.type';

@Component({
    selector: 'app-tag-pannel',
    imports: [
        CommonModule,
        TagCardComponent
    ],
    templateUrl: './tag-pannel.component.html',
    styleUrl: './tag-pannel.component.scss'
})
export class TagPannelComponent implements OnInit{
	@Input() playerId!: myUUID;
	@Input() tagState!: TagInfo[];
	@Input() pannelSize!: SettingPlayerPannelSize


	constructor(private el: ElementRef) {}

    ngOnInit(): void {
        const host = this.el.nativeElement as HTMLElement;
		host.style.setProperty('--tags-per-row', Math.ceil(this.tagState.length/2).toString());
    }

    getTagsPerRow():number{
        return (Math.ceil(this.tagState.length/2))
    }
}
