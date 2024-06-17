type DrawRule = 'draw' | 'research'
type CardType = 'redProject' | 'greenProject' | 'blueProject'
type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr'
type PrerequisiteTresholdType = 'min' | 'max'

export class DrawModel {
    playerId!: number;
    drawRule!: DrawRule;
    cardNumber!: number;
    keepNumber?: number;
    drawDate = new Date();
}