import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCardComponent } from '../tag-card/tag-card.component';
import { TagCardModel } from '../../../models/tag-card.model';
import { TagInfoService } from '../../../service/tag-info.service';

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
  tagCards!: TagCardModel[];

  constructor(private tagInfoService: TagInfoService){}

  ngOnInit(): void {
    this.tagCards = this.tagInfoService.getTagStatus();
  }
}
