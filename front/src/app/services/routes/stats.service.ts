import { Injectable } from "@angular/core";
import { Utils } from "../../utils/utils";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { StatsCardFamily, StatsRanking } from "../../types/project-card.type";
import { CardStats } from "../../interfaces/card.interface";
import { StatTooltipKey } from "../../types/text.type";


@Injectable()
export class StatService {
	rawStats: any
	rawCardStats!: CardStats[]
	corpoStats: CardStats[] = []
	projectStats: CardStats[] = []
	private baseSampleSize = 2
	private minimumPlayed = 2
	private cardsRanking: Record<StatsCardFamily, PlayableCardModel[]> = {
		corporation: [],
		project: [],
		greenProject: [],
		blueProject: [],
		redProject: []
	}

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
		this.fillCardsRanking()
	}
	fillCardsRanking(){
		this.cardsRanking['corporation'] = this.fillRanking('corporation')
		console.log(this.cardsRanking)
	}
	fillRanking(family: StatsCardFamily, ranking: StatsRanking = 'descending'){
		if(!this.rawCardStats){return []}
		console.log(family)
		let cards: CardStats[] = []
		switch(family){
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
				cards = this.projectStats.filter((el) => el.type===family)
				break
			}
		}
		if(ranking==='ascending'){
			cards = this.sortArray(cards, ranking)
		}

		let result: PlayableCardModel [] = []
		for(let i=0; i<cards.length; i++){
			let statCard = cards[i]
			if(!statCard){break}
			let card = this.cardInfoService.getCardById(statCard.code)
			if(!card){continue}
			card.stats = statCard

			result.push(card)
		}
		return result
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
		return this.cardsRanking[type]
	}
}
