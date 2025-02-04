export type PhaseCardType = undefined | DevelopmentPhaseType |  ConstructionPhaseType | ActionPhaseType | ProductionPhaseType | ResearchPhaseType
export type PhaseCardUpgradeType = DevelopmentUpgradeType | ConstructionUpgradeType | ActionUpgradeType | ProductionUpgradeType | ResearchUpgradeType
export type DevelopmentPhaseType = "development_base" |  'developmentAbilityOnly' | DevelopmentUpgradeType
export type DevelopmentUpgradeType = "development_6mc" | "development_second_card"

export type ConstructionPhaseType = "construction_base" | 'constructionAbilityOnly' | ConstructionUpgradeType
export type ConstructionUpgradeType = "construction_6mc" | "construction_draw_card"

export type ActionPhaseType = "action_base" | "actionAbilityOnly" | ActionUpgradeType
export type ActionUpgradeType = "action_repeat_two" | "action_scan_cards"

export type ProductionPhaseType = "production_base" | "productionAbilityOnly" | ProductionUpgradeType
export type ProductionUpgradeType = "production_7mc" | "production_1mc_activate_card"

export type ResearchPhaseType = "research_base" | "researchAbilityOnly" | ResearchUpgradeType
export type ResearchUpgradeType = "research_scan2_keep2" | "research_scan6_keep1"

export type BuilderType = DevelopmentPhaseType | ConstructionPhaseType
