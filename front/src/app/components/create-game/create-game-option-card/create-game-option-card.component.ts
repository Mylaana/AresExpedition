import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonWrapperComponent } from '../../tools/buttons/button-wrapper/button-wrapper.component';
import { AnyButton, GoToPage } from '../../../types/global.type';
import { fadeIn } from '../../../animations/animations';
import { GlobalInfo } from '../../../services/global/global-info.service';
import { Router } from '@angular/router';
import { ROUTE_CARD_OVERVIEW } from '../../../global/global-const';


@Component({
  selector: 'app-create-game-option-card',
  imports: [
	CommonModule,
	ButtonWrapperComponent
  ],
  templateUrl: './create-game-option-card.component.html',
  styleUrl: './create-game-option-card.component.scss',
  animations: [fadeIn]
})
export class CreateGameOptionCardComponent {
	@Input() button!: AnyButton
	@Input() caption!: string
	@Input() tooltip!: string
	@Input() isSubCat!: boolean
	@Input() goToPage!: GoToPage
	@Output() buttonClick = new EventEmitter<AnyButton>()

	_tooltipHovered: boolean = false

	constructor(private router: Router){}

	onToggleClick(){
		this.buttonClick.emit(this.button)
	}
	onGoToPageClick(){
		switch(this.goToPage){
			case('cardOverviewBalanced'):{
				this.router.navigate([ROUTE_CARD_OVERVIEW], { state: { filter: this.goToPage } });
				return
			}
		}
	}
	getGoToPageUrl(): string{
		switch(this.goToPage){
			case('cardOverviewBalanced'):{
				return GlobalInfo.getUrlFromName('$other_gotopage$')
			}
		}
	}
}
