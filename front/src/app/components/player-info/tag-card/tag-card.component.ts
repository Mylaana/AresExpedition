import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTagInfoService } from '../../../services/global/global-tag-info.service';
import { TagState } from '../../../interfaces/global.interface';


@Component({
  selector: 'app-tag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-card.component.html',
  styleUrl: './tag-card.component.scss'
})
export class TagCardComponent implements OnInit{
  @Input() tagState!: TagState;
  imageUrl!: string;

  constructor(private globalTagService: GlobalTagInfoService){}

  ngOnInit(): void {
    this.imageUrl = this.globalTagService.getTagUrlFromID(this.tagState.idImageUrl)
}
}
