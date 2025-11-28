import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { CommonModule } from '@angular/common';
import { PlayerNameComponent } from '../../../player-info/player-name/player-name.component';
import { PostGameDataTitle, RGB } from '../../../../types/global.type';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { PostGameService } from '../../../../services/core-game/components-services/post-game.service';


@Component({
	selector: 'app-post-game-global',
	imports: [
		CommonModule,
		PlayerNameComponent,
		TextWithImageComponent
	],
	templateUrl: './post-game-global.component.html',
	styleUrl: './post-game-global.component.scss',
	providers: [PostGameService]
})
export class PostGameGlobalComponent implements OnInit{
  	@Input() groupState!: PlayerStateModel[]

	_dataList: PostGameDataTitle[] = []
	_columns: number[] = []
	_rows: number[] = []

	constructor(
		private postGameService: PostGameService
	){}

	ngOnInit(): void {
		this.postGameService.initialize(this.groupState)
		this._rows = this.postGameService.getRows()
		this._columns = this.postGameService.getColumns()
		this._dataList = this.postGameService._dataList
		console.log(this.groupState)
	}
	getPlayerName(column: number): string {
		return this.postGameService.getPlayerName(column)
	}
	getPlayerColor(column: number): RGB {
		return this.postGameService.getPlayerColor(column)
	}
	getData(row: number, column: number): string {
		return this.postGameService.getData(row, column)
	}
	getRowTitle(row: number): string {
		return this.postGameService.getRowTitle(row)
	}
	getRows(): number[] {
		return this.postGameService.getRows()
	}
	getColumns(): number[] {
		return this.postGameService.getColumns()
	}
	getCategoryTitle(row: number): string {
		return this.postGameService.getCategoryTitle(row)
	}
	isLineSeparator(row: number): boolean {
		return this.postGameService.isLineSeparator(row)
	}
	isLineCategoryTitle(row: number): boolean {
		return this.postGameService.isLineCategoryTitle(row)
	}
	isLineData(row: number): boolean {
		return this.postGameService.isLineData(row)
	}
	getDataCellType(row: number, column: number): string {
		if(column===0){return 'row-title box'}
		if(row===0){return 'player-line'}
		return 'box'
	}
}
