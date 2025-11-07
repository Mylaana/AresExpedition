import { Injectable } from "@angular/core";
import { InputRuleEnum } from "../../enum/global.enum";
import { InputRule } from "../../interfaces/global.interface";
import { GameState } from "../game-state/game-state.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";

@Injectable({
	providedIn: 'root'
})
export class InputFactoryService {
	private clientstate!: PlayerStateModel

	constructor(private gameStateService: GameState){
		this.gameStateService.currentClientState.subscribe(state => this.clientstate = state)
	}
	getInputParams(inputRule: InputRuleEnum): InputRule {
		switch(inputRule){
			case (InputRuleEnum.powerInfrastructure):{
				return {
					type: 'number',
					numberMin: 1,
					numberMax: this.clientstate.getRessourceInfoFromType('heat')?.valueStock
				}
			}
		}
	}
}
