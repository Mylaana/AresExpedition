import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, filter } from 'rxjs'
import { SupportedLanguage } from '../../types/global.type'
import { PlayableCardModel } from '../../models/cards/project-card.model'

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

	constructor(private router: Router) {
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
	toggleLanguage() {
		let newLanguage: SupportedLanguage = 'en'
		if(this.language.getValue()==='en'){
			newLanguage = 'fr'
		} else {
			newLanguage = 'en'
		}
		this.language.next(newLanguage)
		PlayableCardModel.setLanguage(newLanguage)
		console.log('switched to :', newLanguage)
	}
  }
