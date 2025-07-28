import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { SettingCardSize, SettingSupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'
import { SETTING_CARD_SIZE, SETTING_SUPPORTED_LANGUAGE } from '../../global/global-const'

@Injectable({
  providedIn: 'root'
})
export class GameParamService {
	private gameIdSubject = new BehaviorSubject<string | null>(null)
	private clientIdSubject = new BehaviorSubject<string | null>(null)
	private debug = new BehaviorSubject<boolean>(false)
	private language = new BehaviorSubject<SettingSupportedLanguage>('en')
	private cardSize = new BehaviorSubject<SettingCardSize>('medium')
	private handCardSize = new BehaviorSubject<SettingCardSize>('small')

	currentDebug = this.debug.asObservable()
	currentGameId = this.gameIdSubject.asObservable()
	currentClientId = this.clientIdSubject.asObservable()
	currentLanguage = this.language.asObservable()
	currentCardSize = this.cardSize.asObservable()
	currentHandCardSize = this.handCardSize.asObservable()

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
		if(!SETTING_SUPPORTED_LANGUAGE.includes(language as SettingSupportedLanguage)){
			console.error('UNSUPPORTED LANGUAGE: ', language)
			return
		}
		this.language.next(language as SettingSupportedLanguage)
		PlayableCardModel.setLanguage(language as SettingSupportedLanguage)
	}
	getCurrentLanguage(): string {
		return this.language.getValue()
	}
	setNewCardSize(value: string){
		if(!SETTING_CARD_SIZE.includes(value as SettingCardSize)){
			console.error('UNSUPPORTED CARD SIZE: ', value)
			return
		}
		this.cardSize.next(value as SettingCardSize)
	}
	getCurrentCardSize(): string {
		return this.cardSize.getValue()
	}
	getCurrentHandCardSize(): string {
		return this.handCardSize.getValue()
	}
  }
