export enum MessageContentQueryEnum {
    drawQuery = 'DRAW_QUERY',
    ready = 'READY_QUERY',
    playerGameState = 'PLAYER_GAME_STATE_QUERY',
    selectedPhase = 'SELECTED_PHASE_QUERY'
}
export enum PlayerMessageContentResultEnum {
    draw = 'DRAW_RESULT',
    gameState = 'GAME_STATE'
}
export enum GroupMessageContentResultEnum {
    ready = 'READY_RESULT',
    nextPhase = 'NEXT_PHASE',
    
    debug = 'DEBUG',
    serverSideUnhandled = 'SERVER_SIDE_UNHANDLED'
}
export enum SubscriptionEnum {
    player = 'PLAYER',
    group = 'GROUP'
}