package com.ares_expedition.enums.websocket;

public enum ContentResultEnum {
    //Player
    DRAW_RESULT,
    PLAYER_STATE,
    PLAYER_CONNECT,
    OCEAN_RESULT,
    SCAN_KEEP_RESULT,
    RESEARCH_RESULT,
    
    //Group
    READY_RESULT,
    NEXT_PHASE,
    GAME_STATE,

    //Other
    SERVER_SIDE_UNHANDLED,
    DEBUG,
    ACKNOWLEDGE,
    SELECT_STARTING_HAND,
    SELECT_CORPORATION,
    SELECT_CORPORATION_MERGER
}