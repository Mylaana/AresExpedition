type DrawRule = 'draw' | 'research'
type CardType = 'redProject' | 'greenProject' | 'blueProject'
type PrerequisiteType = 'tag' | 'oxygen' | 'infrastructure' | 'ocean' | 'heat' | 'tr'
type PrerequisiteTresholdType = 'min' | 'max'

/**
 * cardNumber should be the requested card number
 * cardList the list of cards id provided by server
 * isFinalized should become true when object should go to garbage
 */
export class DrawModel {
    playerId!: number;
    drawRule!: DrawRule;
    cardNumber!: number;
    drawDate = new Date();
    isFinalized: boolean = false;
    cardList: number[] = [];
}