import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceInfo } from '../../../interfaces/global.interface';
import { GlobalInfo } from '../../../services/global/global-info.service';
import { RessourceType } from '../../../types/global.type';
import { GAME_RESSOURCE_STEEL_BASE_REDUCTION, GAME_RESSOURCE_TITANIUM_BASE_REDUCTION } from '../../../global/global-const';

type Production = 'grey' | 'red' | 'blue'

@Component({
    selector: 'app-ressource-card',
    imports: [
        CommonModule
    ],
    templateUrl: './ressource-card.component.html',
    styleUrl: './ressource-card.component.scss'
})
export class RessourceCardComponent implements OnInit {
	//@Input() ressourceCard!: RessourceCardModel;
	@Input() playerId!: number;
	@Input() ressource!: RessourceInfo;
	@Input() handSize!: number
	_production!: Production

	imageUrl!: string;
	ngOnInit(): void {
		this.imageUrl = GlobalInfo.getUrlFromID(this.ressource.imageUrlId)
		switch(this.ressource.name){
				case('card'):{
						this._production = 'blue'
						break
				}
				case('steel'):case('titanium'):{
						this._production = 'grey'
						break
				}
				default:{
						this._production = 'red'
				}
		}
	}
	getValueModTotal(ressource: RessourceInfo): number {
		switch(ressource.name){
			case('steel'):{
				return ressource.valueMod + GAME_RESSOURCE_STEEL_BASE_REDUCTION
			}
			case('titanium'):{
				return ressource.valueMod + GAME_RESSOURCE_TITANIUM_BASE_REDUCTION
			}
			default:{return 0}
		}
	}
}
