import { Pipe, PipeTransform } from '@angular/core';
import { GameTextService } from '../services/core-game/game-text.service';
import { EventTitleKey } from '../types/text.type';

type pipeParam = 'interpolate'

@Pipe({
	name: 'eventTitleKeyPipe',
	pure: false
})
export class EventTitleKeyPipe implements PipeTransform {
	constructor(private gameTextService: GameTextService) {}

	transform(key: EventTitleKey, params?: Partial<Record<pipeParam, any>>): string {
		let translated = this.gameTextService.getEventTitle(key)
		if(params && 'interpolate' in params){
			translated = this.interpolateParams(translated, params.interpolate)
		}
		return translated
	}
	private interpolateParams(translated: string, interpolate: string[]): string {
		for(let i=0; i<interpolate.length; i++){
			translated = translated.replace(`$${i}$`.toString(), interpolate[i])
		}
		return translated
	}

}
