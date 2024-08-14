import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { GlobalTagInfoService } from '../../../services/global/global-tag-info.service';
import { TextWithImageComponent } from '../../text-with-image/text-with-image.component';
import { LayoutCardBackgroundHexagonsComponent } from '../../layouts/layout-card-background-hexagons/layout-card-background-hexagons.component';
import { CardOptions } from '../../../interfaces/global.interface';
import { CardState } from '../../../interfaces/global.interface';
import { deepCopy } from '../../../functions/global.functions';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    TextWithImageComponent,
    LayoutCardBackgroundHexagonsComponent,
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements OnInit, OnChanges {
  @Input() projectCard!: ProjectCardModel;
  @Input() options?: CardOptions;
  @Output() cardStateChange: EventEmitter<{cardId: number, state:CardState}> = new EventEmitter<{cardId: number, state:CardState}>()
  state!: CardState;
  selectable!: boolean;

  readonly tagNumber = 3;

  constructor(private globalTagInfoService: GlobalTagInfoService){}

  ngOnInit() {
    this.projectCard.tagsUrl = []

    this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
    // fills tagUrl
    for(let i = 0; i < this.projectCard.tagsId.length; i++) {
      this.projectCard.tagsUrl.push(this.globalTagInfoService.getTagUrlFromID(this.projectCard.tagsId[i]))
    }

    //loading options
    this.resetCardState()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue) {
      this.resetCardState()
    }
  }

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
  cardClick(){
    if(this.selectable!=true){return}
	this.state.selected = this.state.selected===false
	console.log(this.projectCard.title, this.state.selected)
    this.cardStateChange.emit({cardId:this.projectCard.id, state: this.state})
  }

  resetCardState(): void {
    if(this.options===undefined){this.options = {}}
    if(this.options.initialState===undefined){this.state.selected=false}else{this.state=deepCopy(this.options.initialState)}
    if(this.options.selectable===undefined){this.selectable=false}else{this.selectable=deepCopy(this.options.selectable)}
  }

  play(): void {
		console.log('Played: ', this.projectCard.title)
	}

  activate(activationCount: number): void {
    console.log('Activated: ', this.projectCard.title)
  }
}
