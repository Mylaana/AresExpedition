import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { SettingCardSize } from '../../../../../types/global.type';
import { PrerequisiteTresholdType } from '../../../../../types/project-card.type';
import { PlayerStateModel } from '../../../../../models/player-info/player-state.model';
import { FormsModule } from "@angular/forms";
import { PlayableCard } from '../../../../../factory/playable-card.factory';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';

@Component({
    selector: 'app-card-prerequisite',
    imports: [
    CommonModule,
    TextWithImageComponent,
    FormsModule
],
    templateUrl: './card-prerequisite.component.html',
    styleUrl: './card-prerequisite.component.scss'
})
export class CardPrerequisiteComponent{
	@Input() prerequisiteText!: string
	@Input() prerequisiteSummary?: string
	@Input() prerequisiteTresholdType!: PrerequisiteTresholdType
	@Input() cardSize!: SettingCardSize
    @Input() projectCard!: PlayableCardModel
    @Input() refreshRequirements!: boolean
    @Input() playerState!: PlayerStateModel

    getRequirementBehavior(): string {
        if(!this.refreshRequirements){return ''}
        return 'refresh'
    }
    isPrerequisiteOk(): boolean {
        return PlayableCard.prerequisite.canBePlayed(this.projectCard, this.playerState)
    }
    getTresholdType(): string {
        if(!this.refreshRequirements){return ''}
        return ''
    }
    getBackgroundColors(): string[]{
        return []
        //'purple', 'red', 'yellow', 'white'
    }
}
