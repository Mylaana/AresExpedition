import { Component, Input, OnInit, Output, EventEmitter, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../types/project-card.type';
import { CardOptions } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-card.component.html',
  styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent {
	@Input() options?: CardOptions;
	@Input() phaseCardLevel: number = 0;
	@Input() phaseIndex!: number;
	@Input() state!: CardState;
	@Output() cardStateChange: EventEmitter<{cardId: number, state:CardState}> = new EventEmitter<{cardId: number, state:CardState}>()

	selectable!: boolean;

	ngOnInit():void {
		if(this.phaseIndex===undefined){this.phaseIndex=0}
		this.selectable = false
	}

	cardClick(){
		//non selectable card should not be clickable either
		//if(this.selectable!=true){return}
		switch(this.state){
		  case 'disabled': {
			return
		  };
		  case 'default': {
			this.state = 'selected'
			break
		  };
		  case 'selected': {
			this.state = 'default'
			break
		  };
		}
		this.cardStateChange.emit({cardId:this.phaseCardLevel, state: this.state})
	  }
}
