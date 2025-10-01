import { Injectable } from "@angular/core";
import jsonData from '../../../assets/data/game-text.json'
import { GameOptionName, SettingSupportedLanguage } from "../../types/global.type";
import { GameParamService } from "./game-param.service";
import { LocalizedText } from "../../types/project-card.type";
import { EventTitleKey } from "../../types/event.type";

@Injectable({
	providedIn: "root"
})
export class GameTextService{
	_language!: SettingSupportedLanguage
	_defaultLanguage: SettingSupportedLanguage = 'en'

	constructor(private gameParamService: GameParamService){
		gameParamService.currentLanguage.subscribe((l) => this._language = l)
	}

	getGameOptionCaption(option: GameOptionName): string {
		let result =  jsonData['gameOption'][option]['caption'][this._language]
		console.log(jsonData['gameOption'][option]['caption'])
		if(result === ''){
			return 	 jsonData['gameOption'][option]['caption'][this._defaultLanguage]
		}
		return result
	}
	getGameOptionToolTip(option: GameOptionName): string {
		let result =  jsonData['gameOption'][option]['tooltip'][this._language]
		if(result === ''){
			return 	 jsonData['gameOption'][option]['tooltip'][this._defaultLanguage]
		}
		return result
	}
	getEventTitleRaw(eventTitlekey: EventTitleKey): string {
		let result = jsonData['gameEventTitle'][eventTitlekey]['caption'][this._language] 
		if(result = ""){
			return jsonData['gameEventTitle'][eventTitlekey]['caption'][this._defaultLanguage]
		}
		return result
	}
}
