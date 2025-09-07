import { Injectable } from "@angular/core";
import jsonData from '../../../assets/data/game-text.json'
import { GameOptionName } from "../../types/global.type";

@Injectable({
	providedIn: "root"
})
export class GameTextService{
	static readonly language: string = 'en'

	getGameOptionCaption(option: GameOptionName): string {
		return jsonData['gameOption'][option]['caption']['en']
	}
	getGameOptionToolTip(option: GameOptionName): string {
		return jsonData['gameOption'][option]['tooltip']['en']
	}
}
