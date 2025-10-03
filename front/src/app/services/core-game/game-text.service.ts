import { Injectable } from "@angular/core";
import jsonData from '../../../assets/data/game-text.json'
import { GameOptionName, SettingSupportedLanguage } from "../../types/global.type";
import { GameParamService } from "./game-param.service";
import { LocalizedText } from "../../types/project-card.type";
import { EventTitleKey } from "../../types/event.type";
import { map } from "rxjs";


const eventKeyPrefix = 'gameEventTitle'

@Injectable({
	providedIn: "root"
})
export class GameTextService{
	_language!: SettingSupportedLanguage
	_defaultLanguage: SettingSupportedLanguage = 'en'
	
	private translationMap!: Map<string, any>

	constructor(private gameParamService: GameParamService){
		gameParamService.currentLanguage.subscribe((l) => this._language = l)
		this.translationMap = new Map(Object.entries(jsonData))
	}
	private setKey(...args: string[]): string {
		let key: string = ''
		for(let i=0; i<args.length; i++){
			if(i!=0){
				key += '.'
			}
			key += args[i]
		}
		return key
	}
	getGameOptionCaption(option: GameOptionName): string {
		let result = this.translationMap.get(this.setKey('gameOption', option, 'caption'))
		return result[this._language] || result[this._defaultLanguage]
	}
	getGameOptionToolTip(option: GameOptionName): string {
		let result = this.translationMap.get(this.setKey('gameOption', option, 'tooltip'))
		return result[this._language] || result[this._defaultLanguage]
	}
	getEventTitle(eventTitlekey: EventTitleKey): string {
		let result = this.translationMap.get(this.setKey('gameEventTitle', eventTitlekey, 'caption'))
		return result[this._language] || result[this._defaultLanguage]
	}
	getPhaseCardTitle(abilityOrBonus: 'ability' | 'bonus'): string {
		let prefix = abilityOrBonus==='ability'?'Ability':'Bonus'
		let result = this.translationMap.get(this.setKey(`gamePhaseCard${prefix}`, 'title', 'caption'))
		return result[this._language] || result[this._defaultLanguage]
	}
	getPhaseCardDescription(abilityOrBonus: 'ability' | 'bonus', card: string): string {
		let prefix = abilityOrBonus==='ability'?'Ability':'Bonus'
		let result = this.translationMap.get(this.setKey(`gamePhaseCard${prefix}`, card, 'caption'))
		return result[this._language] || result[this._defaultLanguage]
	}
}
