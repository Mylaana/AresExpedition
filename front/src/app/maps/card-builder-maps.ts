import { BuilderOption } from "../enum/global.enum";
import { ButtonDesigner } from "../factory/button-designer.service";
import { CardBuilder } from "../models/core-game/card-builder.model";
import { BuilderType } from "../types/phase-card.type";

function configBuilder(builderType: BuilderType, builderOption?:BuilderOption): CardBuilder{
    let builder = new CardBuilder
    if(BUILDER_CONFIG[builderType]){
        builder = BUILDER_CONFIG[builderType](builder, builderOption)
    }
    builderOption?builder.setOption(builderOption):null
    builder.addButtons(ButtonDesigner.createEventCardBuilderButton(0, builderOption))
    return builder
}

export const BUILDER_LIST_CONFIG: Record<BuilderType, (builderOption?: BuilderOption) => CardBuilder[]> = {
    'development_base':() => [
        configBuilder('development_base')
    ],
    'development_6mc':() => [
        configBuilder('development_6mc')
    ],
    'development_second_card':(builderOption) => [
        configBuilder('development_second_card'),
        configBuilder('development_second_card', builderOption)
    ],
    'developmentAbilityOnly':(builderOption) => [
        configBuilder('developmentAbilityOnly', builderOption)
    ],
    'construction_base':(builderOption) => [
        configBuilder('construction_base', builderOption)
    ],
    'construction_6mc':(builderOption) => [
        configBuilder('construction_6mc', builderOption)
    ],
    'construction_draw_card':(builderOption) => [
        configBuilder('construction_draw_card', builderOption)
    ],
    'constructionAbilityOnly':(builderOption) => [
        configBuilder('constructionAbilityOnly', builderOption)
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