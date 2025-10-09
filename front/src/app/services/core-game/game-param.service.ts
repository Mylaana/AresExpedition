import { ElementRef, Injectable, NgZone } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, debounceTime, filter, fromEvent, map, startWith } from 'rxjs'
import { SettingCardSize, SettingInterfaceSize, SettingPlayerPannelSize, SettingSupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'
import { SETTING_CARD_SIZE, SETTING_DEFAULT_LANGUAGE, SETTING_INTERFACE_SIZE, SETTING_PLAYERPANNEL_SIZE, SETTING_SUPPORTED_LANGUAGE } from '../../global/global-const'
import { ButtonBase } from '../../models/core-game/button.model'
import { EventBaseModel } from '../../models/core-game/event.model'

interface WindowSize {
	width: number,
	height: number
}

const CARD_SIZE_MAP: Record<SettingCardSize, Record<string, string>> = {
	small: {
		'--card-height--small': '209px',
		'--card-width--small': '150px',
		'--card-text-size--small': '8px',
		'--card-element-padding--small': '1px',
		'--card-text-right-padding--small': '0px',

		'--card-cost-square-padding--small': '3px',
		'--card-cost-top-cost-padding--small': '6px',
		'--card-cost-current-cost-text-size--small': '13px',
		'--card-cost-not-current-cost-text-size--small': '8px',

		'--card-effect-height--small': '60px',
		'--card-effect-width--small': '50px',

		'--card-stock-image-height--small': '18px',
		'--card-stock-text-size--small': '13px',

		'--card-played-symbol-size--small': '15px',

		'--scaling-vp-description-padding--small': '5px',

		'--card-title-size--small': '10px',

		'--phase-card-title-font-size--small': '100%',
		'--phase-card-subtitle-font-size--small': '65%',
		'--phase-card-description-width--small': '100%',
		'--phase-card-description-padding--small': '2px',
		'--phase-card-description-font-size--small': '60%',
		'--phase-card-wrapper-title-padding--small': '7px',

		'--twi-prerequisite-summary-text-image-height--medium': '13px',
		'--twi-effect-summary-image-height--small': '8px',
		'--twi-effect-text-image-height--small': '9px',
		'--twi-vp-text-size--small': '15px',
		'--twi-activate-image-height--small': '16px',
		'--twi-activate-text-height--small': '11px',
		'--twi-megacredit-text-offset-left--small': '0px',
		'--twi-megacredit-text-offset-top--small': '4px',
		'--twi-megacredit-text-size--small': '8px',

		'--builder-padding--small': '13px',
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

		'--card-stock-image-height--medium': '22px',
		'--card-stock-text-size--medium': '15px',

		'--card-played-symbol-size--medium': '20px',

		'--scaling-vp-description-padding--medium': '5px',

		'--card-title-size--medium': '14px',

		'--phase-card-title-font-size--medium': '180%',
		'--phase-card-subtitle-font-size--medium': '110%',
		'--phase-card-description-width--medium': '90%',
		'--phase-card-description-padding--medium': '5px',
		'--phase-card-description-font-size--medium': '83%',
		'--phase-card-wrapper-title-padding--medium': '10px',

		'--twi-prerequisite-summary-text-image-height--medium': '20px',
		'--twi-effect-summary-image-height--medium': '16px',
		'--twi-effect-text-image-height--medium': '14px',
		'--twi-vp-text-size--medium': '22px',
		'--twi-activate-image-height--medium': '20px',
		'--twi-activate-text-height--medium': '15px',
		'--twi-megacredit-text-offset-left--medium': '0px',
		'--twi-megacredit-text-offset-top--medium': '3px',
		'--twi-megacredit-text-size--medium': '10px',

		'--builder-padding--medium': '18px',
	},
}


@Injectable({
  providedIn: 'root'
})
export class GameParamService {
	private gameIdSubject = new BehaviorSubject<string | null>(null)
	private clientIdSubject = new BehaviorSubject<string | null>(null)
	private debug = new BehaviorSubject<boolean>(false)
	private language = new BehaviorSubject<SettingSupportedLanguage>(SETTING_DEFAULT_LANGUAGE)
	private cardSize = new BehaviorSubject<SettingCardSize>('medium')
	private handCardSize = new BehaviorSubject<SettingCardSize>('medium')
	private interfaceSize = new BehaviorSubject<SettingInterfaceSize>('medium')
	private windowSize = new BehaviorSubject<WindowSize>({height:0, width:0})
	private playerPannelSize = new BehaviorSubject<SettingPlayerPannelSize>('medium')

	currentDebug = this.debug.asObservable()
	currentGameId = this.gameIdSubject.asObservable()
	currentClientId = this.clientIdSubject.asObservable()
	currentLanguage = this.language.asObservable()
	currentCardSize = this.cardSize.asObservable()
	currentHandCardSize = this.handCardSize.asObservable()
	currentInterfaceSize = this.interfaceSize.asObservable()
	currentWindowSize = this.windowSize.asObservable()
	currentPlayerPannelSize = this.playerPannelSize.asObservable()

	constructor(
		private router: Router,
		private ngZone: NgZone
	){
	  this.router.events
		.pipe(filter(event => event instanceof NavigationEnd))
		.subscribe(() => {
		  this.updateParams()
		})

	  	this.updateParams()
		this.updateCardCssVariables('medium')
		this.updateCardCssVariables('small')
		this.ngZone.runOutsideAngular(() => {
			fromEvent(window, 'resize')
				.pipe(
					map(() => ({
						width: window.innerWidth,
						height: window.innerHeight,
					})),
					startWith({
						width: window.innerWidth,
						height: window.innerHeight,
					})
				)
				.subscribe(size => {
					this.ngZone.run(() => this.windowSize.next(size))
				});
		});
		this.adjustInterfaceSizeAtStart()
		this.setInitialLanguage()
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
		ButtonBase.setLanguage(language as SettingSupportedLanguage)
		EventBaseModel.setLanguage(language as SettingSupportedLanguage)
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
	getCurrentInterfaceSize(): string {
		return this.interfaceSize.getValue()
	}
	setInterfaceSize(value: string){
		if(!SETTING_INTERFACE_SIZE.includes(value as SettingInterfaceSize)){
			console.error('UNSUPPORTED INTERFACE SIZE: ', value)
			return
		}
		this.interfaceSize.next(value as SettingInterfaceSize)
	}
	getCurrentPlayerPannelSize(): string {
		return this.playerPannelSize.getValue()
	}
	setPlayerPannelSize(value: string){
		if(!SETTING_PLAYERPANNEL_SIZE.includes(value as SettingPlayerPannelSize)){
			console.error('UNSUPPORTED PLAYER PANNEL SIZE: ', value)
			return
		}
		this.playerPannelSize.next(value as SettingPlayerPannelSize)
	}
	private applyCssVars(vars: Record<string, string>) {
		const root = document.documentElement;
		for (const [key, value] of Object.entries(vars)) {
			root.style.setProperty(key, value);
		}
	}
	private adjustInterfaceSizeAtStart(){
		let size = this.windowSize.getValue()
		const root = document.documentElement;
		root.style.setProperty('--interface-line', '30px');
		root.style.setProperty('--interface-line-gap', '3px');
		root.style.setProperty('--player-pannel-padding', '1px');
		root.style.setProperty('--player-pannel-border', '1px');
			switch(true){
				case(size.width<1800):{
					this.interfaceSize.next('small')
					this.cardSize.next('small')
					this.handCardSize.next('small')
					this.playerPannelSize.next('small')
				break
			}
		}
	}
	private setInitialLanguage(){
		let initial = navigator.language.split('-')[0]
		if(SETTING_SUPPORTED_LANGUAGE.includes(initial as SettingSupportedLanguage)){
			this.setNewLanguage(initial)
		}
	}
  }
