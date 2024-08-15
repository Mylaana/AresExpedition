import { Injectable } from "@angular/core";

@Injectable()
export class Card {

	someAttr!: any

	cardMethodTest():void{
		console.log('this is card method test' , this.someAttr)
	}
}


export class CardState {
	selectable?: boolean = false
	selected?: boolean = false

	upgradable?: boolean = false
	upgraded?: boolean = false

    playable?: boolean = false
	activable?:boolean = false
}
