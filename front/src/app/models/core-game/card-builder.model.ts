import { BuilderOption } from "../../enum/global.enum"
import { CardState } from "../../interfaces/card.interface"
import { ButtonGroupUpdateType, ButtonNames, EventCardBuilderButtonNames, NonEventButtonNames } from "../../types/global.type"
import { PlayableCardModel } from "../cards/project-card.model"
import { EventCardBuilderButton } from "./button.model"

type ButtonGroup = 'base' | 'option'

export class CardBuilder {
    private selectedCard!: PlayableCardModel | undefined
    private cardInitialState?: CardState
    private buttons: EventCardBuilderButton[] = []
    private optionButtons: EventCardBuilderButton[] = []
    private option!: BuilderOption
    private builderIsLocked: boolean = false
    private firstCardBuilt: boolean = false
    private discount: number = 0
    private alternativeCostUsed: NonEventButtonNames[] = []

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
    private updateButtonEnabled(name: EventCardBuilderButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.setEnabled(enabled)
    }
    private updateButtonGroupState(buttonName: ButtonGroupUpdateType): void {
        switch(buttonName){
            case('buildCard'):{
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
            case('discardSelectedCard'):{
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, true)
                this.updateButtonEnabled(BuilderOption.gain6MC, true)
                break
            }
            case(BuilderOption.drawCard):case(BuilderOption.gain6MC):{
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
            case('selectionCardSelected'):{
                this.updateButtonEnabled('buildCard', true)
                this.updateButtonEnabled('discardSelectedCard', true)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
            case('selectionCardDiscarded'):{
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, true)
                this.updateButtonEnabled(BuilderOption.gain6MC, true)
                break
            }
            case('resetState'):{
                if(this.builderIsLocked){break}
                this.resetButtons()
                break
            }
        }
    }
    public resetButtons(){
        if(this.builderIsLocked){return}
        for(let button of this.buttons){
            button.resetStartEnabled()
        }
    }
    resolveCardBuilderButtonClicked(button:EventCardBuilderButton){
        switch(button.name){
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
        this.updateButtonGroupState(button.name)
    }
    setSelectedCard(card: PlayableCardModel): void {
        this.selectedCard = card
        this.updateButtonGroupState('selectionCardSelected')
    }
    getSelectedCard(): PlayableCardModel | undefined {
        return this.selectedCard
    }
    getSelectedCardAsList(): PlayableCardModel[] {
        if(!this.selectedCard){return []}
        return [this.selectedCard]
    }
    removeSelectedCard(): void {
        console.log('remove', this.selectedCard)
        this.selectedCard = undefined
    }
    setBuilderIsLocked(locked?: boolean): void {this.builderIsLocked=locked??true}
    getBuilderIsLocked(): boolean {
        if(this.option===BuilderOption.developmentSecondBuilder && !this.firstCardBuilt){
            return true
        }
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
    setFirstCardBuilt(): void {
        if(this.option!=BuilderOption.developmentSecondBuilder){return}
        this.firstCardBuilt = true
        this.resetButtons()
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
}
