import { Component, Input, OnInit } from '@angular/core';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { NonEventButtonNames, SettingCardSize } from '../../../types/global.type';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { CommonModule } from '@angular/common';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { CardBuilderEventHandlerService } from '../../../services/core-game/card-builder-event-handler.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-card-builder-alternative-option',
	imports: [
		CommonModule,
		EventCardBuilderButtonComponent
	],
	templateUrl: './card-builder-alternative-option.component.html',
	styleUrl: './card-builder-alternative-option.component.scss'
})
export class CardBuilderAlternativeOptionComponent implements OnInit{
	@Input() builder!: CardBuilder
	@Input() cardSize!: SettingCardSize

	_buttons: EventCardBuilderButton[] = []
	_used: NonEventButtonNames[] = []
	
	private destroy$ = new Subject<void>

	constructor(private builderService: CardBuilderEventHandlerService){}

	ngOnInit(): void {
		this._buttons = this.builder.getButtons('option')
		this._used = this.builder.getAlternativeOptionUsed()
		this.builderService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateButtonEnabled())
		this.updateButtonEnabled()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onButtonClicked(button: EventCardBuilderButton){
		this.builderService.onAlternativeOptionButtonClicked(button, this.builder)
		this._used.push(button.name)
		this.updateButtonEnabled()
	}
	private updateButtonEnabled(){
		for(let b of this._buttons){
			b.setEnabled(this.getButtonEnabled())
		}
	}
	private getButtonEnabled(): boolean {
		if(this.builder.getSelectedCard()){return false}
		return this._used.length===0
	}
}
