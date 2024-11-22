export enum MessageContentQueryEnum {
    drawQuery = 'DRAW_QUERY',
    ready = 'READY_QUERY',
    gameState = 'GAME_STATE'
}
export enum PlayerMessageContentResultEnum {
    draw = 'DRAW_RESULT',
}
export enum GroupMessageContentResultEnum {
    ready = 'READY_RESULT',
    nextPhase = 'NEXT_PHASE',
    debug = 'DEBUG'
}
export enum SubscriptionEnum {
    player = 'PLAYER',
    group = 'GROUP'
}