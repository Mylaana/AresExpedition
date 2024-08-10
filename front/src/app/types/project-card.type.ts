export type CardState = 'default' | 'selected' | 'disabled' | 'activable' | 'upgraded'
export type SummaryType = 'action' | 'trigger' | 'production' | 'greyProduction' | undefined
export type CardType = 'redProject' | 'greenProject' | 'blueProject' | undefined
export type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr' | undefined
export type PrerequisiteTresholdType = 'min' | 'max' | undefined
