import { Injectable } from '@angular/core'
import { BehaviorSubject, filter } from 'rxjs'
import { ToggleButton } from '../../models/core-game/button.model'
import { ToggleButtonNames } from '../../types/global.type'

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
	private gameOptions = new BehaviorSubject<GameOption> ({
		discovery: true,
		foundations: true,
		promo: true,
		fanmade: true,
		balanced: true,

		initialDraft: true,
		infrastructureMandatory: true,
		merger: true,
		standardUpgrade: true,
		deadHand: true,
		additionalAwards: true
	})

	currentGameOptions = this.gameOptions.asObservable()

	toggleOption(option: ToggleButtonNames){
		let newOption = this.gameOptions.getValue()
		switch(option){
			case('expansionDiscovery'):{
				newOption.discovery = newOption.discovery===false
				if(!newOption.discovery){
					newOption.standardUpgrade= false
					newOption.additionalAwards = false
				}
				break
			}
			case('expansionFoundations'):{
				newOption.foundations = !newOption.foundations
				if(!newOption.foundations){newOption.infrastructureMandatory = false}
				break
			}
			case('expansionPromo'):{newOption.promo = !newOption.promo; break}
			case('expansionDevFanMade'):{newOption.fanmade = !newOption.fanmade; break}
			case('expansionBalancedCards'):{newOption.balanced = !newOption.balanced; break}

			case('modeInitialDraft'):{newOption.initialDraft = !newOption.initialDraft; break}
			case('modeInfrastructureMandatory'):{newOption.infrastructureMandatory = !newOption.infrastructureMandatory; break}
			case('modeMerger'):{newOption.merger = !newOption.merger; break}
			case('modeStandardProjectPhaseUpgrade'):{newOption.standardUpgrade = !newOption.standardUpgrade; break}
			case('modeAdditionalAwards'):{newOption.additionalAwards = !newOption.additionalAwards; break}
			case('modeDeadHand'):{newOption.deadHand = !newOption.deadHand; break}
		}
		this.gameOptions.next(newOption)
	}
	getGameOptions():GameOption {
		return this.gameOptions.getValue()
	}
	toggleAllOptions(activate: boolean){
		let newOptions: GameOption = {
			discovery: activate,
			foundations: activate,
			promo: activate,
			fanmade: activate,
			balanced: activate,

			initialDraft: true,
			infrastructureMandatory: activate,
			merger: activate,
			standardUpgrade: activate,
			deadHand: activate,
			additionalAwards: activate
		}
		this.gameOptions.next(newOptions)
	}
  }
