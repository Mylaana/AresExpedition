import { BuilderOption } from "../enum/global.enum";
import { ButtonDesigner } from "../factory/button-designer.service";
import { EventFactory } from "../factory/event/event-factory";
import { CardBuilder } from "../models/core-game/card-builder.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { EventCardBuilderButtonNames, NonEventButtonNames } from "../types/global.type";
import { BuilderType } from "../types/phase-card.type";
import { Checker } from "../utils/checker";


function configBuilder(builderType: BuilderType, builderOption?:BuilderOption): CardBuilder{
    let builder = new CardBuilder
    if(BUILDER_CONFIG[builderType]){
        builder = BUILDER_CONFIG[builderType](builder, builderOption)
    }
    builderOption?builder.setOption(builderOption):null
    builder.addButton(ButtonDesigner.createEventCardBuilderButton('buildCard'))
    builder.addButton(ButtonDesigner.createEventCardBuilderButton('discardSelectedCard'))
    return builder
}

export const BUILDER_LIST_CONFIG: Record<BuilderType, (builderOption?: BuilderOption) => CardBuilder[]> = {
    'development_base':() => [
        configBuilder('development_base')
    ],
    'development_6mc':() => [
        configBuilder('development_6mc')
    ],
    'development_second_card':() => [
        configBuilder('development_second_card'),
        configBuilder('development_second_card', BuilderOption.developmentSecondBuilder)
    ],
    'developmentAbilityOnly':() => [
        configBuilder('developmentAbilityOnly')
    ],
    'construction_base':() => [
        configBuilder('construction_base'),
        configBuilder('construction_base', BuilderOption.drawCard)
    ],
    'construction_6mc':() => [
        configBuilder('construction_base'),
        configBuilder('construction_6mc', BuilderOption.gain6MC)
    ],
    'construction_draw_card':() => [
        configBuilder('construction_base'),
        configBuilder('construction_draw_card')
    ],
    'constructionAbilityOnly':() => [
        configBuilder('constructionAbilityOnly')
    ],
    'specialBuilder':(builderOption) => [
        configBuilder('specialBuilder', builderOption)
    ],
}

const BUILDER_CONFIG: Partial<Record<BuilderType, (builder: CardBuilder, builderOption?: BuilderOption) => CardBuilder>> = {
    'development_base':(builder) => {
        builder.addDiscount(3)
        return builder
    },
    'development_6mc':(builder) => {
        builder.addDiscount(6)
        return builder
    },
    'development_second_card':(builder, builderOption) => {
        if(!builderOption){
            builder.addDiscount(3)
        }
        return builder
    },
    'construction_base': (builder, option) => {
        if(option){
            builder.addButton(ButtonDesigner.createEventCardBuilderButton(option), 'option')
        }
        return builder
    },
    'construction_6mc': (builder, option) => {
        if(option){
            builder.addButton(ButtonDesigner.createEventCardBuilderButton(option), 'option')
        }
        return builder
    },
    'specialBuilder':(builder, builderOption) => {
        if(!builderOption || !SPECIAL_BUILDER_CONFIG[builderOption]){return builder}
        return SPECIAL_BUILDER_CONFIG[builderOption](builder)
    }
}

const SPECIAL_BUILDER_CONFIG: Partial<Record<BuilderOption, (builder: CardBuilder)=> CardBuilder>> = {
    'assortedEnterprises':(builder) =>{
        builder.addDiscount(2)
        return builder
    },
    'conscription':(builder) =>{
        builder.addDiscount(16)
        return builder
    },
    'green9MCFree':(builder) =>{
        builder.addDiscount(100)
        return builder
    },
    'maiNiProductions':(builder) =>{
        builder.addDiscount(100)
        return builder
    },
    'selfReplicatingBacteria':(builder) =>{
        builder.addDiscount(25)
        return builder
    },
    'workCrews':(builder) =>{
        builder.addDiscount(11)
        return builder
    },
}

export const ALTERNATIVE_PAY_EVENT: Partial<Record<NonEventButtonNames,  (cardBuilder: CardBuilder) => CardBuilder>> = {
    'alternativePayAnaerobicMicroorganisms': (builder) => {
        builder.addDiscount(10)
        builder.setAlternativeCostUsed('alternativePayAnaerobicMicroorganisms')
        return builder
    },
    'alternativePayRestructuredResources': (builder) => {
        builder.addDiscount(5)
        builder.setAlternativeCostUsed('alternativePayRestructuredResources')
        return builder
    },
}

export const ALTERNATIVE_PAY_BUTTON_NAME: Record<string,() => NonEventButtonNames> = {
	//Anaerobic Microorganisms
	'5': () => 'alternativePayAnaerobicMicroorganisms',
		//Anaerobic Microorganisms
	'52': () => 'alternativePayRestructuredResources'
}
export const ALTERNATIVE_PAY_BUTTON_CLICKED_EVENTS: Partial<Record<NonEventButtonNames, () => EventBaseModel[]>> ={
	'alternativePayAnaerobicMicroorganisms': () => [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:-2}, '5')],
	'alternativePayRestructuredResources': () => [EventFactory.simple.addRessource({name:'plant', valueStock:-1})]
}
export const ALTERNATIVE_PAY_REQUIREMENTS: Partial<Record<NonEventButtonNames, (clientState: PlayerStateModel) => boolean>> ={
	'alternativePayAnaerobicMicroorganisms': (c) => c.getProjectPlayedStock('5')[0].valueStock>=2,
	'alternativePayRestructuredResources': (c) => Checker.isRessourceOk('plant', 1, 'min', c),
}

export const ALTERNATIVE_OPTION_BUTTON_CLICKED_EVENTS: Partial<Record<EventCardBuilderButtonNames, () => EventBaseModel[]>> = {
    'drawCard': () => [
        EventFactory.simple.draw(1)
    ],
    'gain6MC': () => [
        EventFactory.simple.addRessource({name:'megacredit', valueStock: 6})
    ]
}