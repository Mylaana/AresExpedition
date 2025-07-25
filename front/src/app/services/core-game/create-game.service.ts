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
	merger: boolean
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
		merger: true
	})

	currentGameOptions = this.gameOptions.asObservable()

	toggleOption(option: ToggleButtonNames){
		let newOption = this.gameOptions.getValue()
		switch(option){
			case('expansionDiscovery'):{newOption.discovery = newOption.discovery===false; break}
			case('expansionFoundations'):{newOption.foundations = !newOption.foundations; break}
			case('expansionPromo'):{newOption.promo = !newOption.promo; break}
			case('expansionDevFanMade'):{newOption.fanmade = !newOption.fanmade; break}
			case('expansionBalancedCards'):{newOption.balanced = !newOption.balanced; break}

			case('modeInitialDraft'):{newOption.merger = !newOption.initialDraft; break}
			case('modeInfrastructureMandatory'):{newOption.merger = !newOption.infrastructureMandatory; break}
			case('modeMerger'):{newOption.merger = !newOption.merger; break}
		}
		this.gameOptions.next(newOption)
	}
	getGameOptions():GameOption {
		return this.gameOptions.getValue()
	}
  }
