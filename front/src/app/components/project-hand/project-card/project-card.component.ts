import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { GlobalTagInfoService } from '../../../service/global/global-tag-info.service';


@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent implements OnInit {
  @Input() projectCard!: ProjectCardModel;

  readonly tagNumber = 3;

  constructor(private globalTagInfoService: GlobalTagInfoService){}

  fillTagId(tagsId:number[]): number[] {
    // ensures having 3 tags id in tagId
    // gets number array
    // returns number array
    var newTagsId = this.projectCard.tagsId.slice();
    for (let i = this.projectCard.tagsId.length; i < this.tagNumber; i++) {
      newTagsId.push(-1)
    }
    return newTagsId
  }

  ngOnInit() {
    this.projectCard.tagsUrl = []
    
    this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
    // fills tagUrl
    for(let i = 0; i < this.projectCard.tagsId.length; i++) {
      this.projectCard.tagsUrl.push(this.globalTagInfoService.getTagUrlFromID(this.projectCard.tagsId[i]))
    }
  }
}