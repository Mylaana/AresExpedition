import { Injectable } from "@angular/core";
import { Utils } from "../../utils/utils";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { ProjectCardInfoService } from "../cards/project-card-info.service";

interface CardStats {
	code: string,
	played: number,
	win: number,
	type: StatsCardFamily,
	winrate: number
}

export type StatsRanking = 'descending' | 'ascending'
export type StatsCardFamily = 'project' | 'corporation' | 'blueProject' | 'redProject' | 'greenProject'
export type StatsCardSubFamily = 'activableProject' | 'triggerProject'

@Injectable()
export class StatService {
	rawStats: any
	rawCardStats!: CardStats[]
	corpoStats: CardStats[] = []
	projectStats: CardStats[] = []
	private baseSampleSize = 10
	private minimumPlayed = 2

	constructor(private cardInfoService: ProjectCardInfoService){}

	initialize(stats: any){
		this.rawStats = stats
		this.rawCardStats = this.sortArray(this.getData('card_stats'), 'descending')
		for(let card of this.rawCardStats){
			if(card.played<this.minimumPlayed){continue}
			if(card.type==='corporation'){
				this.corpoStats.push(card)
			} else {
				this.projectStats.push(card)
			}
		}
	}
	sortArray(array: CardStats[], ranking: StatsRanking): CardStats[] {
		if(ranking==='descending'){
			let result = array.sort((a, b) => {
				if (b.winrate !== a.winrate) {
					return b.winrate - a.winrate;
				}
				return b.played - a.played;
			})
			return result
		} else {
			let result = array.sort((a, b) => {
				if (b.winrate !== a.winrate) {
					return a.winrate - b.winrate;
				}
				return a.played - b.played;
			})
			return result
		}

	}
	getData(name: string): any {
		if(!this.rawStats){return ''}
		if(!this.rawStats[name]){return 'cannot find '+ name}
		return this.rawStats[name]
	}
	getRanking(ranking: StatsRanking, type: StatsCardFamily, size: number = this.baseSampleSize): PlayableCardModel[] {
		if(!this.rawCardStats){return []}
		let cards: CardStats[] = []
		switch(type){
			case('corporation'):{
				cards = Utils.jsonCopy(this.corpoStats)
				break
			}
			case('project'):{
				cards = Utils.jsonCopy(this.projectStats)
				break
			}
			case('blueProject'):
			case('redProject'):
			case('greenProject'):{
				cards = this.projectStats.filter((el) => el.type===type)
				break
			}
		}
		if(ranking==='ascending'){
			cards = this.sortArray(cards, ranking)
		}
		//let cards = this.corpoStats.filter((el) => el.winrate===100)
		let result: PlayableCardModel [] = []
		for(let i=0; i<size; i++){
			let statCard = cards[i]
			if(!statCard){break}
			let card = this.cardInfoService.getCardById(statCard.code)
			if(!card){continue}
			if(statCard.winrate===undefined){

				console.log(card.cardCode)
				console.log(statCard)

				continue
			}
			card.statPlayed = statCard.played
			card.statWinrate = statCard.winrate

			result.push(card)
		}
		return result
	}
}
