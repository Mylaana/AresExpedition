import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { GameContentName, ToggleButtonNames } from '../../types/global.type'
import { GAME_OPTIONS_TEMPLATE } from '../../maps/const-maps'

export interface GameOption {
	discovery: boolean,
	foundations: boolean,
	promo: boolean,
	fanmade: boolean,
	balanced: boolean,

	initialDraft: boolean,
	infrastructureMandatory: boolean,
	merger: boolean,
	standardUpgrade: boolean
	deadHand: boolean
	additionalAwards: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CreateGameOptionService {
	//private createOptions: Record<GameContentName, boolean> = {...GAME_OPTIONS_TEMPLATE}
	private gameOptions = new BehaviorSubject<Record<GameContentName, boolean>> ({...GAME_OPTIONS_TEMPLATE})

	currentGameOptions = this.gameOptions.asObservable()

	toggleOption(option: ToggleButtonNames){
		let newOption = this.gameOptions.getValue()

		//toggle the option
		newOption[option] = newOption[option]===false

		//treat bound options
		switch(option){
			case('expansionDiscovery'):{
				if(newOption[option]===false){
					newOption['modeStandardProjectPhaseUpgrade'] = false
					newOption['modeAdditionalAwards'] = false
				}
				break
			}
			case('expansionFoundations'):{
				if(newOption[option]===false){
					newOption['modeInfrastructureMandatory'] = false
				}
				break
			}
		}
		this.gameOptions.next(newOption)
	}
	getGameOptions(): Partial<Record<GameContentName, boolean>> {
		let result: Partial<Record<GameContentName, boolean>> = {}
		let options = this.gameOptions.getValue()
		for(const k in options){
			const key = k as GameContentName
			const val = options[key]

			if(val!=false){
				result[key] = val
			}
		}
		return result
	}
	toggleAllOptions(activate: boolean){
		let options = this.gameOptions.getValue()

		for(const k in options){
			const key = k as GameContentName
			if(key==='modeInitialDraft'){
				options[key]=true
				continue
			}
			options[key] = activate
		}
		console.log(options)
		this.gameOptions.next(options)
	}
  }
