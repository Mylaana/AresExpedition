import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardTypeFilterPannelComponent } from '../card-type-filter-pannel/card-type-filter-pannel.component';
import { CommonModule } from '@angular/common';
import { ButtonNames, FilterPannelSelectedBehavior, NonEventButtonNames } from '../../../../types/global.type';

type FilterType = 'tags' | 'cardType'

@Component({
  selector: 'app-filter-pannel-wrapper',
  imports: [
    CardTypeFilterPannelComponent,
    CommonModule
  ],
  templateUrl: './filter-pannel-wrapper.component.html',
  styleUrl: './filter-pannel-wrapper.component.scss'
})
export class FilterPannelWrapperComponent {
  @Input() filterType!: FilterType
  @Input() displayBehavior: FilterPannelSelectedBehavior = 'all'
  @Input() currentSelection!: NonEventButtonNames
  @Output() buttonClicked: EventEmitter<NonEventButtonNames> = new EventEmitter<NonEventButtonNames>()

  onButtonClicked(name: NonEventButtonNames){
    this.buttonClicked.emit(name)
  }
}
