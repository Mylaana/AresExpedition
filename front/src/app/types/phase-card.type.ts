export type PhaseCardType = undefined | DevelopmentPhaseType |  ConstructionPhaseType | ActionPhaseType | ProductionPhaseType | ResearchPhaseType
export type DevelopmentPhaseType = "development_base" | "development_6mc" | "development_second_card" | 'developmentAbilityOnly'
export type ConstructionPhaseType = "construction_base" | "construction_6mc" | "construction_draw_card" | 'constructionAbilityOnly'
export type ActionPhaseType = "action_base" | "action_repeat_two" | "action_scan_cards"
export type ProductionPhaseType = "production_base" | "production_7mc" | "production_1mc_activate_card"
export type ResearchPhaseType = "research_base" | "research_scan2_keep2" | "research_scan6_keep1"

export type BuilderType = DevelopmentPhaseType | ConstructionPhaseType
    /**
export type PhaseCardDevelopment = PhaseCardStandard
export type PhaseCardConstruction = PhaseCardStandard
export type PhaseCardAction = PhaseCardStandard
export type PhaseCardProduction = PhaseCardStandard
export type PhaseCardResearch = PhaseCardStandard
 */