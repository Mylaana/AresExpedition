import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { SettingCardSize } from '../../../../../types/global.type';
import { PrerequisiteTresholdType } from '../../../../../types/project-card.type';
import { PlayerStateModel } from '../../../../../models/player-info/player-state.model';
import { FormsModule } from "@angular/forms";
import { PlayableCard } from '../../../../../factory/playable-card.factory';
import { PlayableCardModel } from '../../../../../models/cards/project-card.model';
import { CardRequirements } from '../../../../../interfaces/card.interface';
import { Checker } from '../../../../../utils/checker';

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
export class CardPrerequisiteComponent implements OnInit{
	@Input() prerequisiteText!: string
	@Input() prerequisiteSummary?: string
	@Input() prerequisiteTresholdType!: PrerequisiteTresholdType
	@Input() cardSize!: SettingCardSize
    @Input() projectCard!: PlayableCardModel
    @Input() refreshRequirements!: boolean
    @Input() playerState!: PlayerStateModel

    _requirements!: CardRequirements | undefined
    private requirementsColors: string[] = []

    ngOnInit(): void {
        this._requirements = PlayableCard.prerequisite.getRequirements(this.projectCard.cardCode)
        if(!this._requirements || !this._requirements.globalParameterColor){return}
        for(let r of Checker.getValidColorList(this._requirements?.globalParameterColor, this._requirements.treshold, 0)){
            this.requirementsColors.push(r.toLowerCase())
        }
    }

    getRequirementBehavior(): string {
        if(!this.refreshRequirements){return ''}
        return 'refresh'
    }
    isPrerequisiteOk(): boolean {
        return PlayableCard.prerequisite.canBePlayed(this.projectCard, this.playerState)
    }
    getTresholdType(): string {
        if(!this.refreshRequirements){return ''}
        if(!this._requirements){return ''}

        return this._requirements.treshold
    }
    getBackgroundColors(): string[]{
        return this.requirementsColors
        //'purple', 'red', 'yellow', 'white'
    }
}
