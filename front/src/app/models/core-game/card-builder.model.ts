import { BuilderOption } from "../../enum/global.enum"
import { BuilderStatusDTO } from "../../interfaces/event-state.interface"
import { EventCardBuilderButtonNames, NonEventButtonNames } from "../../types/global.type"
import { Utils } from "../../utils/utils"
import { PlayableCardModel } from "../cards/project-card.model"
import { EventCardBuilderButton } from "./button.model"

type ButtonGroup = 'base' | 'option'

export class CardBuilder {
    private index!: number
    private selectedCard!: PlayableCardModel | undefined
    private buttons: EventCardBuilderButton[] = []
    private optionButtons: EventCardBuilderButton[] = []
    private option!: BuilderOption
    private builderIsLocked: boolean = false
    private discount: number = 0
    private alternativeCostUsed: NonEventButtonNames[] = []
    private alternativeOptionUsed: NonEventButtonNames[] = []

    addButton(button: EventCardBuilderButton, buttonGroup: ButtonGroup = 'base'): void {
        switch(buttonGroup){
            case('base'):{
                this.buttons.push(button)
                break
            }
            case('option'):{
                this.optionButtons.push(button)
                break
            }
        }
    }
    getButtons(buttonGroup: ButtonGroup = 'base'): EventCardBuilderButton[] {
        switch(buttonGroup){
            case('base'):{
                return this.buttons
            }
            case('option'):{
                return this.optionButtons
            }
        }
    }
    getButtonFromName(name: EventCardBuilderButtonNames): EventCardBuilderButton | undefined {
        for(let button of this.buttons){
            if(button.name===name){
                return button
            }
        }
        return
    }
    setOption(option: BuilderOption): void {this.option = option}
    getOption(): BuilderOption {return this.option}
    public resetButtons(){
        if(this.builderIsLocked){return}
        for(let button of this.buttons){
            button.resetStartEnabled()
        }
    }
    resolveCardBuilderButtonClicked(buttonName:NonEventButtonNames){
        switch(buttonName){
            case('discardSelectedCard'):{
                this.removeSelectedCard()
                break
            }
            case('buildCard'):case(BuilderOption.drawCard):case(BuilderOption.gain6MC):{
                this.setBuilderIsLocked()
                this.discount = 0
                break
            }
        }
    }
    setSelectedCard(card: PlayableCardModel): void {
        this.selectedCard = card
    }
    getSelectedCard(): PlayableCardModel | undefined {
        return this.selectedCard
    }
    getSelectedCardAsList(): PlayableCardModel[] {
        if(!this.selectedCard){return []}
        return [this.selectedCard]
    }
    removeSelectedCard(): void {
        this.selectedCard = undefined
    }
    setBuilderIsLocked(locked?: boolean): void {
        this.builderIsLocked=locked??true
    }
    getBuilderIsLocked(): boolean {
        return this.builderIsLocked
    }
    getBuitCardCode(): string | undefined {
        if(this.builderIsLocked===false){return}
        let card = this.getSelectedCard()
        if(!card){return}
        return card.cardCode
    }
    resetBuilder(): void {
        if(this.builderIsLocked){return}
        this.resetButtons()
        this.selectedCard = undefined
    }
    isLockingValidation(): boolean {
        return this.selectedCard!=undefined && this.builderIsLocked===false
    }
    addDiscount(discount: number){
        this.discount += discount
    }
    removeDiscount(){
        this.discount = 0
    }
    getDiscount(): number {
        return this.discount
    }
    getAlternativeCostUsed(): NonEventButtonNames[]{
        return this.alternativeCostUsed
    }
    setAlternativeCostUsed(name: NonEventButtonNames){
        this.alternativeCostUsed.push(name)
    }
    getAlternativeOptionUsed(): NonEventButtonNames[]{
        return this.alternativeOptionUsed
    }
    setAlternativeOptionUsed(name: NonEventButtonNames){
        this.alternativeOptionUsed.push(name)
    }
    isEligibleForNext(): boolean {
        if(this.alternativeOptionUsed.length!=0){return false}
        if(this.selectedCard && this.getBuilderIsLocked()){return false}
        return true
    }
    getIndex(): number {
        return this.index
    }
    setIndex(index: number){
        this.index = index
    }
    fromDto(dto: BuilderStatusDTO): void {
        this.setOption(dto.o)
        this.alternativeCostUsed = dto.ac
        this.alternativeOptionUsed = dto.ao
        this.discount = dto.d
    }
}
