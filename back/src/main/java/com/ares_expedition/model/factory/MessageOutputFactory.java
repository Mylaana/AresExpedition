package com.ares_expedition.model.factory;

import java.util.Map;

import com.ares_expedition.dto.websocket.serialized_message.answer.PlayerMessageAnswer;
import com.ares_expedition.dto.websocket.serialized_message.answer.content.GameStateContent;
import com.ares_expedition.dto.websocket.serialized_message.answer.content.PlayerStateContent;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;

public class MessageOutputFactory {
    public static PlayerMessageAnswer createDEBUGMessage(Integer gameId, Object content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.DEBUG, content);
    }
    public static PlayerMessageAnswer createPlayerReadyMessage(Integer gameId, Map<Integer, Boolean> content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.READY_RESULT, content);
    }
    public static PlayerMessageAnswer createNextPhaseMessage(Integer gameId, GameStateContent content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.NEXT_PHASE, content);
    }
    public static PlayerMessageAnswer createDrawResultMessage(Integer gameId, DrawResult content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.DRAW_RESULT, content);
    }
    public static PlayerMessageAnswer createGameStateMessage(Integer gameId, GameStateContent content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.GAME_STATE, content);
    }
    public static PlayerMessageAnswer createPlayerStateMessage(Integer gameId, PlayerStateContent content){
        return new PlayerMessageAnswer(gameId, ContentResultEnum.PLAYER_STATE, content);
    }
}
