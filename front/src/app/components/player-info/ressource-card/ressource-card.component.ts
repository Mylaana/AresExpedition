import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RessourceInfo } from '../../../interfaces/global.interface';
import { GlobalInfo } from '../../../services/global/global-info.service';

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
}
