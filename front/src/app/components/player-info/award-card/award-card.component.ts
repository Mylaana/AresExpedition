import { Component, Input } from '@angular/core';
import { AwardsEnum } from '../../../enum/global.enum';
import { MilestoneAwardService } from '../../../services/core-game/milestone-award.service';
import { CommonModule } from '@angular/common';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { AwardCard } from '../../../interfaces/global.interface';
import { PlayerColor } from '../../../types/global.type';

@Component({
  selector: 'app-award-card',
  imports: [
	CommonModule,
	TextWithImageComponent,
  ],
  templateUrl: './award-card.component.html',
  styleUrl: './award-card.component.scss'
})
export class AwardCardComponent {
	@Input() award!: AwardCard
	constructor(private milestoneAwardService: MilestoneAwardService){}

	getCaption(): string {
		return this.award.caption
	}
	isProduction(): boolean {
		return this.award.isProduction
	}
	getFirstColors(): PlayerColor[] {
		let firstValue = this.award.value[0].playersValue
		let colors: PlayerColor[] = []
		for(let p of this.award.value){
			if(p.playersValue===firstValue){
				colors.push(p.color)
			}
		}
		return colors
	}
	getSecondColors(): PlayerColor[] {
		let secondValue = this.getSecondValue()
		if(secondValue===undefined){return []}
		let secondPool = this.award.value.filter((el) => el.playersValue===secondValue)
		let colors: PlayerColor[] = this.getBestColorsFromPool({caption: '',isProduction: false, value:secondPool})
		return colors
	}
	getFirstValue(): number {
		return this.award.value[0].playersValue
	}
	getSecondValue(): number | undefined {
		if(this.getFirstColors().length>2){return}
		let firstValue: number = this.award.value[0].playersValue
		let secondPool = this.award.value.filter((el) => el.playersValue!=firstValue)
		if(secondPool.length===0){return}
		return secondPool[0].playersValue
	}
	getDisplaySecond(): boolean {
		return this.getFirstColors().length<=1
	}
	hasSecondValue(): boolean {
		return this.getSecondValue()!=undefined
	}
	private getBestColorsFromPool(pool: AwardCard): PlayerColor[]{
		let firstValue = pool.value[0].playersValue
		let colors: PlayerColor[] = []
		for(let p of pool.value){
			if(p.playersValue===firstValue){
				colors.push(p.color)
			}
		}
		return colors
	}
}
