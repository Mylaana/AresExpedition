import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { SupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'
import { GAME_SUPPORTED_LANGUAGE } from '../../global/global-const'

@Injectable({
  providedIn: 'root'
})
export class GameParamService {
	private gameIdSubject = new BehaviorSubject<string | null>(null)
	private clientIdSubject = new BehaviorSubject<string | null>(null)
	private debug = new BehaviorSubject<boolean>(false)
	private language = new BehaviorSubject<SupportedLanguage>('en')

	currentDebug = this.debug.asObservable()
	currentGameId = this.gameIdSubject.asObservable()
	currentClientId = this.clientIdSubject.asObservable()
	currentLanguage = this.language.asObservable()

	constructor(private router: Router){
	  this.router.events
		.pipe(filter(event => event instanceof NavigationEnd))
		.subscribe(() => {
		  this.updateParams()
		})

	  this.updateParams()
	}

	private updateParams() {
	  const urlSegments = this.router.url.split('/')
	  this.gameIdSubject.next(urlSegments[2] || null)
	  this.clientIdSubject.next(urlSegments[3] || null)
	}

	toggleDebug() {this.debug.next(this.debug.getValue()===false)}
	setNewLanguage(language: string){
		if(!GAME_SUPPORTED_LANGUAGE.includes(language as SupportedLanguage)){
			console.error('UNSUPPORTED LANGUAGE: ', language)
			return
		}
		this.language.next(language as SupportedLanguage)
		PlayableCardModel.setLanguage(language as SupportedLanguage)
	}
	getCurrentLanguage(): string {
		return this.language.getValue()
	}
  }
