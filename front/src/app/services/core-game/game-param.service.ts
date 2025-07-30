import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { SettingCardSize, SettingSupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'
import { SETTING_CARD_SIZE, SETTING_SUPPORTED_LANGUAGE } from '../../global/global-const'

const CARD_SIZE_MAP: Record<SettingCardSize, Record<string, string>> = {
	small: {
		'--card-height--medium': '209px',
		'--card-width--small': '150px',
		'--card-text-size--small': '8.5px',
		'--card-element-padding--small': '1px',
		'--card-text-right-padding--small': '0px',

		'--card-cost-square-padding--small': '3px',
		'--card-cost-top-cost-padding--small': '6px',
		'--card-cost-current-cost-text-size--small': '13px',
		'--card-cost-not-current-cost-text-size--small': '8px',

		'--card-effect-height--small': '60px',
		'--card-effect-width--small': '50px',

		'--card-played-symbol-size--small': '15px',

		'--card-scaling-vp-one-vp-size--small': '16px',
		'--scaling-vp-description-padding--small': '5px',

		'--phase-card-title-font-size--small': '100%',
		'--phase-card-subtitle-font-size--small': '65%',
		'--phase-card-description-width--small': '100%',
		'--phase-card-description-padding--small': '2px',
		'--phase-card-description-font-size--small': '60%',
		'--phase-card-wrapper-title-padding--small': '7px',

		'--twi-effect-summary-image-height--small': '12px',
		'--twi-effect-text-image-height--small': '10px',
		'--twi-vp-text-size--small': '15px',
		'--twi-activate-image-height--small': '18px',
		'--twi-activate-text-height--small': '12px'
	},
	medium: {
		'--card-height--medium': '299px',
		'--card-width--medium': '214px',
		'--card-text-size--medium': '11px',
		'--card-element-padding--medium': '5px',
		'--card-text-right-padding--medium': '5px',

		'--card-cost-square-padding--medium': '6px',
		'--card-cost-top-cost-padding--medium': '15px',
		'--card-cost-current-cost-text-size--medium': '15px',
		'--card-cost-not-current-cost-text-size--medium': '11px',

		'--card-effect-height--medium': '75px',
		'--card-effect-width--medium': '75px',

		'--card-played-symbol-size--medium': '20px',

		'--card-scaling-vp-one-vp-size--medium': '20px',
		'--scaling-vp-description-padding--medium': '5px',

		'--phase-card-title-font-size--medium': '180%',
		'--phase-card-subtitle-font-size--medium': '110%',
		'--phase-card-description-width--medium': '90%',
		'--phase-card-description-padding--medium': '5px',
		'--phase-card-description-font-size--medium': '83%',
		'--phase-card-wrapper-title-padding--medium': '10px',

		'--twi-effect-summary-image-height--medium': '16px',
		'--twi-effect-text-image-height--medium': '14px',
		'--twi-vp-text-size--medium': '20px',
		'--twi-activate-image-height--medium': '20px',
		'--twi-activate-text-height--medium': '15px'
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
	private cardSize = new BehaviorSubject<SettingCardSize>('medium')
	private handCardSize = new BehaviorSubject<SettingCardSize>('medium')

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
		this.updateCardCssVariables('medium')
		this.updateCardCssVariables('small')
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
