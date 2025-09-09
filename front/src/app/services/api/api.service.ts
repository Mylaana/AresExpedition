import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GLOBAL_API_NEWGAME, GLOBAL_API_SESSION, ROUTE_404 } from '../../global/global-const';
import { ApiMessage } from '../../interfaces/websocket.interface';
import { myUUID } from '../../types/global.type';
import { GameParamService } from '../core-game/game-param.service';
import { Router } from '@angular/router';


@Injectable({
	providedIn: 'root'
})
export class ApiService {

	private sessionValid = new BehaviorSubject<boolean>(false)
	currentSessionValid = this.sessionValid.asObservable()

	private gameId!: myUUID
	private playerId!: myUUID
	private validationSent: boolean = false
	constructor(
		private http: HttpClient,
		private gameParam: GameParamService,
		private router: Router
	){
		gameParam.currentGameId.subscribe((gameId) => {
			if(!gameId){return}
			this.gameId = gameId
			this.onParsedIdsvalidateSession()
		})
		gameParam.currentClientId.subscribe((playerId) => {
			if(!playerId){return}
			this.playerId = playerId
			this.onParsedIdsvalidateSession()
		})
	}

	createGame(gameConfig: any): Observable<ApiMessage> {
	 	return this.http.post<ApiMessage>(GLOBAL_API_NEWGAME, gameConfig)
	}
	onParsedIdsvalidateSession() {
		if(!this.gameId || !this.playerId){return}
		if(this.validationSent){return}
		this.validationSent = true
		const url = `${GLOBAL_API_SESSION}/${this.gameId}/${this.playerId}`
		this.http.get(url, {observe: 'response'}).subscribe({
			next: (resp) => {
				if(resp.status===200){
					this.sessionValid.next(true)
				}
			},
			error: (resp) => {
				this.router.navigate([ROUTE_404])
			}
		})
	}
}
