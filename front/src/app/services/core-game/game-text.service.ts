import { Injectable } from "@angular/core";
import jsonData from '../../../assets/data/game-text.json'
import { SettingSupportedLanguage } from "../../types/global.type";
import { GameParamService } from "./game-param.service";
import { ButtonCaptionKey, CreateGameKey, EventTitleKey, GameOptionKey } from "../../types/text.type";


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
	getGameOptionCaption(option: GameOptionKey): string {
		let result = this.translationMap.get(this.setKey('gameOption', option, 'caption'))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getGameOptionToolTip(option: GameOptionKey): string {
		let result = this.translationMap.get(this.setKey('gameOption', option, 'tooltip'))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getEventTitle(eventTitlekey: EventTitleKey): string {
		let result = this.translationMap.get(this.setKey('gameEventTitle', eventTitlekey, 'caption'))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getPhaseCardTitle(abilityOrBonus: 'ability' | 'bonus'): string {
		let prefix = abilityOrBonus==='ability'?'Ability':'Bonus'
		let result = this.translationMap.get(this.setKey(`gamePhaseCard${prefix}`, 'title', 'caption'))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getPhaseCardDescription(abilityOrBonus: 'ability' | 'bonus', card: string): string {
		let prefix = abilityOrBonus==='ability'?'Ability':'Bonus'
		let result = this.translationMap.get(this.setKey(`gamePhaseCard${prefix}`, card, 'caption'))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getCreateGameText(key: CreateGameKey): string {
		let result = this.translationMap.get(this.setKey('interfaceTitle', key))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
	getButtonCaption(key: ButtonCaptionKey): string {
		let result = this.translationMap.get(this.setKey('interfaceButton', key))
		if(!result){return 'MISSING TEXT IN JSON'}
		return result[this._language] || result[this._defaultLanguage]
	}
}
