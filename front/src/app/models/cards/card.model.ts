import { Injectable } from "@angular/core";

@Injectable()
export class Card {

	someAttr!: any

	cardMethodTest():void{
		console.log('this is card method test' , this.someAttr)
	}
}
