import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { SettingCardSize, SettingSupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'
import { SETTING_CARD_SIZE, SETTING_SUPPORTED_LANGUAGE } from '../../global/global-const'

const CARD_SIZE_MAP: Record<SettingCardSize, Record<string, string>> = {
	small: {
		'--card-width': '150px',
		'--card-text-size': '8.5px',
		'--card-element-padding': '1px',
		'--card-text-right-padding': '0px',

		'--card-cost-square-padding': '3px',
		'--card-cost-top-cost-padding': '6px',
		'--card-cost-current-cost-text-size': '13px',
		'--card-cost-not-current-cost-text-size': '8px',

		'--card-effect-height': '60px',
		'--card-effect-width': '50px',
	},
	medium: {
		'--card-width': '214px',
		'--card-text-size': '11px',
		'--card-element-padding': '5px',
		'--card-text-right-padding': '5px',

		'--card-cost-square-padding': '6px',
		'--card-cost-top-cost-padding': '15px',
		'--card-cost-current-cost-text-size': '15px',
		'--card-cost-not-current-cost-text-size': '11px',

		'--card-effect-height': '75px',
		'--card-effect-width': '75px',
	},
}


@Injectable({
  providedIn: 'root'
})
export class GameParamService {
	private gameIdSubject = new BehaviorSubject<string | null>(null)
	private clientIdSubject = new BehaviorSubject<string | null>(null)
	private debug = new BehaviorSubject<boolean>(false)
	private language = new BehaviorSubject<SettingSupportedLanguage>('en')
	private cardSize = new BehaviorSubject<SettingCardSize>('small')
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
		this.updateCardCssVariables(this.cardSize.getValue())
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
		this.updateCardCssVariables(value as SettingCardSize)
	}
	getCurrentCardSize(): string {
		return this.cardSize.getValue()
	}
	setNewHandCardSize(value: string){
		if(!SETTING_CARD_SIZE.includes(value as SettingCardSize)){
			console.error('UNSUPPORTED CARD SIZE: ', value)
			return
		}
		this.handCardSize.next(value as SettingCardSize)
	}
	getCurrentHandCardSize(): string {
		return this.handCardSize.getValue()
	}
	updateCardCssVariables(size: SettingCardSize) {
		this.applyCssVars(CARD_SIZE_MAP[size]);
	}
	private applyCssVars(vars: Record<string, string>) {
		const root = document.documentElement;
		for (const [key, value] of Object.entries(vars)) {
			root.style.setProperty(key, value);
		}
	}
  }
