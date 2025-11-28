import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../../models/player-info/player-state.model";
import { PostGameDataTitle, RGB } from "../../../types/global.type";
import { POST_GAME_CATEGORY_TITLE, POST_GAME_DATA, POST_GAME_ROW_RELEVANCY, POST_GAME_ROW_TITLE } from "../../../maps/post-game-data-maps";
import { GameActiveContentService } from "../game-active-content.service";

const cardsData: PostGameDataTitle[] = ['titleCards', 'cardSeen']
const phaseSelected: PostGameDataTitle[] = ['titlePhaseSelected', 'phaseTotalDevelopment', 'phaseTotalConstruction', 'phaseTotalAction', 'phaseTotalProduction', 'phaseTotalResearch']
const parameterContribution: PostGameDataTitle[] = ['titleParameterContribution', 'contributionOcean', 'contributionTemperature', 'contributionOxygen', 'contributionInfrastructure', 'contributionMoonStructure']
const awardsMilestones: PostGameDataTitle[] = ['titleAwardsMilestones', 'totalAwards', 'totalMilestones']

@Injectable() 
export class PostGameService {
    private groupState!: PlayerStateModel[]
    _dataList!: PostGameDataTitle[]
    _rows: number[] = []
    _columns: number[] = []

    constructor(private activeContentService: GameActiveContentService){}

    initialize(groupState: PlayerStateModel[]){
        this.groupState = groupState
        this.initializeDataList()
        for(let i=0; i<=this._dataList.length; i++){
			this._rows.push(i)
		}
        for(let i=0; i<=this.groupState.length; i++){
			this._columns.push(i)
		}
    }
    private initializeDataList(){
        let tempList = cardsData
        tempList = this.addCatAndSeparator(tempList, phaseSelected)
        tempList = this.addCatAndSeparator(tempList, parameterContribution)
        tempList = this.addCatAndSeparator(tempList, awardsMilestones)

        this._dataList = []
        for(let t of tempList){
            if(this.isRowValid(t)){
                this._dataList.push(t)
            }
        }
	}
    getRows(): number[] {
        return this._rows
    }
    getColumns(): number[] {
        return this._columns
    }
    getPlayerName(column: number): string {
        if(column===0){return ''}
        return this.groupState[column -1].getName()
    }
    getPlayerColor(column: number): RGB {
        if(column===0){return '(0,0,0)' as RGB}
        return this.groupState[column -1].getColor() as RGB
    }
    getData(row: number, column: number): string {
        if(row===0){return this.getPlayerName(column)}
        if(column===0){return this.getRowTitle(row)}

        if(!this.groupState[column -1]){return '[PLAYERSTATE NOT FOUND]'}
        if(!POST_GAME_DATA || !POST_GAME_DATA[this._dataList[row -1]] || !((this._dataList[row -1] in POST_GAME_DATA))){return '[DATA NOT FOUND]'}
        return (POST_GAME_DATA[this._dataList[row -1]] as Function)(this.groupState[column -1])??''
    }
    getRowTitle(row: number): string {
        return POST_GAME_ROW_TITLE[this._dataList[row -1]]??'[RAW TITLE NO FOUND]: '+ this._dataList[row -1]
    }
    isLineSeparator(row: number): boolean {
        return this._dataList[row -1]==='lineSeparator'
    }
    isLineCategoryTitle(row: number): boolean {
        return this.getCategoryTitle(row)!=''
    }
    isLineData(row: number): boolean {
        if(this.isLineSeparator(row)){return false}
        if(this.isLineCategoryTitle(row)){return false}
        return true
    }
    private isRowValid(input: PostGameDataTitle): boolean {
        if(!(input in POST_GAME_ROW_RELEVANCY) || POST_GAME_ROW_RELEVANCY[input]===undefined){return true}
        return POST_GAME_ROW_RELEVANCY[input](this.activeContentService.getActiveContentList())
    }
    private addCatAndSeparator(current: PostGameDataTitle[], newCategory: PostGameDataTitle[]): PostGameDataTitle[] {
        let separator: PostGameDataTitle[] = ['lineSeparator']
        return current.concat(separator, newCategory)
    }
    getCategoryTitle(row: number): string {
        return POST_GAME_CATEGORY_TITLE[this._dataList[row -1]]??''
    }
}