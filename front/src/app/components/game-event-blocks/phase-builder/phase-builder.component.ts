import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';

@Component({
  selector: 'app-phase-builder',
  imports: [
	CommonModule,
	CardBuilderListComponent,
	PlayableCardListComponent
	],
  templateUrl: './phase-builder.component.html',
  styleUrl: './phase-builder.component.scss'
})
export class PhaseBuilderComponent {
	@Input() event!: EventBaseModel
}
