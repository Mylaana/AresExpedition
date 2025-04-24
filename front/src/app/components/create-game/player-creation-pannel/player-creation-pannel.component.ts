import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PlayerCreationCardComponent } from '../player-creation-card/player-creation-card.component';
import { expandCollapseVertical } from '../../../animations/animations';
import { CreatePlayer } from '../../../interfaces/global.interface';

@Component({
    selector: 'app-player-creation-pannel',
    imports: [
        CommonModule,
        PlayerCreationCardComponent
    ],
    templateUrl: './player-creation-pannel.component.html',
    styleUrl: './player-creation-pannel.component.scss',
    animations: [expandCollapseVertical]
})
export class PlayerCreationPannelComponent implements OnInit, OnChanges{
	@Input() playerNumber: number = 1;
	@Output() updatePlayerList = new EventEmitter<CreatePlayer[]>()
	_playerIndexList!: number[];
	_players: CreatePlayer[] = []

	ngOnInit(): void {

	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['playerNumber'] && changes['playerNumber'].currentValue){
			this.setPlayerIndexList()
			this.removeSurplusPlayers()
			this.emitPlayerList()
		}
	}
	setPlayerIndexList(): void {
		this._playerIndexList = Array.from({ length: this.playerNumber }, (_, i) => i);
	}
	onPlayerDataValidated(playerData: CreatePlayer): void {
		this.removePreviousPlayerDataIfExists(playerData)
		this._players.push(playerData)
		this.emitPlayerList()
	}
	removePreviousPlayerDataIfExists(previousPlayerData: CreatePlayer): void {
		this._players = this._players.filter(item => item.index !== previousPlayerData.index);
	}
	public removeSurplusPlayers(): void {
		for(let player of this._players){
			if(player.index >= this.playerNumber){
				this._players = this._players.filter(item => item.index !== player.index);
			}
		}
	}
	emitPlayerList(): void {
		this._players.sort((a, b) => a.index - b.index)
		this.updatePlayerList.emit(this._players)
	}
}
