package com.ares_expedition.model.factory;

import java.util.Map;

import com.ares_expedition.dto.websocket.messages.output.AckMessageOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.PlayerStateMessageOutputDTO;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;

public class MessageOutputFactory {
    public static BaseMessageOutputDTO createDEBUGMessage(Integer gameId, Object content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.DEBUG, content);
    }

    public static BaseMessageOutputDTO createPlayerReadyMessage(Integer gameId, Map<Integer, Boolean> content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.READY_RESULT, content);
    }

    public static BaseMessageOutputDTO createNextPhaseMessage(Integer gameId, GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.NEXT_PHASE, content);
    }

    public static BaseMessageOutputDTO createDrawResultMessage(Integer gameId, DrawResult content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.DRAW_RESULT, content);
    }

    public static BaseMessageOutputDTO createGameStateMessage(Integer gameId, GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.GAME_STATE, content);
    }

    public static BaseMessageOutputDTO createPlayerStateMessage(Integer gameId, PlayerStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.PLAYER_STATE, content);
    }

    public static AckMessageOutput createAck(Integer gameId, String uuid){
        return new AckMessageOutput(gameId, uuid);
    }

    public static BaseMessageOutputDTO createStartGameMessage(Integer gameId, Object content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.START_GAME, content);
    }
}
