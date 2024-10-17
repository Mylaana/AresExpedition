import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder, CardBuilder } from '../../../models/core-game/event.model';
import { ProjectCardListComponent } from '../project/project-card-list/project-card-list.component';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { EventCardBuilderButtonComponent } from '../../tools/event-play-zone-button/event-play-zone-button.component';
import { CardBuilderOptionType } from '../../../types/global.type';

@Component({
  selector: 'app-card-builder',
  standalone: true,
  imports: [
    CommonModule,
    EventCardBuilderButtonComponent,
    ProjectCardListComponent
  ],
  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent {
  @Input() cardBuilder!: CardBuilder
  @Input() option!: CardBuilderOptionType
  @Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()

  @Input() event!: EventBaseModel
  @Input() eventId!: number
  currentEvent!: EventCardBuilder
  
  public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
    this.cardBuilderListButtonClicked.emit(button)
  }
}
