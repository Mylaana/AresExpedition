package com.ares_expedition.enums.websocket;

public enum ContentResultEnum {
    //Player
    DRAW_RESULT,
    PLAYER_STATE,
    
    //Group
    READY_RESULT,
    NEXT_PHASE,
    GAME_STATE,

    //Other
    SERVER_SIDE_UNHANDLED,
    DEBUG,
    ACKNOWLEDGE
}