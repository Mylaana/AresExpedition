export enum MessageContentQueryEnum {
    drawQuery = 'DRAW_QUERY',
    ready = 'READY_QUERY',
    playerGameStateQuery = 'PLAYER_GAME_STATE_QUERY',
    selectedPhase = 'SELECTED_PHASE_QUERY',
    playerStatePush = 'PLAYER_STATE_PUSH',
	playerConnect = 'PLAYER_CONNECT',

    debug = 'DEBUG'
}
export enum PlayerMessageContentResultEnum {
    draw = 'DRAW_RESULT',
    gameState = 'GAME_STATE',
	startGame = 'START_GAME',
	playerConnect = 'PLAYER_CONNECT',

	acknowledge = 'ACKNOWLEDGE'
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
