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
    debug = 'DEBUG'
}
export enum SubscriptionEnum {
    player = 'PLAYER',
    group = 'GROUP'
}