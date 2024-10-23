import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagState } from '../../../interfaces/global.interface';
import { GlobalInfo } from '../../../services/global/global-info.service';


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

  ngOnInit(): void {
    this.imageUrl = GlobalInfo.getUrlFromID(this.tagState.idImageUrl)
}
}
