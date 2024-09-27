import { DrawRule } from "../../types/global.type";

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
    keepCardNumber?: number;
}